import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Graficos2PageRoutingModule } from './graficos2-routing.module';

import { Graficos2Page } from './graficos2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Graficos2PageRoutingModule
  ],
  declarations: [Graficos2Page]
})
export class Graficos2PageModule {}
