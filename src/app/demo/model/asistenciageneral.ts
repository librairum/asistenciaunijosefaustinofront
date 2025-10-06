export interface Asistenciageneral {
    codigoMarcador?: string;
    nombreMarcador?: string;
    codigoEmpleado?: string;
    nombreEmpleado?: string;
    fechaFormateada?: string;
    tiempoFormateado?: string;
    tiempoFormateadoSicape?: string;
     horaingreso1	:string;
   horasalida1	:string;
   horaingreso2	:string;
   horasalida2	:string;
   hoingreso3	:string;
   horasalida3	:string;
   horaingreso4	:string;
   horasalida4	:string;
   horafinal:string;
   observatipo	:string;
   dia	:string;
   obsfinal	:string;
   descuento	:string;
   total	:string;
   unidadDepartamento	:string;
   hrfalta	:string;
   cpumarcador	:string;
   department_id	:string;
   dept_name:string;
}

export interface   Departamento {
    id:number;
    codigoDepartamento:string;
    nombreDepartamento:string;
}