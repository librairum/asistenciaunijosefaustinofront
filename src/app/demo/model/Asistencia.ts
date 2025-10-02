export interface Asistencia {
    item: number;
    codigoTrabajador: string;
    nombretrabajador: string;
    fechaInicio: string;
    fechaFin: string;
    codigoPlanilla: string;
    nombrePlanilla: string;
    dias: number;
    horas25: string;
    horas60: string;
    horas100: string;
    diasFalta: string;
    nHraDomPag: string;
    nHraFerTra: string;
    hturnoManu:string;
    minTardanza:string;
    nHorExtr25:string;
    nHorExtr35:string;
    nHorExtr50:string;
    nHorExtr60:string;
    nHorExtrDo:string;
    nHorExtr100:string;
    nHorExtr100Obrero:string;
    horasTrabajadas:string;
    horasHorario : string;
    horasExtrasTotales : string;
    diasDescanso:number;
}
export interface PLanilla_Combo {
    codigoPlanilla: string;
    nombrePlanilla: string;
}

export interface AsistenciaDetalle {
    item: number;
    fechaMarcacion: string;
    codigotrabajador: string;
    nombreTrabajador: string;
    diaNombre: string;
    horaEntrada: string;
    horaSalida: string;
    diasFalta: string;
    nHraDomPag: string;
    nHraFerTra:string;
    hturnoManu:string;
    minTardanza:string;
    nHorExtr25:string;
    nHorExtr35:string;
    nHorExtr50:string;
    nHorExtr60:string;
    nHorExtrDo:string;
    nHorExtr100:string;
    nHorExtr100Obrero:string;
    dias: number;
    horas25: string;
    horas35: string;
    horas60: string;
    horas100: string;
    horarioPersonalizado_Motivo:string;
    horarioPersonalizado:string;
    horasTrabajadas:string;
    horasExtrasTrabajadas:string;
   
}
