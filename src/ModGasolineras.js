import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, 
  getDoc, getDocs, updateDoc, query
} from 'firebase/firestore';

import Gasolinera from './Gasolinera.js';
class ModGasolineras {
    static instance = null;
    #db = null;
    #readyPromise = null;

    constructor() {
        if (ModGasolineras.instance) {
            return ModGasolineras.instance;
        }
        ModGasolineras.instance = this;
        this.gasolineras = new Map();

        const firebaseconfig = {
            apiKey: "AIzaSyB1Txz13AY002WmXTD7oTQPMowt346rQMA",
            authDomain: "gasolinaya-ccg-ucb.firebaseapp.com",
            projectId: "gasolinaya-ccg-ucb",
            storageBucket: "gasolinaya-ccg-ucb.firebasestorage.app",
            messagingSenderId: "889672025448",
            appId: "1:889672025448:web:5f89df42bdf09ce31602dd"
        };

        const app = initializeApp(firebaseconfig);
        this.#db = getFirestore(app);

        this.#readyPromise = this.loadFromFirestore();
    }   

    async ready() {
        return this.#readyPromise;
    }

    reviewDbConnection(){
        if (this.#db){
            return "Conexión exitosa"
        }
        return "Conexión fallida"
    }

    async addGasolinera(gasolinera) {
        this.gasolineras.set(gasolinera.getName(), gasolinera);
        
        try {
            await setDoc(doc(this.#db, "gasolineras", gasolinera.getName()), {
                name: gasolinera.getName(),
                fuelLiters: gasolinera.getFuelLiters(),
                totalCapacity: gasolinera.getTotalCapacity()
            });
        } catch (e) {
            console.error("Error adding gasolinera to Firestore:", e);
        }
        
        return this.gasolineras.size;
    }

    async updateGasolinera(gasolineraName, liters, capacity = 90000) {
        if (this.gasolineras.get(gasolineraName) === undefined) {
            return Promise.resolve(false);
        }
        
        try {
            await updateDoc(doc(this.#db, "gasolineras", gasolineraName), {
                fuelLiters: liters,
                totalCapacity: capacity
            });
        } 
        catch (e) {
            console.error("Error updating gasolinera in Firestore:", e);
        }
        
        this.gasolineras.set(gasolineraName, new Gasolinera(liters, capacity, gasolineraName));
    }


    async incrementQueueCount(gasolineraName) {
        const gasolinera = this.gasolineras.get(gasolineraName);
        if (!gasolinera) {
            console.error(`Gasolinera ${gasolineraName} no encontrada para incrementar cola`);
            return false;
        }
        
        const currentCount = gasolinera.getQueueCount() || 0;
        const newCount = currentCount + 1;
        gasolinera.setQueueCount(newCount);
        
        try {
            await updateDoc(doc(this.#db, "gasolineras", gasolineraName), {
                queueCount: newCount
            });
            
            console.log(`Cola incrementada para ${gasolineraName}: ${newCount}`);
            return true;
        } catch (e) {
            console.error("Error updating queue count in Firestore:", e);
            gasolinera.setQueueCount(currentCount);
            return false;
        }
    }
    
    async decrementQueueCount(gasolineraName) {
        const gasolinera = this.gasolineras.get(gasolineraName);
        if (!gasolinera) {
            console.error(`Gasolinera ${gasolineraName} no encontrada para decrementar cola`);
            return false;
        }
        
        const currentCount = gasolinera.getQueueCount() || 0;
        const newCount = Math.max(0, currentCount - 1);
        if (newCount === currentCount) {
            console.log(`La cola ya está en 0 para ${gasolineraName}`);
            return true;
        }
        
        gasolinera.setQueueCount(newCount);
        
        try {
            await updateDoc(doc(this.#db, "gasolineras", gasolineraName), {
                queueCount: newCount
            });
            
            console.log(`Cola decrementada para ${gasolineraName}: ${newCount}`);
            return true;
        } catch (e) {
            console.error("Error updating queue count in Firestore:", e);
            gasolinera.setQueueCount(currentCount);
            return false;
        }
    }

    async getQueueCount(gasolineraName) {
        const docRef = doc(this.#db, "colas", gasolineraName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().count || 0;
        } else {
            return 0;
        }
    }

    getGasolinera(name) {
        return this.gasolineras.get(name);
    }

    getGasolineras() {
        return this.gasolineras;
    }

    async loadFromFirestore() {
        try {
            const querySnapshot = await getDocs(collection(this.#db, "gasolineras"));
            if (querySnapshot.empty) {
                console.log("No se encontraron gasolineras en Firestore. Insertando datos de prueba...");
                await this.insertFakeData();
                return true;
            }
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const gasolinera = new Gasolinera(
                    data.fuelLiters,
                    data.totalCapacity,
                    data.name
                );
                if (data.queueCount !== undefined) {
                    gasolinera.setQueueCount(data.queueCount);
                }
                this.gasolineras.set(data.name, gasolinera);
            });

            return true;
        } catch (e) {
            console.error("Error loading data from Firestore:", e);
            return false;
        }
    }


    async insertFakeData() {
        if (this.gasolineras.size > 0) {
            return this.gasolineras.size;
        }
        
        const gasolinera = new Gasolinera(1000, 50000, "Asunción");
        const gasolinera2 = new Gasolinera(2000, 80000, "El Cristo");
        const gasolinera3 = new Gasolinera(8000, 40000, "Las Islas");
        const gasolinera4 = new Gasolinera(30000, 30000, "El Manantial");
        
        await Promise.all([
            this.addGasolinera(gasolinera),
            this.addGasolinera(gasolinera2),
            this.addGasolinera(gasolinera3),
            this.addGasolinera(gasolinera4)
        ]);
        
        return this.gasolineras.size;

    }
    
};

export default ModGasolineras;