import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LeafletMapComponent } from './map/leaflet-map/leaflet-map.component';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapComponent } from './map/google-map/google-map.component';


@NgModule({
  declarations: [
    AppComponent,
    LeafletMapComponent,
    GoogleMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQPAUG_pAgy43fobBvTAMGNFnDwZzkfdA',
      libraries: ['places', 'drawing', 'geometry'],
      
     }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
