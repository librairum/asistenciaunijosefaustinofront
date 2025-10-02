import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AnioComponent } from './anio.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component:AnioComponent,
        }
    ])],
    exports: [RouterModule]
})
export class AnioRoutingModule { }
