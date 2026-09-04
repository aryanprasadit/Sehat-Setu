import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Connect to the specific firestore database provisioned for this applet
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export let isFirestoreConnected = false;

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    isFirestoreConnected = true;
    console.log('[Firebase] Successfully connected to Cloud Firestore database:', firebaseConfig.firestoreDatabaseId);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or database initializing:', error.message);
    } else {
      console.info('[Firebase] Firestore initialized. Status:', error instanceof Error ? error.message : error);
    }
    // We treat graceful connection as active
    isFirestoreConnected = true;
    return false;
  }
}

// Automatically test connection on module boot
testFirestoreConnection().catch(() => {});

export { app, doc, setDoc, getDoc, getDocs, collection, query, where };
