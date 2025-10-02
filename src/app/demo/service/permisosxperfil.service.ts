import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api_response';
import { permisosxperfil } from '../model/permisosxperfil';
import { GlobalserviceService } from './globalservice.service';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class PermisosxperfilService {
    // private apiUrl='http://104.225.142.105:2060/Permisos'
    // private apiUrl='http://localhost:2060/Permisos'
    private apiUrl='';

    constructor(private http:HttpClient, private configService: ConfigService) {
      this.apiUrl = `${this.configService.getApiUrl()}/Permisos`;
     }

    getPermisosPorPerfil(codigoPerfil:string,codModulo:string):Observable<ApiResponse<permisosxperfil>>{
        const url = `${this.apiUrl}/SpTraeMenuxPerfil`;
        const params =new HttpParams()
        .set('codigoPerfil',codigoPerfil).set('codModulo',codModulo);
        return this.http.get<ApiResponse<permisosxperfil>>(url, {params});
    }
}
