import { firebaseStorageRef, firebase } from "../client";

const upload = async (
  file: any,
  _directory: any,
  _uid: any,
  onProgress?: (progress: number) => void // Add a callback for progress
): Promise<{ url: string; child: string }> => {
  const date = new Date();

  const randomId = Math.random().toString(36).substring(2, 15);
  const fileName = `${date.getTime()}-${randomId}`;
  const child = `uploads/${_directory}/${_uid}/${fileName}`;
  // Create the file metadata
  var metadata = {
    contentType: "image/jpeg",
    name: file.name,
    createdAt: date.toDateString(),
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = firebaseStorageRef.child(child).put(file, metadata);

  return new Promise((resolve, reject) => {
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log("Upload is " + progress + "% done");

        // Call the progress callback if provided
        if (onProgress) {
          onProgress(progress);
        }

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        reject(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          resolve({
            url: downloadURL,
            child,
          });
        });
      }
    );
  });
};

export default upload;
