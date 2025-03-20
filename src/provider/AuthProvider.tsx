// AuthProvider.js
import { UserInfo } from "firebase/auth";
import { createContext, SetStateAction, useEffect, useState } from "react";
import { firebaseAuth, googleProvider, firebase } from "@/lib/firebase/client";

interface AuthContextType {
  user: UserInfo | null;
  handleLoginWithGoogle: () => void;
  handleLogout: () => Promise<void>;
  // handleRegisterWithEmail: (email: string, password: string) => void;
  // handleLoginWithEmail: (email: string, password: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const onAuthStateChanged = () => {
    return firebaseAuth.onAuthStateChanged(
      (user: SetStateAction<UserInfo | null>) => {
        if (user) {
          const u = user as UserInfo;
          const uid = u.uid;
          const email = u.email;
          console.log(`uid: ${uid} email: ${email}`);
          setUser(user);
        } else {
          console.log("Not logged");
          setUser(null);
        }
        setLoading(false);
      }
    );
  };

  const setPersistence = () => {
    firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
  };

  const handleLoginWithGoogle = () => {
    firebaseAuth
      .signInWithPopup(googleProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        /*  var credential = result.credential; */
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* const handleRegisterWithEmail = (email: string, password: string) => {
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
      });
  }; */

  /* const handleLoginWithEmail = (email: string, password: string) => {
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
      });
  }; */

  const handleLogout = () => {
    return firebaseAuth.signOut().finally(() => {
      setUser(null);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged();
    setPersistence();
    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    user,
    handleLoginWithGoogle,
    handleLogout,
    // handleRegisterWithEmail,
    // handleLoginWithEmail,
    loading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
export type { AuthContextType };
