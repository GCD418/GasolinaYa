export function getPlacasEnFila(nombreGasolinera, listaUsuarios) {
    return listaUsuarios
      .filter((u) => u.enFila === nombreGasolinera)
      .map((u) => u.placa);
  }
  