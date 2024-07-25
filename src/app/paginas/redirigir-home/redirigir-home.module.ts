import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RedirigirHomePageRoutingModule } from './redirigir-home-routing.module';

import { RedirigirHomePage } from './redirigir-home.page';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RedirigirHomePageRoutingModule,
    RouterLink
  ],
  declarations: [RedirigirHomePage]
})
export class RedirigirHomePageModule {}
