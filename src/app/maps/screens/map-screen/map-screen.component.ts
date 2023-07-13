import { Component, OnInit, inject } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'maps-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})
export class MapScreenComponent {
  // private placesService = inject(PlacesService);
  constructor(private placesService:PlacesService) {}

  get isUserLocationReady() {
    return this.placesService.isUserLocationReady;
  }

}
