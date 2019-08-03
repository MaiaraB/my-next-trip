import { Currency } from './currency.model';
import { Agent } from './agent.model';
import { Leg } from './leg.model';

export class FlightResult {
  public Currency: Currency;
  public AgentsInfo: Agent[];
  public OutboundLeg: Leg;
  public InboundLeg: Leg;

  constructor(currency: Currency, agentsInfo: Agent[], outboundLeg: Leg, inboundLeg: Leg) {
    this.Currency = currency;
    this.AgentsInfo = agentsInfo;
    this.OutboundLeg = outboundLeg;
    this.InboundLeg = inboundLeg;
  }
}