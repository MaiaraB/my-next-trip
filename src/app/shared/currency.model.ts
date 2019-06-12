export class Currency {
  public code: string;
  public symbol: string;
  public thousandsSeparator: string;
  public decimalSeparator: string;
  public symbolOnLeft: boolean;
  public spaceBetweenAmountAndSymbol: boolean;
  public roundingCoefficient: number;
  public decimalDigits: number;

  constructor(code: string, symbol: string, thousandsSeparator: string, 
              decimalSeparator: string, symbolOnLeft: boolean, spaceBetweenAmountAndSymbol: boolean,
              roudingCoefficient: number, decimalDigits: number) {
    this.code = code;
    this.symbol = symbol;
    this.thousandsSeparator = thousandsSeparator;
    this.decimalSeparator = decimalSeparator;
    this.symbolOnLeft = symbolOnLeft;
    this.spaceBetweenAmountAndSymbol = spaceBetweenAmountAndSymbol;
    this.roundingCoefficient = this.roundingCoefficient;
    this.decimalDigits = decimalDigits;
  }
}