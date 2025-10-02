import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotivoHorarioComponent } from './motivo-horario.component';

const routes: Routes = [{ path: '', component: MotivoHorarioComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotivoHorarioRoutingModule { }
