export function getPlacasEnFila(nombreGasolinera, modUsuarios) {
  return Array.from(modUsuarios.getUsuarios().values())
    .filter(usuario => usuario.getEnFila() === nombreGasolinera)
    .map(usuario => usuario.getPlaca());
}
export async function removeFromQueue(placa, gasolineraName, modUsuarios) {
  const usuario = modUsuarios.getUsuario(placa);
  if (!usuario) return;
  usuario.setEnFila(null);
}
