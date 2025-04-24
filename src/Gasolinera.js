class Gasolinera{
    constructor(liters){

        if(typeof Gasolinera.instance === 'object'){
            return Gasolinera.instance;
        }

        Gasolinera.instance = this;
        return this;
    }

    getFuelLiters(){
        return 1000;
    }
}

export default Gasolinera;