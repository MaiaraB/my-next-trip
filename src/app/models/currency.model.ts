export class Currency {
  public Code: string;
  public Symbol: string;
  public ThousandsSeparator: string;
  public DecimalSeparator: string;
  public SymbolOnLeft: boolean;
  public SpaceBetweenAmountAndSymbol: boolean;
  public RoundingCoefficient: number;
  public DecimalDigits: number;

  constructor(code: string, symbol: string, thousandsSeparator: string, 
              decimalSeparator: string, symbolOnLeft: boolean, spaceBetweenAmountAndSymbol: boolean,
              roudingCoefficient: number, decimalDigits: number) {
    this.Code = code;
    this.Symbol = symbol;
    this.ThousandsSeparator = thousandsSeparator;
    this.DecimalSeparator = decimalSeparator;
    this.SymbolOnLeft = symbolOnLeft;
    this.SpaceBetweenAmountAndSymbol = spaceBetweenAmountAndSymbol;
    this.RoundingCoefficient = roudingCoefficient;
    this.DecimalDigits = decimalDigits;
  }
}