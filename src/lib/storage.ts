import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from "firebase/storage";
import { storage } from "./firebase";

export class StorageService {
  static async uploadFile(
    path: string,
    file: File,
    onProgress?: (progress: number) => void,
  ) {
    try {
      const storageRef = ref(storage, path);

      if (onProgress) {
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise<{ url: string; path: string; success: true }>(
          (resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
              },
              (error) => {
                console.error("Upload error:", error);
                reject(new Error(error.message ?? "Upload failed"));
              },
              () => {
                void (async () => {
                  try {
                    const downloadURL = await getDownloadURL(
                      uploadTask.snapshot.ref,
                    );
                    resolve({
                      url: downloadURL,
                      path: path,
                      success: true,
                    });
                  } catch (error) {
                    reject(
                      error instanceof Error
                        ? error
                        : new Error("Failed to get download URL"),
                    );
                  }
                })();
              },
            );
          },
        );
      } else {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
          url: downloadURL,
          path: path,
          success: true,
        };
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  static async uploadBlob(path: string, blob: Blob) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        path: path,
        success: true,
      };
    } catch (error) {
      console.error("Error uploading blob:", error);
      throw error;
    }
  }

  static async getDownloadURL(path: string) {
    try {
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error getting download URL:", error);
      throw error;
    }
  }

  static async deleteFile(path: string) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  static async listFiles(path: string) {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);

      const items = await Promise.all(
        result.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          const downloadURL = await getDownloadURL(itemRef);

          return {
            name: itemRef.name,
            path: itemRef.fullPath,
            url: downloadURL,
            size: metadata.size,
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated,
          };
        }),
      );

      return items;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }

  static async getFileMetadata(path: string) {
    try {
      const storageRef = ref(storage, path);
      const metadata = await getMetadata(storageRef);
      return metadata;
    } catch (error) {
      console.error("Error getting file metadata:", error);
      throw error;
    }
  }
}
