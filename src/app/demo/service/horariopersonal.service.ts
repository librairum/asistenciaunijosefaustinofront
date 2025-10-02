import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalserviceService } from './globalservice.service';
import { map, Observable } from 'rxjs';
import { horario_personal } from '../model/horario_personal';
import { ApiResponse } from '../model/api_response';
import { ConfigService } from './config.service';
import { horario_actualizacion } from '../model/horario_actualizacion';

@Injectable({
    providedIn: 'root',
})
export class HorariopersonalService {
    private apiUrl = '';
    constructor(
        private http: HttpClient,
        private gs: GlobalserviceService,
        private configService: ConfigService
    ) {
        this.apiUrl = `${configService.getApiUrl()}/HorarioPersonal`;
    }

    getAll(EmpresaCod: string): Observable<horario_personal[]> {
        return this.http
            .get<ApiResponse<horario_personal>>(`${this.apiUrl}/SpTrae`, {
                params: { EmpresaCod },
            })
            .pipe(map((response) => response.data));
    }

    getHorarioPorEmpleado(idpersonal: number): Observable<any[]> {
        const empresaCod = this.configService.getCodigoEmpresa();
        const dia = '00';

        return this.http
            .get<ApiResponse<any>>(`${this.apiUrl}/SpTraeDet`, {
                params: {
                    empresaCod,
                    idpersonal,
                    dia,
                },
            })
            .pipe(map((response) => response.data));
    }

    actualizarHorario(data: horario_actualizacion): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/SpActualizaDinamico`, data);
    }
}
