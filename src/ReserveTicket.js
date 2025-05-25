export async function reserveTicket(plate, stationName, modUsuarios, modGasolineras) {
    const user = modUsuarios.getUsuario(plate);
    if (!user || user.getConTicket()) return;
  
    user.setConTicket(stationName);
    await modUsuarios.updateUsuario(plate, null, stationName);
  
    await modGasolineras.incrementQueueCount(stationName);
  }
  