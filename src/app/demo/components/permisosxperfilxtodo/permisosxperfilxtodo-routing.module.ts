import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermisosxperfilxtodoComponent } from './permisosxperfilxtodo.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component:PermisosxperfilxtodoComponent,
        }
    ])],
    exports: [RouterModule]
})
export class PermisosxPerfilxTodoRoutingModule { }
