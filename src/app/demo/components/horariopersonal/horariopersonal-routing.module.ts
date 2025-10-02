import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorariopersonalComponent } from './horariopersonal.component';

const routes: Routes = [{ path: '', component: HorariopersonalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HorariopersonalRoutingModule { }
