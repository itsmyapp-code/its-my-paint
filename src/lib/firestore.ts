import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Job } from './models';

const JOBS_COLLECTION = 'jobs';

const ensureDb = () => {
  if (!db) {
    throw new Error("Firestore database is not initialized. Check your Firebase configuration.");
  }
  return db;
};

export const createJob = async (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
  const database = ensureDb();
  console.log("Creating job in Firestore:", job);
  const now = new Date().toISOString();
  const newJob = {
    ...job,
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(collection(database, JOBS_COLLECTION), newJob);
  console.log("Job created successfully with ID:", docRef.id);
  return { id: docRef.id, ...newJob };
};

export const getJobs = async () => {
  const database = ensureDb();
  const q = query(collection(database, JOBS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
};

export const getActiveJobs = async () => {
  const database = ensureDb();
  const q = query(collection(database, JOBS_COLLECTION), where('status', '==', 'active'), orderBy('dueDate', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
};

export const updateJob = async (id: string, updates: Partial<Job>) => {
  const database = ensureDb();
  const docRef = doc(database, JOBS_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};

export const deleteJob = async (id: string) => {
  const database = ensureDb();
  const docRef = doc(database, JOBS_COLLECTION, id);
  await deleteDoc(docRef);
};
