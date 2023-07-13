import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Map, Popup, Marker } from 'mapbox-gl';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'maps-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapContainer')
  mapContainer!:ElementRef;

  private placesService = inject(PlacesService);
  private mapService = inject(MapService);

  ngAfterViewInit(): void {
    if (!this.placesService.userLocation) throw Error('No hay geolocalizacion');
    const map = new Map({
      container: this.mapContainer.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/light-v10', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);
    new Marker({ color: 'red' })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map);

    this.mapService.setMap(map);
  }


}
