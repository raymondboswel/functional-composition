import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OdeToJoyScoreComponent } from './ode-to-joy-score/ode-to-joy-score.component';

@NgModule({
  declarations: [
    AppComponent,
    OdeToJoyScoreComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
