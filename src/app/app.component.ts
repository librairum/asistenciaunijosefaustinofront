import { Component,HostListener,OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AutorizacionService } from './demo/service/autorizacion.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private authService: AutorizacionService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: Event) {
        this.authService.logout();
    }

    @HostListener('window:unload', ['$event'])
    unloadHandler(event: Event) {
        this.authService.logout();
    }
}
