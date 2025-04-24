class Gasolinera {
    constructor(liters, capacity) {
        this.liters = liters;
        this.capacity = capacity;

    }

    getFuelLiters() {
        return this.liters;
    }

    getTotalCapacity(){
        return 20000;
    }
}

export default Gasolinera;