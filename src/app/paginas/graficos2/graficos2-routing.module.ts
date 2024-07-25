import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Graficos2Page } from './graficos2.page';

const routes: Routes = [
  {
    path: '',
    component: Graficos2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Graficos2PageRoutingModule {}
