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

