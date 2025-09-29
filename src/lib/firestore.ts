import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";

export class FirestoreService {
  static async create(collectionName: string, data: DocumentData) {
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return { id: docRef.id, success: true };
    } catch (error) {
      throw error;
    }
  }

  static async getById(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  static async getAll(
    collectionName: string,
    constraints: QueryConstraint[] = [],
  ) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw error;
    }
  }

  static async update(
    collectionName: string,
    id: string,
    data: Partial<DocumentData>,
  ) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  static async delete(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

export { where, orderBy, limit };
