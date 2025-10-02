import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MantenimientoMarcadoresComponent } from './mantenimiento-marcadores.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component:MantenimientoMarcadoresComponent,
        }
    ])],
    exports: [RouterModule]
})
export class MarcadoresRoutingModule { }
