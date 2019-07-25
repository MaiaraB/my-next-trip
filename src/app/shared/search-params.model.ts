export class SearchParams {
  public roundTrip: boolean;
  public origin: string;
  public destination: string;
  public startingDay: string;
  public duration: string;

  constructor(roundTrip: boolean, origin: string, destination: string, startingDay: string, duration: string) {
    this.roundTrip = roundTrip;
    this.origin = origin;
    this.destination = destination;
    this.startingDay = startingDay;
    this.duration = duration;
  }
}