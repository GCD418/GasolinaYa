import Gasolinera from './Gasolinera.js';
class ModGasolineras {
    constructor() {
       this.gasolineras = new Map(); 
    }
    
    addGasolinera(gasolinera) {
        this.gasolineras.set(gasolinera.getName(), gasolinera);
        return this.gasolineras.size;
    }

    getGasolinera(name) {
        return this.gasolineras.get(name);
    }
};

export default ModGasolineras;