import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AutorizacionComponent } from './autorizacion.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component:AutorizacionComponent,
        }
    ])],
    exports: [RouterModule]
})
export class autorizacionroutingmodule { }
