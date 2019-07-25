export class SkyscannerPlace {
  public PlaceId: string;
  public PlaceName: string;
  public CountryId: string;
  public RegionId: string;
  public CityId: string;
  public CountryName: string;

  constructor(placeId: string, placeName: string, countryId: string, regionId:string, 
              cityId: string, countryName: string) {
    this.PlaceId = placeId;
    this.PlaceName = placeName;
    this.CountryId = countryId;
    this.RegionId = regionId;
    this.CityId = cityId;
    this.CountryName = countryName;
  }
}