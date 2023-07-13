import { Component } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Feature } from '../../interfaces/places.interface';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'maps-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  public selectedId:string = '';

  constructor(
    private placesService:PlacesService,
    private mapService:MapService
  ) {}

  get isLoadingPlaces():boolean {
    return this.placesService.isLoadingPlaces;
  }
  get places():Feature[] {
    return this.placesService.places;
  }
  flyTo(place:Feature) {
    this.selectedId = place.id;
    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
  }
  getDirections(place:Feature) {
    if (!this.placesService.userLocation) throw Error('No hay userlocation');
    this.placesService.deletePlaces();
    const start:[number,number] = this.placesService.userLocation!;
    const end:[number,number] = place.center as [number,number];
    this.mapService.getRouteBetweenPoints(start, end);
  }
}
