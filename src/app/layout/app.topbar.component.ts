import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { OverlayPanel } from 'primeng/overlaypanel';
import { Router } from '@angular/router';
import { GlobalserviceService } from '../demo/service/globalservice.service';
import { AutorizacionService } from '../demo/service/autorizacion.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,private link:Router,private gS:GlobalserviceService,private aS:AutorizacionService) { }

    nombre:string=this.gS.getNombre_Usuario();


    cerrarSesion(){
        this.aS.logout();
        this.gS.clearSession();
        this.link.navigate(['/Inicio_Sesion']);

    }
}
