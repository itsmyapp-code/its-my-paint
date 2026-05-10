import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Job, DecoratorSettings } from './models';

const JOBS_COLLECTION = 'jobs';
const SETTINGS_COLLECTION = 'decoratorSettings';

const ensureDb = () => {
  if (!db) {
    throw new Error("Firestore database is not initialized. Check your Firebase configuration.");
  }
  return db;
};

export const createJob = async (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
  const database = ensureDb();
  const user = auth?.currentUser;
  if (!user) throw new Error("User must be authenticated to create a job.");

  console.log("Creating job in Firestore:", job);
  const now = new Date().toISOString();
  const newJob = {
    ...job,
    userId: user.uid,
    createdAt: now,
    updatedAt: now,
  };
  const docRef = await addDoc(collection(database, JOBS_COLLECTION), newJob);
  console.log("Job created successfully with ID:", docRef.id);
  return { id: docRef.id, ...newJob };
};

export const getJobs = async () => {
  const database = ensureDb();
  const user = auth?.currentUser;
  if (!user) return [];
  
  const q = query(
    collection(database, JOBS_COLLECTION), 
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const allJobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
  
  // Filter in memory for compatibility and to avoid complex index/TS issues
  return allJobs.filter(job => job.userId === user.uid || !job.userId);
};

export const getActiveJobs = async () => {
  const database = ensureDb();
  const user = auth?.currentUser;
  if (!user) return [];

  const q = query(
    collection(database, JOBS_COLLECTION), 
    where('status', '==', 'active'), 
    orderBy('dueDate', 'asc')
  );
  const querySnapshot = await getDocs(q);
  const allActive = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
  
  return allActive.filter(job => job.userId === user.uid || !job.userId);
};

export const getDecoratorSettings = async (userId: string): Promise<DecoratorSettings | null> => {
  const database = ensureDb();
  const docRef = doc(database, SETTINGS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as DecoratorSettings;
  }
  return null;
};

export const updateDecoratorSettings = async (userId: string, settings: Partial<DecoratorSettings>) => {
  const database = ensureDb();
  const docRef = doc(database, SETTINGS_COLLECTION, userId);
  await setDoc(docRef, { 
    ...settings, 
    userId, 
    updatedAt: new Date().toISOString() 
  }, { merge: true });
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
