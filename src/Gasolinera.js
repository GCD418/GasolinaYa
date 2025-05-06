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
    addFuel(extraLiters) {
        this.liters += extraLiters;
        if (this.liters > this.capacity) {
            this.liters = this.capacity;
        }
    }

}

export default Gasolinera;