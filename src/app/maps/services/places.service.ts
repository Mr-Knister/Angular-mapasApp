import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places.interface';
import { PlacesApiClient } from '../api/placesApiClient';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  // public userLocation:[number, number] | undefined;
  public userLocation?:[number, number];
  public isLoadingPlaces:boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady():boolean {
    return !!this.userLocation;
  }

  constructor(
    private httpClient:HttpClient,
    private placesApi:PlacesApiClient,
    private mapService:MapService
  ) {
    this.getUserLocation();
  }

  getUserLocation():Promise<[number,number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({coords}) => {
          this.userLocation = [coords.longitude, coords.latitude];
          // resolve([coords.longitude, coords.latitude]);
          resolve(this.userLocation);
        },
        (err) => {
          alert('No se pudo obtener la Geolocalización');
          console.log(err);
          reject();
        }
      );
    });
  }
  getPlacesByQuery(query:string):void {


    if (query.length === 0) {
      this.isLoadingPlaces = false;
      this.places = [];
      this.mapService.removeLines();
      this.mapService.removeMarks();
      return;
    };
    if (!this.userLocation) throw Error('No hay userLocation');
    this.isLoadingPlaces = true;
    // this.httpClient.get<PlacesResponse>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=6&proximity=-70.2513474271114%2C-18.01403368255791&language=es&access_token=pk.eyJ1Ijoia25pc3RlciIsImEiOiJjbGpvcWtma2UxZTRuM2VreXNuYjM0MHFxIn0.IYCPwF8O57JuGu_PAuSYZQ`)
    //   .subscribe(resp => {
    //     console.log(resp.features);
    //     this.isLoadingPlaces = false;
    //     this.places = resp.features;
    //   });
    this.placesApi.get<PlacesResponse>(`/${query}.json`, {
      params: {
        proximity: this.userLocation!.join(',')
      }
    })
      .subscribe(resp => {
        this.isLoadingPlaces = false;
        this.places = resp.features;
        this.mapService.createMarkersFromPlace(this.places, this.userLocation!);
      });
  }
  deletePlaces() {
    this.places = [];
  }
}
