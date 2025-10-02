import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { Table, TableModule } from 'primeng/table';
import { timer } from 'rxjs';
import { Asistencia, AsistenciaDetalle } from 'src/app/demo/model/Asistencia';
import { AsistenciaService } from 'src/app/demo/service/asistencia.service';
import { BreadcrumbService } from 'src/app/demo/service/breadcrumb.service';

import * as XLSX from 'xlsx';

@Component({
    selector: 'app-detalle-consulta-asistencia',
    standalone: true,
    imports: [TableModule, CommonModule, PanelModule, RouterModule, BreadcrumbModule, ButtonModule],
    templateUrl: './detalle-consulta-asistencia.component.html',
    styleUrl: './detalle-consulta-asistencia.component.scss',
    providers: [MessageService]
})
export class DetalleConsultaAsistenciaComponent implements OnInit {
    breadcrumbs: any[] = [];
    asistencias: AsistenciaDetalle[] = [];
    navigationData: any;
    loading: boolean = false;

    @ViewChild('dt1') dt1: Table | undefined
    constructor(
        private aS: AsistenciaService,
        private bS: BreadcrumbService,
        private rout: Router,
        private ms: MessageService
    ) {
        const navigation = rout.getCurrentNavigation();
        if (navigation?.extras?.state) {

            this.navigationData = navigation.extras.state;
        } else {
            this.rout.navigate(['/Menu/asistencia']);
        }
    }
    ngOnInit(): void {
        this.loading = true;
        timer(2000).subscribe(() => {
            this.loading = false;
        })
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            { label: 'Asistencia', routerLink: '/Menu/asistencia', command: () => this.volverAListado() },
            { label: 'Detalle Asistencia', routerLink: '/Menu/asistencia/detalle-asistencia' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc => {
            this.breadcrumbs = bc;
        })

        this.cargarDetalleAsistencia()
    }

    cargarDetalleAsistencia() {

        const fechaInicio = this.aS.formatDateForApi(this.navigationData.fechaInicio);
        const fechaFin = this.aS.formatDateForApi(this.navigationData.fechaFin);

        this.aS.getCalculoDetalle(
            fechaInicio,
            fechaFin,
            this.navigationData.codigoEmpleado
        ).subscribe({
            next: (response) => {
                if (response.isSuccess) {

                    this.asistencias = response.data;
                }
            },
            error: (error) => console.error('Error:', error)
        });
    }

