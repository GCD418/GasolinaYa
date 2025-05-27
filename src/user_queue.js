    function calculate_waiting_time(queue_count, hoses_number = 1) {
        return 5 * Math.max(0,((queue_count - (hoses_number - 1)) / hoses_number)); // 5 minutos por cada auto en la cola
    }

    function estimate_fuel_load(fuel_liters, queue_count) {
        var cdf = require( '@stdlib/stats-base-dists-normal-cdf' );
        const fuel_per_car = 40.1; // Litros por auto
        const fuel_charge_deviation = 25;
        const probability_of_fueling = cdf(fuel_liters, fuel_per_car * queue_count, fuel_charge_deviation * queue_count);
        return (probability_of_fueling * 100).toFixed(0);
    }

function can_abandon_queue({ isInQueue, isSelectorVisible }) {
    return isInQueue && !isSelectorVisible;
}

export { calculate_waiting_time, estimate_fuel_load, can_abandon_queue };