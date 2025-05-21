import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, 
  getDoc, getDocs, updateDoc, query
} from 'firebase/firestore';

class DbHandler {
    firebaseconfig = {
        apiKey: "AIzaSyB1Txz13AY002WmXTD7oTQPMowt346rQMA",
        authDomain: "gasolinaya-ccg-ucb.firebaseapp.com",
        projectId: "gasolinaya-ccg-ucb",
        storageBucket: "gasolinaya-ccg-ucb.firebasestorage.app",
        messagingSenderId: "889672025448",
        appId: "1:889672025448:web:5f89df42bdf09ce31602dd"
    };
    app = null;
    db = null;


    constructor() {
        this.app = initializeApp(this.firebaseconfig);
        this.db = getFirestore(this.app);
    }

    getDb() {
        return this.db;
    }

    async getQuerySnapshot(collectionName) {
        return await getDocs(collection(this.db, collectionName));
    }

    async setDocument(collectionName, documentName, document) {
        await setDoc(doc(this.db, collectionName, documentName), document);
        return true;
    }
};

export default DbHandler;