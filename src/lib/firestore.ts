import { collection, addDoc, getDocs, updateDoc, doc, getDoc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Job } from './models';

const JOBS_COLLECTION = 'jobs';

export const createJob = async (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString();
  const newJob = {
    ...job,
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(collection(db, JOBS_COLLECTION), newJob);
  return { id: docRef.id, ...newJob };
};

export const getJobs = async () => {
  const q = query(collection(db, JOBS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
};

export const getActiveJobs = async () => {
  const q = query(collection(db, JOBS_COLLECTION), where('status', '==', 'active'), orderBy('dueDate', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
};

export const updateJob = async (id: string, updates: Partial<Job>) => {
  const docRef = doc(db, JOBS_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
};
export const deleteJob = async (id: string) => {
  const docRef = doc(db, JOBS_COLLECTION, id);
  await deleteDoc(docRef);
};
