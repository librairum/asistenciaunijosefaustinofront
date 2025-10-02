import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    private config: any = {}

    constructor(private http: HttpClient) { }

    async loadConfig(): Promise<void> {
        try{
            this.config = await firstValueFrom(
                this.http.get('./assets/config.json')
            );
            (window as any).config = this.config;
        } catch (error) {
            console.error('Error cargando el config.json ', error)
        }
    }

    getConfig(key: string): any{
        return (window as any).config ? (window as any).config[key] : null;
    }

    getApiUrl(): string {
        return this.getConfig('url');
    }

    getCodigoEmpresa(): string {
        return this.getConfig('codigoEmpresa')
    }

    getModuloEmpresa(): string {
        return this.getConfig('moduloEmpresa')
    }
}
