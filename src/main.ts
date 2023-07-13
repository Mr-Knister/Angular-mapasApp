import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1Ijoia25pc3RlciIsImEiOiJjbGpvcWtma2UxZTRuM2VreXNuYjM0MHFxIn0.IYCPwF8O57JuGu_PAuSYZQ';

if (!navigator.geolocation) {
  throw new Error('Navegador no soporta la Geolocation');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
