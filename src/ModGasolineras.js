import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, 
  getDoc, getDocs, updateDoc, query
} from 'firebase/firestore';

import DbHandler from './DbHandler.js';
import Gasolinera from './Gasolinera.js';
class ModGasolineras {
    static instance = null;
    #db = null;
    #readyPromise = null;
    dbHandler = null;

    constructor() {
        if (ModGasolineras.instance) {
            return ModGasolineras.instance;
        }
        ModGasolineras.instance = this;
        this.gasolineras = new Map();

        this.dbHandler = new DbHandler();
        this.#db = this.dbHandler.getDb();

        this.#readyPromise = this.loadFromFirestore();
    }   

    async ready() {
        return this.#readyPromise;
    }

    async addGasolinera(gasolinera) {
        this.gasolineras.set(gasolinera.getName(), gasolinera);
        
        const document = {
            name: gasolinera.getName(),
            fuelLiters: gasolinera.getFuelLiters(),
            totalCapacity: gasolinera.getTotalCapacity()
        };

        this.dbHandler.setDocument("gasolineras", gasolinera.getName(), document);
       
        return this.gasolineras.size;
    }

    async updateGasolinera(gasolineraName, liters, capacity = 90000) {
        if (this.gasolineras.get(gasolineraName) === undefined) {
            return Promise.resolve(false);
        }
        
        await this.dbHandler.updateDocument("gasolineras", gasolineraName, {
            fuelLiters: liters,
            totalCapacity: capacity
        });
        
        this.gasolineras.set(gasolineraName, new Gasolinera(liters, capacity, gasolineraName));
    }


    async updateQueueCount(gasolineraName, change) {
        const gasolinera = this.gasolineras.get(gasolineraName);
        if (!gasolinera) {
            // console.error(`Gasolinera ${gasolineraName} no encontrada para actualizar cola`);
            return false;
        }
        
        const currentCount = gasolinera.getQueueCount() || 0;
        const newCount = Math.max(0, currentCount + change);

        if (change < 0 && newCount === currentCount) {
            console.log(`La cola ya esta en 0`);
            return true;
        }

        gasolinera.setQueueCount(newCount);
        
        try {
            await updateDoc(doc(this.#db, "gasolineras", gasolineraName), {
            queueCount: newCount
            });
            // console.log(`Cola para ${gasolineraName} es: ${newCount}`);
            return true;
        } catch (e) {
            // console.error("Error updating queue count in Firestore:", e);
            gasolinera.setQueueCount(currentCount); 
            return false;
        }
    }

    async incrementQueueCount(gasolineraName) {
    return this.updateQueueCount(gasolineraName, 1);
    }

    async decrementQueueCount(gasolineraName) {
    return this.updateQueueCount(gasolineraName, -1);
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
        const querySnapshot = await this.dbHandler.getQuerySnapshot("gasolineras");
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
    }


    // async insertFakeData() {
    //     if (this.gasolineras.size > 0) {
    //         return this.gasolineras.size;
    //     }
        
    //     const gasolinera = new Gasolinera(1000, 50000, "Asunción");
    //     const gasolinera2 = new Gasolinera(2000, 80000, "El Cristo");
    //     const gasolinera3 = new Gasolinera(8000, 40000, "Las Islas");
    //     const gasolinera4 = new Gasolinera(30000, 30000, "El Manantial");
        
    //     await Promise.all([
    //         this.addGasolinera(gasolinera),
    //         this.addGasolinera(gasolinera2),
    //         this.addGasolinera(gasolinera3),
    //         this.addGasolinera(gasolinera4)
    //     ]);
        
    //     return this.gasolineras.size;

    // }

    async addFuel(gasolineraName, liters) {
        const gasolinera = this.gasolineras.get(gasolineraName);
        await this.updateGasolinera(
            gasolineraName,
            gasolinera.getFuelLiters() + liters,
            gasolinera.getTotalCapacity()
        );
        gasolinera.addFuel(liters);
        return gasolinera.getFuelLiters();
    }
    
};

export default ModGasolineras;