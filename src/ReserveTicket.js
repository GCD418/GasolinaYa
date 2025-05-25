export function getAvailableStations(user, stations) {
    if (!user.ticket) {
      return stations;
    }
    return [];
  }