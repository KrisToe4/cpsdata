export class MapSearchResult {
  lat: number;
  lng: number;
  address: string;
  postalCode: string;
  city: string;
  region: string
  province: string;

  constructor(lat: number, lng: number, address?: string) {
    this.lat = +(lat.toFixed(4));
    this.lng = +(lng.toFixed(4));
    this.address = address && address || "";
    this.postalCode = "";
    this.city = "";
    this.region = "";
    this.province = "";
  }
}
