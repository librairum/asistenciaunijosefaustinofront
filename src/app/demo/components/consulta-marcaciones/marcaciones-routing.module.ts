import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsultaMarcacionesComponent } from './consulta-marcaciones.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component:ConsultaMarcacionesComponent,
        }
    ])],
    exports: [RouterModule]
})
export class MarcacionesRoutingModule { }
