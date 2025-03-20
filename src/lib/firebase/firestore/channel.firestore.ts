import { firebase } from "@/lib/firebase/client";

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
