import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marcaciones } from '../model/Marcaciones';
import { GlobalserviceService } from './globalservice.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MarcacionesService {
    // private apiUrl='http://104.225.142.105:2060/Marcaciones'
    // private apiUrl='http://localhost:2060/Marcaciones'
    private apiUrl='';
    constructor(private http:HttpClient,private configService: ConfigService) {

      this.apiUrl = `${configService.getApiUrl()}/Marcaciones`;
    }

  //listar
  getMarcaciones():Observable<Marcaciones[]>{
    return this.http.get<Marcaciones[]>(this.apiUrl)
  }
  // parametros
  getMarcacionesParametros(
    nombreSedeEquipo?: string,
    nombreEquipo?: string,
    nombreSedeTrabajador?: string,
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Observable<Marcaciones[]>{
    let params=new HttpParams();
    if (nombreSedeEquipo) {
        params = params.set('nombreSedeEquipo', nombreSedeEquipo);
      }
      if (nombreEquipo) {
        params = params.set('nombreEquipo', nombreEquipo);
      }
      if (nombreSedeTrabajador) {
        params = params.set('nombreSedeTrabajador', nombreSedeTrabajador);
      }
      if (fechaInicio) {
        params = params.set('fechaInicio', fechaInicio.toISOString());
      }
      if (fechaFin) {
        params = params.set('fechaFin', fechaFin.toISOString());
      }
      return this.http.get<Marcaciones[]>(this.apiUrl, { params });
    }

}
