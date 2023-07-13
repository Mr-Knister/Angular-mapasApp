import { Component } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'maps-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer?:NodeJS.Timer;
  //change tsconfig.app.json and tsconfig.json "types"

  constructor(private placesService:PlacesService) {}

  onQueryChanged(query:string=''):void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery(query);
      // console.log('Mandar este query', query);
    }, 500);
  }
}
