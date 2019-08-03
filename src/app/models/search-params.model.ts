export class SearchParams {
  public roundTrip: boolean;
  public origin: string;
  public originID: string;
  public destination: string;
  public destinationID: string;
  public startingDay: string;
  public duration: string;

  constructor(roundTrip: boolean, origin: string, originID: string, destination: string, 
              destinationID: string, startingDay: string, duration: string) {
    this.roundTrip = roundTrip;
    this.origin = origin;
    this.originID = originID;
    this.destination = destination;
    this.destinationID = destinationID;
    this.startingDay = startingDay;
    this.duration = duration;
  }
}