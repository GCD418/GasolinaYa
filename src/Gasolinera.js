class Gasolinera {
    constructor(liters, capacity = 50000) {
        this.liters = liters;
        this.capacity = capacity;

    }

    getFuelLiters() {
        return this.liters;
    }

    getTotalCapacity(){
        return this.capacity;
    }

}

export default Gasolinera;