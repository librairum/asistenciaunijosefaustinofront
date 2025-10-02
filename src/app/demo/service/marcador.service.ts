import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Marcador } from '../model/Marcador';
import { Marcador_ins } from '../model/Marcador';
import { ApiResponse } from '../model/api_response';
import { GlobalserviceService } from './globalservice.service';
import { ConfigService } from './config.service';
@Injectable({
    providedIn: 'root',
})
export class MarcadorService {
    // private apiUrl = 'http://104.225.142.105:2060/Marcador';
    // private apiUrl = 'http://localhost:2060/Marcador';
    private apiUrl ='';

        constructor(private http: HttpClient,  private configService:ConfigService) {
            this.apiUrl = `${this.configService.getApiUrl()}/Marcador`;
        }

    // listar todos los marcadores
    getMarcadores(): Observable<Marcador[]> {
        return this.http.get<ApiResponse<Marcador>>(`${this.apiUrl}/SpLista`)
                  .pipe(map(response => response.data));
    }
    createMarcador(marcador: Marcador_ins): Observable<string> {
        return this.http
            .post<ApiResponse<string>>(`${this.apiUrl}/SpInserta`, marcador)
            .pipe(
                map((response) => response.item || ''),
                catchError((error) => {
                    console.error('Error al crear:', error);
                    return throwError(
                        () =>
                            new Error(
                                'No se pudo crear. Intente nuevamente.'
                            )
                    );
                })
            );
    }

    //elimanar
    deteleMarcador(codigo_cli: string,codigo_pro: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/SpElimina?codigoMarcadorCliente=${codigo_cli}&codigoMarcadorProveedor=${codigo_pro}`).pipe(
            catchError((error) => {
                console.error('Error al eliminar el registro:', error);
                return throwError(error);
            })
        );
    }
}
