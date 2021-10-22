import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import 'leaflet';
import "leaflet.markercluster";
import 'leaflet-draw';
import FreeDraw, { NONE } from 'leaflet-freedraw';
import { HttpClient } from '@angular/common/http';

declare const L: any;
interface singleMaker {
  lat: number,
  long: number,
  title: string
}
interface coordinate {
  lat: number,
  long: number,

}
@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit, AfterViewInit {
  @ViewChild('leaflet') divMap!: ElementRef;
  @Input() zoom = 10;
  @Input() lat = 29.9478927;
  @Input() long = 31.0449656;
  @Input() drawPolygon = true;
  @Input() drawPolyline = true;
  @Input() drawMarker = true;
  @Input() drawCircleMarker = true;
  @Input() drawFreeLine = true;
  @Input() singleMaker!: singleMaker
  @Input() CoordinatesPolygon: any
  @Input() ListSingleMaker!: singleMaker[]
  @Input() ListGroupMaker!: singleMaker[]
  configuration$ = {
    OpenStreetMapAutoCompleteService: "https://nominatim.openstreetmap.org/search?format=json&accept-language=ar&q=",
    OpenStreetMapGetInfoService: "https://nominatim.openstreetmap.org/reverse?format=jsonv2&&accept-language=ar&"
  }
  searchList: any
  line: boolean = false
  constructor(
    private httpClient: HttpClient,

  ) { }
  map!: any;
  search: string = ''
  ngOnInit(): void { }
  // AfterViewRun
  ngAfterViewInit(): void {
    this.initializeMap(this.divMap);
  }



  searchAutoComplete() {
    // clearTimeout(this.timeout);
    // this.timeout = setTimeout(() => {
    this.httpClient
      .get(this.configuration$.OpenStreetMapAutoCompleteService + this.search)
      .subscribe((value: any) => {
        this.searchList = [];
        value.map((em: any) => {
          this.searchList.push({

            lat: em.lat,
            lon: em.lon,
            address: em.display_name,
            ...em,
          });
        });
      });
    // }, 500);
  }

  setItem(event: any) {
    console.log(event);
    // This moves the map to the supplied bounds
    this.searchList=[]
    var bounds = [[event.boundingbox[0], event.boundingbox[2]], [event.boundingbox[1], event.boundingbox[3]]]

    let maps = this.map
    this.map.eachLayer(function (layer: any) {
      if (layer instanceof L.Marker) {
        maps.removeLayer(layer)
        console.log(" return 'Marker';");
      } else if (layer instanceof L.Rectangle) {
        maps.removeLayer(layer)
        console.log(" return 'Tooltip';");
      } else if (layer instanceof L.MarkerClusterGroup) {
        maps.removeLayer(layer)
        console.log(" return 'MarkerClusterGroup';");
      } else if (layer instanceof L.GeoJSON) {
        maps.removeLayer(layer)
        console.log(" return 'MarkerClusterGroup';");
      }
    });
    var boundingBox = L.rectangle(bounds, { color: "#3030ff", weight: .5 });
    this.map.addLayer(boundingBox);
    if (event.type == "city") {
      this.map.flyTo([event.lat, event.lon], 12, {
        animate: true,
        duration: 1 // in seconds
      });
    } else if (event.type == "neighbourhood") {
      this.map.flyTo([event.lat, event.lon], 15, {
        animate: true,
        duration: 1 // in seconds
      });
    }else if (event.type == "village") {
      this.map.flyTo([event.lat, event.lon], 14, {
        animate: true,
        duration: 1 // in seconds
      });
    }else{
   
        this.map.flyTo([event.lat, event.lon], 14, {
          animate: true,
          duration: 1 // in seconds
        });
      
    }
  }



  initializeMap(el: ElementRef) {

    // get map and set Init Value
    this.map = L.map(el.nativeElement).setView([this.lat, this.long], this.zoom);

    L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}').addTo(this.map);

    L.control.layers({
      'osm': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      "google layer 1": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', { attribution: 'google' }),
      "google layer 2": L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', { attribution: 'google' })
    }).addTo(this.map);

    // // add Polygon static
    var Polygon = [{
      "type": "Feature",
      "properties": { "party": "red" },
      "geometry": {
        "type": "Polygon",
        "coordinates": this.CoordinatesPolygon
      }
    }];

    L.geoJSON(Polygon, {
      style: function (feature: any) {
        switch (feature.properties.party) {
          case 'red': return { color: "red" };
        }
        return ''
      } as any
    }).addTo(this.map);




    if (this.drawFreeLine) {
      // click on FreeDraw map
      let freeDraw = new FreeDraw({
        mode: FreeDraw.ALL,
      });
      freeDraw.on('markers', event => {
        console.log('line markers', event.latLngs);
      });
      // js to Selector in ts file
      const selectElement = document.querySelector('.check') as any;
      selectElement.addEventListener('change', (event: any) => {

        if (this.line) {
          this.map.addLayer(freeDraw);
        } else {
          freeDraw.mode(NONE);
          this.map.removeLayer(freeDraw);
          let hasLayer = this.map.hasLayer(freeDraw);
          console.log(hasLayer);

        }
      });
    }

    let th=this
    // click on map
    this.map.on("click", function (evt: any) {
      console.log(evt.latlng);
      th.getInfo(evt.latlng)
    });

    
    // options leafIcon
    let leafIcon = L.Icon.extend({
      options: {
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
      }
    });

    const greenIcon = new leafIcon();
    // drawControl in map 
    const drawnItems = L.featureGroup().addTo(this.map);
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: this.drawPolygon,
        polyline: this.drawPolyline,
        marker: this.drawMarker? {icon: greenIcon} : false,
        circlemarker: this.drawCircleMarker
      }
    });

    this.map.addControl(drawControl);

    this.map.on("draw:created", function (evt: any) {
      debugger
      if (evt.layerType=='marker') {  
      let type = evt.layerType,
      layer = evt.layer;
      drawnItems.addLayer(layer);
      console.log(type, layer);
      }else{
        var type = evt.layerType,
      layer = evt.layer;
      drawnItems.addLayer(layer);
      console.log(type, layer);
      }
    });


    // add single marker leafIcon
    if (this.singleMaker != undefined) {
      L.marker([this.singleMaker.lat, this.singleMaker.long], { icon: greenIcon }).bindPopup(this.singleMaker.title).addTo(this.map);
    }

    if (this.ListSingleMaker != undefined && this.ListSingleMaker.length > 0) {
      this.ListSingleMaker.forEach(element => {
        L.marker([element.lat, element.long], { icon: greenIcon }).bindPopup(element.title).addTo(this.map);
      });
    }


    if (this.ListGroupMaker != undefined && this.ListGroupMaker.length > 0) {
      // Group markers
      var markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true
      });

      // cluster click zoom
      markers.on('clusterclick', function (a: any) {
        a.layer.zoomToBounds({ padding: [5, 5] });
      });

      this.ListGroupMaker.forEach(element => {
        var marker = L.marker(new L.LatLng(element.lat, element.long), { icon: greenIcon });
        marker.bindPopup(element.title);
        markers.addLayer(marker);
      });

      this.map.addLayer(markers);
    }

  }


  check() {
    console.log(this.line);
  }
  getInfo(event:any){

    this.httpClient
      .get(this.configuration$.OpenStreetMapGetInfoService + `lat=${event.lat}&lon=${event.lng}`)
      .subscribe((value: any) => {
        console.log(value);
        
      });
  }


}


