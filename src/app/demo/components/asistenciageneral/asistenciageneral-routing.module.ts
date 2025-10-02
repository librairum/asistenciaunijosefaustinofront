import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsistenciageneralComponent } from './asistenciageneral.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component:AsistenciageneralComponent,
        }
    ])],
    exports: [RouterModule]
})
export class AsistenciGeneralRoutingModule { }
