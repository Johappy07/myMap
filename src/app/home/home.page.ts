import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  latitude!: number;
  longitude!: number;

  constructor() {}

  async ngOnInit(): Promise<void> {
    // Get the current position
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    // Initialize the map
    const map = new Map({
      basemap: 'topo-vector'
    });

    // Initialize the map view with updated latitude and longitude
    const view = new MapView({
      container: 'container',
      map: map,
      zoom: 4,
      center: [this.longitude, this.latitude] // Corrected order: [longitude, latitude]
    });
  }
}
