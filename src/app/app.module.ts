import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { AppComponent } from "./app.component";
import { OdeToJoyScoreComponent } from "./ode-to-joy-score/ode-to-joy-score.component";
import { BuildingBlocksComponent } from "./building-blocks/building-blocks.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent, OdeToJoyScoreComponent, BuildingBlocksComponent],
  imports: [
    BrowserModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