    getDayOfWeek(date: string): string {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const fecha = new Date(date);
        return dias[fecha.getDay()];
    }
    calculateTotal(field: string): string {
        // Función para sumar tiempos en formato HH:mm, soportando valores negativos
        const sumTimes = (times: string[]): string => {
            let totalMinutes = times.reduce((acc, time) => {
                // Determinar si el tiempo es negativo
                const isNegative = time.startsWith('-');
                let [hours, minutes] = time.replace('-', '').split(':').map(Number); // Quitar el signo y convertir a número

                let timeInMinutes = (hours * 60 + minutes);

                // Si el tiempo era negativo, resta los minutos
                if (isNegative) {
                    timeInMinutes *= -1;
                }

                return acc + timeInMinutes;
            }, 0);

            // Manejar el signo del resultado final
            const sign = totalMinutes < 0 ? '-' : '';
            totalMinutes = Math.abs(totalMinutes); // Trabajar con el valor absoluto para el formateo

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        const times = this.asistencias.map(a => a[field as keyof AsistenciaDetalle] as string);
        return sumTimes(times);
    }
    /*
    calculateTotal(field: string): string {
        // Función para sumar tiempos en formato HH:mm
        const sumTimes = (times: string[]): string => {
            let totalMinutes = times.reduce((acc, time) => {
                const [hours, minutes] = time.split(':').map(Number);
                return acc + (hours * 60 + minutes);
            }, 0);

            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        const times = this.asistencias.map(a => a[field as keyof AsistenciaDetalle] as string);
        return sumTimes(times);
    }
    */

    volverAListado() {
        const navigationExtras2 = {
            state: {
                startDate: this.navigationData.fechaInicio,
                endDate: this.navigationData.fechaFin,
                selectedPlanilla: this.navigationData.planillaSeleccionada
            }
        }
        this.rout.navigate(['/Menu/asistencia'], navigationExtras2)
    }

    generateEXCEL() {
        const fechaInicio = this.aS.formatDateForApi(this.navigationData.fechaInicio);
        const fechaFin = this.aS.formatDateForApi(this.navigationData.fechaFin);
        const filteredData = this.dt1?.filteredValue;
        if (filteredData && filteredData.length > 0) {
            const filteredColumnsData = filteredData.map((item: any) => ({
                item: item.item,
                codigotrabajador: item.codigotrabajador,
                nombretrabajador:item.nombreTrabajador,
                Fecha_Marcacion: item.fechaMarcacion,
                Dia: item.diaNombre,
                Hora_Entrada: item.horaEntrada,
                Hora_Salida: item.horaSalida,
                horasTrabajadas: item.horasTrabajadas,
                horasExtrasTrabajadas:item.horasExtrasTrabajadas,
                // HDomPag: item.nHraDomPag,
                // HFerTra: item.nHraFerTra,
                // HTurManu: item.hTurnoManu,
                // MinTardanza: item.minTardanza,
                HExtr25: item.nHorExtr25,
                HExtr35: item.nHorExtr35,
                HExtr50:item.nHorExtr50,
                HExtr60: item.nHorExtr60,
                HExtr100:item.nHorExtr100,
                HExtr100Obrero:item.nHorExtr100Obrero
                // nHorExtrDo: item.nHorExtrDo,
            }));
            const wb = XLSX.utils.book_new();

            const ws = XLSX.utils.json_to_sheet(filteredColumnsData);

            // Añade la hoja de trabajo al libro de trabajo
            XLSX.utils.book_append_sheet(wb, ws, fechaInicio + '_' + fechaFin + '_' + this.navigationData.codigoEmpleado);

            // Descarga el archivo Excel
            XLSX.writeFile(wb, 'Detalle_' + fechaInicio + '_' + fechaFin + '_' + this.navigationData.codigoEmpleado + '.xlsx');
        } else if (this.asistencias && this.asistencias.length > 0) {
            const filteredColumnsData = this.asistencias.map(
                (item: any) => ({
                    item: item.item,
                    codigotrabajador: item.codigotrabajador,
                    nombretrabajador:item.nombreTrabajador,
                    Fecha_Marcacion: item.fechaMarcacion,
                    Dia: item.diaNombre,
                    Hora_Entrada: item.horaEntrada,
                    Hora_Salida: item.horaSalida,
                    horasTrabajadas: item.horasTrabajadas,
                    horasExtrasTrabajadas:item.horasExtrasTrabajadas,
                    // HDomPag: item.nHraDomPag,
                    // HFerTra: item.nHraFerTra,
                    // HTurManu: item.hTurnoManu,
                    // MinTardanza: item.minTardanza,
                    HExtr25: item.nHorExtr25,
                    HExtr35: item.nHorExtr35,
                    HExtr50:item.nHorExtr50,
                    HExtr60: item.nHorExtr60,
                    HExtr100:item.nHorExtr100,
                    HExtr100Obrero:item.nHorExtr100Obrero
                    // nHorExtrDo: item.nHorExtrDo,
                })
            );

            const wb = XLSX.utils.book_new();

            const ws = XLSX.utils.json_to_sheet(filteredColumnsData);

            // Añade la hoja de trabajo al libro de trabajo
            XLSX.utils.book_append_sheet(wb, ws, fechaInicio + '_' + fechaFin + '_' + this.navigationData.codigoEmpleado);

            // Descarga el archivo Excel
            XLSX.writeFile(wb, 'Detalle_' + fechaInicio + '_' + fechaFin + '_' + this.navigationData.codigoEmpleado + '.xlsx');
        } else {
            this.ms.add({ severity: 'error', summary: 'Error', detail: 'No se encontro ningun registro para el excel' });
        }

    }
}
