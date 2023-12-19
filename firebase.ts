import { getApp, getApps, initializeApp } from 'firebase/app'
//import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
//import { getFuntions } from 'firestore/functions'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASwKm-8GyFurf4GUU7_yf77EbWl6eI4aA",
    authDomain: "dropbox-clone-kt.firebaseapp.com",
    projectId: "dropbox-clone-kt",
    storageBucket: "dropbox-clone-kt.appspot.com",
    messagingSenderId: "964154199180",
    appId: "1:964154199180:web:14c3f8dc9da42fad7c7fa9"
  };

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const storage = getStorage(app)

  export { db, storage }