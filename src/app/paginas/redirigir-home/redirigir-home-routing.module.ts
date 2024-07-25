import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RedirigirHomePage } from './redirigir-home.page';

const routes: Routes = [
  {
    path: '',
    component: RedirigirHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedirigirHomePageRoutingModule {}
