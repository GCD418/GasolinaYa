export function getAvailableStations(user, stations) {
    if (!user.ticket) {
      return stations;
    }
    return [];
  }

export function getReservationMessage(user) {
if (user.ticket) {
    const { station, hour } = user.ticket;
    return `Ya tienes un ticket reservado para la estación ${station} a las ${hour}.`;
}
return "No tienes ningún ticket reservado.";
}
export async function reserveTicket(user, station, getCurrentHour) {
    const hour = getCurrentHour();
    const ticket = { station, hour };
    user.ticket = ticket;
    return ticket;
  }
  