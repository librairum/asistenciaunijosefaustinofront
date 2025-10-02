import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { m_anio } from '../model/M_Anio';
import { ApiResponse } from '../model/api_response';
import { GlobalserviceService } from './globalservice.service';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class MAnioService {
    // private apiUrl='http://104.225.142.105:2060/Anio'
// private apiUrl='http://localhost:2060/Anio'
private apiUrl = '';
constructor(private http:HttpClient, private configService: ConfigService) {
        this.apiUrl = `${configService.getApiUrl()}/Anio`;
     }

    //listar todo
    getAll(): Observable<m_anio[]> {
        return this.http.get<ApiResponse<m_anio>>(`${this.apiUrl}/SpList`)
          .pipe(map(response => response.data));
    }
    //crear
    create(mAnio: m_anio): Observable<string> {
        return this.http.post<ApiResponse<string>>(`${this.apiUrl}/SpCreate`, mAnio)
        .pipe(
            map(response => response.item || ''),
            catchError(error=>{
                console.error('Error al crear el año:', error);
                return throwError(() => new Error('No se pudo crear el año. Intente nuevamente.'));
            })
        );
    }
    //actualizar
    update(pal61Codigo:string,mAnio:m_anio): Observable<string>{
        return this.http.put<ApiResponse<string>>(`${this.apiUrl}/SpUpdate`, mAnio)
        .pipe(map(response => response.item));
    }
    // Eliiiminar
    delete(pal61Codigo: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/SpDelete?codigo=${pal61Codigo}`).pipe(
            catchError((error) => {
                console.error('Error al eliminar el registro:', error);
                return throwError(error);
            })
        );
    }
}
