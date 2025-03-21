import { firebase } from "@/lib/firebase/client";

export interface Attached {
  type: "image" | "video";
  child: string;
  url: string;
}

// Define the structure of a Message document in Firestore
export interface Message {
  id?: string; // Optional: Firestore document ID
  message: string; // The content of the message
  userId: string; // The ID of the user who sent the message
  channelId: string; // The ID of the channel where the message was sent
  timestamp?: firebase.firestore.FieldValue | firebase.firestore.Timestamp; // Timestamp when the message was sent
  displayName?: string; // Optional: Display name of the user
  photoURL?: string; // Optional: URL of the user's profile photo
  attached?: Attached[];
}

// Define a constant for the Firestore collection name
export const MESSAGES_COLLECTION = "messages";

/**
 * Subscribes to the list of messages for a specific channel in Firestore and listens for real-time updates.
 *
 * @param channelId - The ID of the channel to retrieve messages for
 * @param callback - A function to handle the updated list of messages
 * @returns A Firestore unsubscribe function to stop listening for updates
 */
export const getMessages = (
  channelId: string,
  callback: (messages: Message[]) => void,
  errorCallback: (error: string) => void
) => {
  return firebase
    .firestore()
    .collection(MESSAGES_COLLECTION)
    .where("channelId", "==", channelId) // Filter messages by channel ID
    .orderBy("timestamp", "asc") // Order messages by timestamp in ascending order
    .limit(50) // Limit the number of messages retrieved to 50 - TODO:paginate this
    .onSnapshot(
      (snapshot) => {
        // Map Firestore documents to Message objects
        const messages = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Message)
        );
        console.log("Messages", messages); // Log the retrieved messages
        callback(messages); // Pass the updated list of messages to the callback
      },
      (error) => {
        console.error("Error getting messages", error); // Log any errors
        errorCallback(error.message); // Pass the error message to the error callback
      }
    );
};

/**
 * Adds a new message to the Firestore database.
 *
 * @param message - The message data to be added
 * @returns A Promise that resolves when the message is successfully added
 */
export const addMessage = (message: Message) => {
  const msg = {
    ...message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Use Firestore server timestamp
  };
  return firebase.firestore().collection(MESSAGES_COLLECTION).add(msg); // Add the message to the Firestore collection
};

/**
 * Updates an existing message in the Firestore database.
 *
 * @param messageId - The ID of the message to update
 * @param updatedData - The updated message data
 * @returns A Promise that resolves when the message is successfully updated
 */
export const updateMessage = (
  messageId: string,
  updatedData: Partial<Message>
) => {
  return firebase
    .firestore()
    .collection(MESSAGES_COLLECTION)
    .doc(messageId)
    .update(updatedData); // Update the message document with the new data
};

/**
 * Deletes a message from the Firestore database.
 *
 * @param messageId - The ID of the message to delete
 * @returns A Promise that resolves when the message is successfully deleted
 */
export const deleteMessage = (messageId: string) => {
  return firebase
    .firestore()
    .collection(MESSAGES_COLLECTION)
    .doc(messageId)
    .delete(); // Delete the message document
};

/**
 * Retrieves a single message document from Firestore by its ID.
 *
 * @param messageId - The ID of the message to retrieve
 * @returns A Promise that resolves with the message data if found
 */
export const getMessageById = async (messageId: string): Promise<Message> => {
  const doc = await firebase
    .firestore()
    .collection(MESSAGES_COLLECTION)
    .doc(messageId)
    .get(); // Get the message document by ID

  if (doc.exists) {
    return { id: doc.id, ...doc.data() } as Message; // Return the message data
  } else {
    throw new Error(`Message not found with ID: ${messageId}`); // Throw an error if the message doesn't exist
  }
};
