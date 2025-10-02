import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Marcador } from '../model/Marcador';
import { Marcador_ins } from '../model/Marcador';
import { ApiResponse } from '../model/api_response';
import { Asistenciageneral } from '../model/asistenciageneral';
import { GlobalserviceService } from './globalservice.service';
import { ConfigService } from './config.service';
@Injectable({
    providedIn: 'root',
})
export class AsistenciaGeneralService {
    // private apiUrl = 'http://104.225.142.105:2060/Asistencia';
    // private apiUrl = 'http://localhost:2060/Asistencia';
    private apiUrl='';
    constructor(private http: HttpClient, private gs: GlobalserviceService, private configService: ConfigService) {
        this.apiUrl = `${this.configService.getApiUrl()}/Asistencia`;
    }

    getAsistenciaByDateRange(fechainicio: string,fechafin: string, marcadores:string): Observable<Asistenciageneral[]> {
        let urlConsulta = `${this.apiUrl}/SpListAsistenciGeneral?fechainicio=${fechainicio}&fechafin=${fechafin}&marcadores=${marcadores}`

        return this.http.get<ApiResponse<Asistenciageneral>>(urlConsulta)
                  .pipe(map(response => response.data));
    }
}
