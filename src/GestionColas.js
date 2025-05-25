export function getPlacasEnFila(nombreGasolinera, modUsuarios) {
  return Array.from(modUsuarios.getUsuarios().values())
    .filter(usuario => usuario.getEnFila() === nombreGasolinera)
    .map(usuario => usuario.getPlaca());
}
export async function removeFromQueue(placa, gasolineraName, modUsuarios, modGasolineras) {
  const usuario = modUsuarios.getUsuario(placa);
  if (!usuario) return;
  usuario.setEnFila(null);
  await modUsuarios.updateUsuario(placa, null, null);

  if (modGasolineras && typeof modGasolineras.decrementQueueCount === "function") {
    await modGasolineras.decrementQueueCount(gasolineraName);
  }
}


export async function confirmFuelLoad(plate, gasStationName, modUsuarios, modGasolineras) {

  await removeFromQueue(plate, gasStationName, modUsuarios, modGasolineras);

  const gasStation = modGasolineras.getGasolinera(gasStationName);
  if (!gasStation) return;

  const currentLiters = gasStation.getFuelLiters();
  const capacity = gasStation.getTotalCapacity();
  const updatedLiters = Math.max(currentLiters - 40, 0);

  await modGasolineras.updateGasolinera(gasStationName, updatedLiters, capacity);
}


export async function reserveTicket(plate, stationName, modUsuarios, modGasolineras) {
  const user = modUsuarios.getUsuario(plate);
  if (!user || user.getConTicket()) return;

  user.setConTicket(stationName);
  await modUsuarios.updateUsuario(plate, null, stationName);

  await modGasolineras.incrementQueueCount(stationName);
}



