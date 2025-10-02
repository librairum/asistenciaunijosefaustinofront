import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { AutorizacionComponent } from './demo/components/autorizacion/autorizacion.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfigService } from './demo/service/config.service';

export function initAppConfig(configService: ConfigService) {
    return () => configService.loadConfig()
}

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule,AutorizacionComponent,AppLayoutModule],
    providers: [
        {provide: APP_INITIALIZER,
            useFactory: initAppConfig,
            deps: [ConfigService],
            multi: true
        },
        CountryService, CustomerService,
        EventService, IconService,
        NodeService,
        PhotoService, ProductService,Breadcrumb
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

/*
    {
    provide: LocationStrategy,
    useClass: PathLocationStrategy },
    // */
