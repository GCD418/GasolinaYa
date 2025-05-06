function calculate_waiting_time(queue_count) {
    return 5 * queue_count; // 5 minutos por cada auto en la cola
}

export default calculate_waiting_time