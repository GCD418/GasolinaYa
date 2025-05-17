    function calculate_waiting_time(queue_count) {
        return 5 * queue_count; // 5 minutos por cada auto en la cola
    }

    function estimate_fuel_load(fuel_liters, queue_count) {
        const fuel_per_car = 40.1; // Litros por auto
        const total_fuel_needed = fuel_per_car * queue_count;
        return fuel_liters >= total_fuel_needed ? "Si" : "No";
    }

    export { calculate_waiting_time, estimate_fuel_load };