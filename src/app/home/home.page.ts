import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;

  constructor() {}

  async ngOnInit() {
    // Initialize the map
    const map = new Map({
      basemap: 'topo-vector' // Add functionality to change basemap later
    });

    // Create the view
    this.mapView = new MapView({
      container: 'container',
      map: map,
      zoom: 12
    });

    // Add the weather layer (Radar Base Reflectivity Time)
    const weatherLayer = new ImageryLayer({
      url: 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer'
    });
    map.add(weatherLayer);

    // Update user location and display marker
    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      // Create marker at user location
      this.userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol({
          color: [226, 119, 40],
          outline: { color: [255, 255, 255], width: 1 }
        }),
        geometry: geom
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }
}
