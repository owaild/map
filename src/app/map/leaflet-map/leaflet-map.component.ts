import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import 'leaflet';
import "leaflet.markercluster";
import 'leaflet-draw';
import FreeDraw, { NONE } from 'leaflet-freedraw';
declare const L: any;
interface singleMaker{
  lat: number,
  long:number,
  title:string
} 
interface coordinate{
  lat: number,
  long:number,

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
  @Input() drawPolygon= true;
  @Input() drawPolyline= true;
  @Input() drawMarker= true;
  @Input() drawCircleMarker= true;
  @Input() drawFreeLine= true;
  @Input() singleMaker!:singleMaker
  @Input() CoordinatesPolygon:any
  @Input() ListSingleMaker!:singleMaker[]
  @Input() ListGroupMaker!:singleMaker[]

  line: boolean = false
  constructor() { }
  map!: any;

  ngOnInit(): void { }
  // AfterViewRun
  ngAfterViewInit(): void {
    this.initializeMap(this.divMap);
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
    var Polygon = [ {
      "type": "Feature",
      "properties": { "party": "red" },
      "geometry": {
        "type": "Polygon",
        "coordinates":this.CoordinatesPolygon 
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
 

    // click on map
    this.map.on("click", function (evt: any) {
      console.log(evt);
    });
    // drawControl in map 
    const drawnItems = L.featureGroup().addTo(this.map);
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: this.drawPolygon,
        polyline: this.drawPolyline,
        marker:  this.drawMarker,
        circlemarker: this.drawCircleMarker
      }
    });

    this.map.addControl(drawControl);

    this.map.on("draw:created", function (evt: any) {
      var type = evt.layerType,
        layer = evt.layer;
      drawnItems.addLayer(layer);
      console.log(type, layer);
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
    // add single marker leafIcon
    if (this.singleMaker!=undefined) {
      L.marker([this.singleMaker.lat, this.singleMaker.long], { icon: greenIcon }).bindPopup(this.singleMaker.title).addTo(this.map);
    }

    if (this.ListSingleMaker!=undefined&&this.ListSingleMaker.length>0) {
      this.ListSingleMaker.forEach(element => {
        L.marker([element.lat, element.long], { icon: greenIcon }).bindPopup(element.title).addTo(this.map);
      });
    }


    if (this.ListGroupMaker!=undefined &&this.ListGroupMaker.length >0) {
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
          var marker = L.marker(new L.LatLng(element.lat, element.long), {icon: greenIcon});
          marker.bindPopup(element.title);
          markers.addLayer(marker);
        });

        this.map.addLayer(markers);
    }
    
  }


  check() {
    console.log(this.line);
  }


}
