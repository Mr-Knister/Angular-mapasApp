import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from "mapbox-gl";
import { Feature } from '../interfaces/places.interface';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionResponse, Route } from '../interfaces/direction.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?:Map;
  private markers:Marker[] = [];

  constructor(private directionsApiClient:DirectionsApiClient) {}

  get isMapReady():boolean {
    return !!this.map;
  }

  setMap(map:Map):void {
    this.map = map;
  }

  flyTo(coords:LngLatLike):void {
    if (!this.isMapReady) throw Error('El mapa no esta inicializado');
    this.map!.flyTo({
      zoom: 14,
      center: coords
    });
  }

  getRouteBetweenPoints(start:[number,number], end:[number,number]){
    this.directionsApiClient.get<DirectionResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(resp => this.drawPolyline(resp.routes[0]));
  }

  private drawPolyline(route:Route):void {
    if (!this.map) throw Error('No se encontro mapa');
    // console.log({distance_kms: route.distance / 1000, durations_min: route.duration / 60});

    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();
    // coords.forEach((coord:[number,number]) => bounds.extend(coord));
    // coords.forEach((coord:any) => bounds.extend(coord));
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this.map.fitBounds(bounds, {
      padding: 100
    });

    const sourceData:AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }
    // Todo: limpiar ruta previa

    this.removeLines();

    this.map.addSource('RouteString', sourceData);
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-cap": 'round',
        "line-join": 'round'
      },
      paint: {
        "line-color": 'black',
        "line-width": 3
      }
    });
  }

  createMarkersFromPlace(places:Feature[], userLocation:[number,number]):void {
    if (!this.map) throw Error('Mapa no inicializada')

    this.markers.forEach(marker => marker.remove());
    const newMarkers = [];

    for (const place of places){
      const [lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`
          <h6>${place.text}</h6>
          <span>${place.place_name}</span>
        `)
      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
      newMarkers.push(newMarker);
    }
    this.markers = newMarkers;

    if (places.length === 0) return;
    // limites de mapa
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map.fitBounds(bounds, {
      padding: 100
    });

    this.removeLines();
  }

  removeMarks():void {
    this.markers.forEach(marker => marker.remove());
  }

  removeLines():void {
    if (!this.map) throw Error('Mapa no inicializada')
    if (this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }
  }

}
