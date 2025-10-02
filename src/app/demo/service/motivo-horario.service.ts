import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalserviceService } from './globalservice.service';
import { ApiResponse } from '../model/api_response';
import { catchError, map, Observable, throwError } from 'rxjs';
import { motivo_horario } from '../model/motivo_horario';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class MotivoHorarioService {
    private apiUrl = '';

    constructor(private http: HttpClient,  private configService:ConfigService) {
        this.apiUrl = `${this.configService.getApiUrl()}`;
    }

    getAll(EmpresaCod: string): Observable<motivo_horario[]> {
        return this.http
            .get<ApiResponse<motivo_horario>>(`${this.apiUrl}/SpTrae`, {
                params: { EmpresaCod },
            })
            .pipe(map((response) => response.data));
    }
    //crear
    create(motivoHorario: motivo_horario): Observable<string> {
        const params = new HttpParams()
            .set('empresaCod', motivoHorario.empresaCod)
            .set('idMotivo', motivoHorario.idMotivo)
            .set('descripcion', motivoHorario.descripcion)
            .set('flagCalculaTiempo', motivoHorario.flagCalculaTiempo);

        return this.http
            .post<ApiResponse<string>>(`${this.apiUrl}/SpInserta`, null, {
                params,
            })
            .pipe(
                map((response) => response.item || ''),
                catchError((error) => {
                    console.error(
                        'Error al crear el motivo de horario:',
                        error
                    );
                    return throwError(
                        () =>
                            new Error(
                                'No se pudo crear el motivo de horario. Intente nuevamente.'
                            )
                    );
                })
            );
    }

    // actualizar aun
    update(motivoHorario: motivo_horario): Observable<string> {
        const params = new HttpParams()
        .set('EmpresaCod', motivoHorario.empresaCod)
        .set('IdMotivo', motivoHorario.idMotivo)
        .set('Descripcion', motivoHorario.descripcion)
        .set('FlagCalculaTiempo', motivoHorario.flagCalculaTiempo)

        return this.http.put<ApiResponse<string>>(
            `${this.apiUrl}/SpActualiza`, null, {params}
        )
        .pipe(
            map((response => response.item || ''),
            catchError((error) => {
                console.error('Error al actualizar: ', error);
                return throwError(() => new Error('No se pudo actualizar el motivo'))
            })
        )
        )
    }

    delete(empresaCod: string, idMotivo: string): Observable<void> {
        return this.http
            .delete<void>(
                `${this.apiUrl}/SpElimina?EmpresaCod=${empresaCod}&IdMotivo=${idMotivo}`
            )
            .pipe(
                catchError((error) => {
                    console.error('Error al eliminar el registro:', error);
                    return throwError(error);
                })
            );
    }
}
