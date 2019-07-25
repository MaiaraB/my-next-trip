export class Agent {
  public Name: string;
  public ImageURL: string;
  public Price: number;
  public DeepLinkURL: string;

  constructor(name: string, imageURL: string, price: number, deeplinkURL: string) {
    this.Name = name;
    this.ImageURL = imageURL;
    this.Price = price;
    this.DeepLinkURL = deeplinkURL;
  }
}