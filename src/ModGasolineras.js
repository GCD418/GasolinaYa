import Gasolinera from './Gasolinera.js';
class ModGasolineras {
    static instance = null;

    constructor() {
        if(ModGasolineras.instance) {
            return ModGasolineras.instance;
        }
       ModGasolineras.instance = this;
       this.gasolineras = new Map(); 
    }   

    addGasolinera(gasolinera) {
        this.gasolineras.set(gasolinera.getName(), gasolinera);
        return this.gasolineras.size;
    }

    getGasolinera(name) {
        return this.gasolineras.get(name);
    }

    getGasolineras() {
        return this.gasolineras;
    }

    insertFakeData() {
        const gasolinera = new Gasolinera(1000, 50000, "Asunción");
        const gasolinera2 = new Gasolinera(2000, 80000, "El Cristo");
        const gasolinera3 = new Gasolinera(8000, 40000, "Las Islas");
        const gasolinera4 = new Gasolinera(30000, 30000, "El Manantial");
        this.addGasolinera(gasolinera);
        this.addGasolinera(gasolinera2);
        this.addGasolinera(gasolinera3);
        this.addGasolinera(gasolinera4);
        return this.gasolineras.size;
    }
};

export default ModGasolineras;