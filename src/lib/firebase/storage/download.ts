import { firebaseStorageRef } from "../client";

const download = async (child: string) => {
  return firebaseStorageRef.child(child).getDownloadURL();
};

export default download;
