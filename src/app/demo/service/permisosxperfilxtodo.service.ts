import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../model/api_response';
import { perfilxpermisos, permisosxperfilxtodo } from '../model/permisosxperfilxtodo';
import { O } from '@fullcalendar/core/internal-common';
import { GlobalserviceService } from './globalservice.service';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class PermisosxperfilxtodoService {
    // private apiUrl='http://104.225.142.105:2060/Permisos'
    // private apiUrl2='http://104.225.142.105:2060/Perfil/Splist'

    private apiUrl='';
    private apiUrl2='';
    constructor(private http:HttpClient, private configService: ConfigService) {
        this.apiUrl = `${configService.getApiUrl()}/Permisos`;
        this.apiUrl2 = `${configService.getApiUrl()}/Perfil/Splist`;

    }

    getPermisosPorPerfilxtodo(codigoPerfil:string,codModulo:string):Observable<ApiResponse<permisosxperfilxtodo>>{
        const params = new HttpParams()
            .set('codigoPerfil',codigoPerfil)
            .set('codModulo',codModulo);
        return this.http.get<ApiResponse<permisosxperfilxtodo>>(`${this.apiUrl}/SpTodoMenuxPerfil`, { params });
    }

    insertarPermisos(codModulo:string,codigoPerfil:string,xmlPermisos:string):Observable<ApiResponse<permisosxperfilxtodo>>{
        const body={
            codModulo:codModulo
            ,codigoPerfil:codigoPerfil
            ,xmlPermisos:xmlPermisos
        };
        const headers=new HttpHeaders({
            'Content-Type':'application/json'
        })
        return this.http.post<ApiResponse<permisosxperfilxtodo>>(`${this.apiUrl}/SpInsertaMenuxPerfil`, body, { headers });

    }

    getPerfilesCombo():Observable<perfilxpermisos[]>{
        return this.http.get<ApiResponse<perfilxpermisos>>(this.apiUrl2).pipe(map(response => response.data));
    }
}
