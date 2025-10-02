import { HttpClient } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { Autenticacion } from '../model/autentication';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiResponse } from '../model/api_response';
import { GlobalserviceService } from './globalservice.service';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class AutorizacionService {

    // private apiUrl = 'http://104.225.142.105:2060/Autenticacion';
    // private apiUrl = 'http://localhost:2060/Autenticacion';
    private apiUrl = '';
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());


    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiUrl =  `${this.configService.getApiUrl()}/Autenticacion`;
        // Agregar listener para el evento beforeunload
        window.addEventListener('beforeunload', () => {
            this.logout();
        });

        // Agregar listener para el evento unload
        window.addEventListener('unload', () => {
            this.logout();
        });

        // Agregar listener para el evento visibilitychange
        /*document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.logout();
            }
        });*/
     }

    autenticacion(autenticacion: Autenticacion): Observable<ApiResponse<Autenticacion>> {
        const url = `${this.apiUrl}/SpList`;
        return this.http.post<ApiResponse<Autenticacion>>(url, autenticacion).pipe(
            tap(response => {
                if (response.isSuccess) {
                    // Guardar datos de sesión
                    localStorage.setItem('userSession', JSON.stringify({
                        isAuthenticated: true,
                        userData: response.data[0]
                    }));
                    this.isAuthenticatedSubject.next(true);
                    localStorage.setItem('sessionStartTime', new Date().toISOString());
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('userSession');
        localStorage.removeItem('sessionStartTime');
        this.isAuthenticatedSubject.next(false);
    }

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    private checkAuthStatus(): boolean {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session).isAuthenticated : false;
    }
    private checkSessionExpiration(): boolean {
        const startTime = localStorage.getItem('sessionStartTime');
        if (!startTime) return false;

        const currentTime = new Date();
        const sessionStart = new Date(startTime);
        const diffHours = (currentTime.getTime() - sessionStart.getTime()) / (1000 * 60 * 60);

        // Por ejemplo, cerrar sesión después de 24 horas
        return diffHours >= 4;
    }
}
