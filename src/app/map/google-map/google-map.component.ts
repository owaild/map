import { Component, OnInit } from '@angular/core';
declare const google: any;
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})

export class GoogleMapComponent implements OnInit {
  lat = 29.952443281286026;
  lng = 31.0499382019043;
  constructor() { }
  drawingManager:any
  public customStyle = [{  
    "featureType": "poi.medical",  
    "elementType": "all",  
    "stylers": [{  
        visibility: "off",  
    }]  
}, ]; 
  ngOnInit(): void {
  
  }
  map:any
  onMapReady(map :any) {
    this.initDrawingManager(map);
  }

  initDrawingManager(map: any) {
    this.map=map;
    console.log(map);
    this.map.mapTypeId='satellite'
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon","circle","polyline",'rectangle','marker']
      },
      
      polygonOptions: {
        draggable: true,
        editable: true
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      circleOptions: {
        fillColor: "#ffff00",
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    };
  
    const drawingManager = new google.maps.drawing.DrawingManager(options);
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event :any) {
      debugger
      if (event.type == 'circle') {
        var radius = event.overlay.getRadius();
        console.log(radius);
      }
    });
   
    map.addListener("click", (e:any) => {
      var poly = new google.maps.Polyline({ map: this.map, clickable: false });
      var move = google.maps.event.addListener(
        map,
        'mousemove',
        function (e:any) {
          poly.getPath().push(e.latLng);
        }
      );

       //mouseup-listener
       google.maps.event.addListenerOnce('mouseup', function (e:any) {
        map.removeListener(move);
        var path = poly.getPath();
        poly.setMap(null);
        poly = new google.maps.Polygon({ map: map, path: path });

        map.clearListeners(map.getDiv(), 'mousedown');

        // enable()
      });
   });
   
  }
 

  
}
