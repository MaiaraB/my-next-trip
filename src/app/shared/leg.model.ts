import { Place } from './place.model';
import { Carrier } from './carrier.model';
import { Segment } from './segment.model';

export class Leg {
  public Departure: Date;
  public Arrival: Date;
  public Duration: number;
  public Stops: Place[];
  public Origin: Place;
  public Destination: Place;
  public Carriers: Carrier[];
  public Segments: Segment[];

  constructor(departure: Date, arrival: Date, duration: number, 
              stops: Place[], origin: Place, destination: Place,
              carriers: Carrier[], segments: Segment[]) {
    this.Departure = departure;
    this.Arrival = arrival;
    this.Duration = duration;
    this.Stops = stops;
    this.Origin = origin;
    this.Destination = destination;
    this.Carriers = carriers;
    this.Segments = segments;
  }
}