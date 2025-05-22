export function getPlacasEnFila(nombreGasolinera, modUsuarios) {
  return Array.from(modUsuarios.getUsuarios().values())
    .filter(usuario => usuario.getEnFila() === nombreGasolinera)
    .map(usuario => usuario.getPlaca());
}
