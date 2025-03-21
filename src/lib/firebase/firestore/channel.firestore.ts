import { firebase, firebaseStorageRef } from "@/lib/firebase/client";
import { MESSAGES_COLLECTION } from "./message.firestore";

// Define the structure of a Channel document in Firestore
export interface Channel {
  id?: string; // Optional: Firestore document ID
  name: string; // Name of the channel
  description?: string; // Optional: Description of the channel
  createdBy: string; // User ID of the channel creator
  createdAt: firebase.firestore.Timestamp | firebase.firestore.FieldValue; // Timestamp when the channel was created
  isPublic: boolean; // Whether the channel is public or private
  members?: string[]; // Optional: List of user IDs who are members of the channel
}

// Define a constant for the Firestore collection name
const CHANNELS_COLLECTION = "channels";

/**
 * Creates a new channel in the Firestore database.
 *
 * @param channel - The channel data (excluding id, createdAt, and createdBy)
 * @param userId - The ID of the user creating the channel
 * @returns The ID of the newly created channel document
 */
export const createChannel = async (
  channel: Omit<Channel, "id" | "createdAt" | "createdBy">,
  userId: string
): Promise<string> => {
  // Prepare the channel data with additional fields
  const ch = {
    ...channel,
    createdBy: userId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Use Firestore server timestamp
  };

  // Add the channel to the Firestore collection and return the document ID
  const docRef = await firebase
    .firestore()
    .collection(CHANNELS_COLLECTION)
    .add(ch);
  return docRef.id;
};

/**
 * Subscribes to the list of channels in Firestore and listens for real-time updates.
 *
 * @param callback - A function to handle the updated list of channels
 * @returns A Firestore unsubscribe function to stop listening for updates
 */
export const getChannels = (callback: (channels: Channel[]) => void) => {
  return firebase
    .firestore()
    .collection(CHANNELS_COLLECTION)
    .orderBy("createdAt", "asc") // Order channels by creation time in ascending order
    .onSnapshot(
      (snapshot) => {
        // Map Firestore documents to Channel objects
        const channels = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Channel)
        );
        callback(channels); // Pass the updated list of channels to the callback
      },
      (error) => console.error("Error loading channels", error) // Log any errors
    );
};

/**
 * Retrieves a single channel document from Firestore by its ID.
 *
 * @param channelId - The ID of the channel to retrieve
 * @returns The channel document with the specified ID
 */
export const getChannelById = async (channelId: string): Promise<Channel> => {
  // Get the channel document by ID
  const doc = await firebase
    .firestore()
    .collection(CHANNELS_COLLECTION)
    .doc(channelId)
    .get();

  // Return the channel data if the document exists, otherwise throw an error
  if (doc.exists) {
    return { id: doc.id, ...doc.data() } as Channel;
  } else {
    throw new Error(`Channel not found with ID: ${channelId}`);
  }
};

/**
 * Deletes a channel from the Firestore database.
 *
 *
 * @param channelId - The ID of the channel to delete
 * @param userId - The ID of the user deleting the channel
 * @returns void
 *
 *
 */
export const deleteChannel = async (channelId: string, userId: string) => {
  const ch = await firebase
    .firestore()
    .collection(CHANNELS_COLLECTION)
    .doc(channelId)
    .get();
  const rule = ch.data()?.createdBy !== userId;

  if (rule) {
    console.log("You are not the owner of this channel");
    return;
  }

  // Delete associated storage directory
  const storageRef = firebaseStorageRef.child(`uploads/${channelId}`);
  await deleteStorageDirectory(storageRef);

  const db = firebase.firestore();
  const batch = db.batch();
  // Optimize Firestore message deletions using batch
  const messagesSnapshot = await db
    .collection(MESSAGES_COLLECTION)
    .where("channelId", "==", channelId)
    .get();

  messagesSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Commit the batch operation
  await batch.commit();

  // Delete the channel document
  await db.collection(CHANNELS_COLLECTION).doc(channelId).delete();

  console.log(
    `Channel ${channelId} and its associated data have been deleted.`
  );
};

// Helper function to delete a storage directory
const deleteStorageDirectory = async (
  directoryRef: firebase.storage.Reference
) => {
  try {
    const listResult = await directoryRef.listAll();
    const deletePromises: any[] = [];

    // Delete all files in the directory
    listResult.items.forEach((fileRef) => {
      deletePromises.push(fileRef.delete());
    });

    // Recursively delete subdirectories
    listResult.prefixes.forEach((subDirRef) => {
      deletePromises.push(deleteStorageDirectory(subDirRef));
    });

    await Promise.all(deletePromises);
    console.log(
      `Storage directory ${directoryRef.fullPath} deleted successfully.`
    );
  } catch (error) {
    console.error(
      `Error deleting storage directory ${directoryRef.fullPath}:`,
      error
    );
  }
};
