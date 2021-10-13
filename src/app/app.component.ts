import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit,AfterViewInit {
  title = 'my-map';
  
  singleMaker:singleMaker= {
    lat: 29.952443281286026,
    long:31.0499382019043,
    title:'I am a single Maker.'
  }

  ListSingleMaker:singleMaker[]= [{
    lat: 29.952531592239435,
    long:31.049627065658573,
    title:'I am a List Single Maker 2.'
  },
  {
    lat: 29.95272215771375,
    long:31.049246191978458,
    title:'I am a List Single Maker 3.'
  }
]

ListGroupMaker:singleMaker[]=[
  {
    lat: 29.952443281276031,
    long:31.149637065658263,
    title:'I am a List Group Maker 1.'
  },
  {
    lat: 29.952443281276031,
    long:31.149637065658263,
    title:'I am a List Single Maker 2.'
  },
  {
    lat: 29.952443281276028,
    long:31.149637065658671,
    title:'I am a List Single Maker 3.'
  }
]

CoordinatesPolygon:any=[[
          [31.05, 25.99],
          [31.06, 25.99],
          [31.03, 21.99],
          [27.04, 21.99],
          [27.05, 25.99]
        ]]

  line:boolean=false
  constructor(
    ) { }

    
  ngAfterViewInit(): void {
    // this.initializeMap(this.mapa,this.line); 
  }





  ngOnInit(): void {
    
  }
 
}
