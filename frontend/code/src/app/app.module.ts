import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeapmapComponent } from './components/heapmap/heapmap.component';
import { SpidervisComponent } from './components/spidervis/spidervis.component';
import { PievisComponent} from './components/pievis/pievis.component'

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox'
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';

import { AngularResizeEventModule } from 'angular-resize-event';
import { InfoboxComponent } from './components/infobox/infobox.component';



@NgModule({
  declarations: [
    AppComponent,
    HeapmapComponent,
    SpidervisComponent, 
    PievisComponent, 
    InfoboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, 
    MatCheckboxModule, 
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatAutocompleteModule, 
    MatButtonToggleModule, 
    MatToolbarModule, 
    MatTooltipModule, 
    MatMenuModule,
    BrowserAnimationsModule, 
    MatExpansionModule,
    MatSidenavModule, 
    MatListModule, 
    MatChipsModule, 
    MatTableModule,

    AngularResizeEventModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
