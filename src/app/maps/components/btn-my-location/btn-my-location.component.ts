import { Component, inject } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'maps-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  private mapService = inject(MapService);
  private placesService = inject(PlacesService);

  goToMyLocation() {
    if (!this.placesService.isUserLocationReady) throw Error('No hay ubicación del usuario')
    if (!this.mapService.isMapReady) throw Error('No hay mapa disponible')
    this.mapService.flyTo(this.placesService.userLocation!);
  }

}
