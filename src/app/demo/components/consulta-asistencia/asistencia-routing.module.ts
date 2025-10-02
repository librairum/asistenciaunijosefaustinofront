import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetalleConsultaAsistenciaComponent } from './detalle-consulta-asistencia/detalle-consulta-asistencia.component';
import { ConsultaAsistenciaComponent } from './consulta-asistencia/consulta-asistencia.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component:ConsultaAsistenciaComponent,
        },
        {
            path: 'detalle-asistencia', component:DetalleConsultaAsistenciaComponent
        }
    ])],
    exports: [RouterModule]
})
export class AsistenciaRoutingModule { }
