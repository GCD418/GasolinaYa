class Gasolinera {
    constructor(liters, capacity = 50000, name = "Gasolinera") {
        this.liters = liters;
        this.capacity = capacity;
        this.name = name;

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

    getName() {
        return this.name;
    }

}

export default Gasolinera;