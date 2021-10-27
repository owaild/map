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
  line: boolean = false
  drawFreeLine: boolean = true
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
  changeType(MapType:any){
    this.map.setMapTypeId(MapType);    
  }

  initDrawingManager(map: any) {
    this.map=map;
    // this.map.mapTypeId='satellite'
    // this.map.mapTypeId='hybrid'
    // this.map.mapTypeId='roadmap'
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon","circle","polyline",'rectangle','marker']
      },
      
      polygonOptions: {
        draggable: true,
        editable: true
      },
      // drawingMode: google.maps.drawing.OverlayType.POLYGON,
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
   
    const selectElement = document.querySelector('.check') as any;
    selectElement.addEventListener('change', (event: any) => {

      if (event.target.value) {
        disable()
  
      google.maps.event.addDomListener(map.getDiv(),'mousedown',function(e:any){
        drawFreeHand()
      });
      }
    });
    function enable(){
      map.setOptions({
        draggable: true, 
        zoomControl: true, 
        scrollwheel: true, 
        disableDoubleClickZoom: true
      });
    }
    function disable(){
      map.setOptions({
        draggable: false, 
        zoomControl: false, 
        scrollwheel: false, 
        disableDoubleClickZoom: false
      });
    }

    function drawFreeHand(){
        //the polygon
        var poly=new google.maps.Polyline({map:map,clickable:false});
        //move-listener
        var move=google.maps.event.addListener(map,'mousemove',function(e :any){
            poly.getPath().push(e.latLng);
        });
        //mouseup-listener
        google.maps.event.addListenerOnce(map,'mouseup',function(e :any){
            google.maps.event.removeListener(move);
            var path=poly.getPath();
            poly.setMap(null);
            poly=new google.maps.Polygon({map:map,path:path});
            
            var bounds = [];
            for (var i = 0; i < path.length; i++) {
                  var point = {
                    lat: path.getAt(i).lat(),
                    lng: path.getAt(i).lng()
                  };
                  bounds.push(point);
             }
            console.log(bounds);
            let array = [];
            for (var i = 0; i < poly.getPath().getLength(); i++) {
              array.push(poly.getPath().getAt(i).toUrlValue(6)) 
            }
            console.log('array',array);
            
            google.maps.event.clearListeners(map.getDiv(), 'mousedown');
            enable()
        });
  }


    google.maps.event.addDomListener(map.getDiv(),'mousedown',function(e :any){
      drawFreeHand()  
    });


  //   map.addListener("click", (e:any) => {
  //     disable()

  //     var poly = new google.maps.Polyline({ map: this.map, clickable: false });
  //     var move = google.maps.event.addListener(
  //       map,
  //       'mousemove',
  //       function (e:any) {
  //         poly.getPath().push(e.latLng);
  //       }
  //     );

  //      //mouseup-listener
  //      google.maps.event.addListenerOnce('mouseup', function (e:any) {
  //       map.removeListener(move);
  //       var path = poly.getPath();
  //       poly.setMap(null);
  //       poly = map.Polygon({ map: map, path: path });

  //       map.clearListeners(map.getDiv(), 'mousedown');

  //       enable()
  //     });

  //  });
 
   
  }
  check() {
    console.log(this.line);
  }

  
}
