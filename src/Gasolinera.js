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

    getFuelPercent() {
        return (this.liters / this.capacity) * 100;
    }

}

export default Gasolinera;