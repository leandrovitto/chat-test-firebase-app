import { firebase, firebaseDatabase } from "@/lib/firebase/client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export interface PresenceUser {
  state: string;
  displayName: string;
  photoURL: string;
  last_changed: any;
}

type PresenceContextType = {
  onlineUsers: PresenceUser[];
  offLineUsers: PresenceUser[];
};

export const PresenceContext = createContext<PresenceContextType>({
  onlineUsers: [],
  offLineUsers: [],
});

export const PresenceProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [offLineUsers, setOfflineUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const userId = firebase.auth().currentUser?.uid;
    if (!userId) {
      return;
    }

    const userStatusDatabaseRef = firebaseDatabase.ref(`/status/${userId}`);

    const isOfflineForDatabase = {
      state: "offline",
      displayName: user.displayName,
      photoURL: user.photoURL,
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    const isOnlineForDatabase = {
      state: "online",
      displayName: user.displayName,
      photoURL: user.photoURL,
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const connectedRef = firebaseDatabase.ref(".info/connected");
    connectedRef.on("value", (snapshot) => {
      if (snapshot.val() === false) {
        console.log("User is not connected");
        return;
      }

      console.log("User is connected");
      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(() => {
          console.log(
            "onDisconnect set to offline. Setting user status to online."
          );
          userStatusDatabaseRef.set(isOnlineForDatabase);
        });
    });

    const onlineUsersRef = firebaseDatabase.ref("/status");
    onlineUsersRef.on("value", (snapshot) => {
      const users = snapshot.val() || {};

      const userArr = Object.keys(users);
      const onlineUsrs: PresenceUser[] = [];
      const offlineUsrs: PresenceUser[] = [];

      userArr.forEach((uid) => {
        const element = users[uid];
        if (element.state === "online") {
          onlineUsrs.push(element);
        } else {
          offlineUsrs.push(element);
        }
      });

      setOnlineUsers(onlineUsrs);
      setOfflineUsers(offlineUsrs);
    });

    return () => {
      userStatusDatabaseRef.set(isOfflineForDatabase);
      onlineUsersRef.off();
    };
  }, [loading, user]);

  return (
    <PresenceContext.Provider value={{ onlineUsers, offLineUsers }}>
      {children}
    </PresenceContext.Provider>
  );
};
