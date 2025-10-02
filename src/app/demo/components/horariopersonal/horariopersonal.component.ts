import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    ConfirmationService,
    MessageService,
    PrimeNGConfig,
} from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { HorariopersonalService } from '../../service/horariopersonal.service';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { horario_personal } from '../../model/horario_personal';
import { DialogModule } from 'primeng/dialog';
import { MotivoHorarioService } from '../../service/motivo-horario.service';
import { motivo_horario } from '../../model/motivo_horario';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AsistenciaService } from '../../service/asistencia.service';
import { PLanilla_Combo } from '../../model/Asistencia';
import { MultiSelectModule } from 'primeng/multiselect';
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfigService } from '../../service/config.service';

@Component({
    selector: 'app-horariopersonal',
    imports: [
        ToastModule,
        TableModule,
        ReactiveFormsModule,
        CommonModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        PanelModule,
        BreadcrumbModule,
        ConfirmDialogModule,
        FormsModule,
        CheckboxModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        MultiSelectModule,
    ],
    standalone: true,
    templateUrl: './horariopersonal.component.html',
    styleUrl: './horariopersonal.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class HorariopersonalComponent {
    horarioPersonalForm: FormGroup;
    horarioPersonalLista: horario_personal[] = [];
    items: any[] = [];
    displayModal: boolean = false;
    horarioEmpleado: any[] = [];
    motivos: motivo_horario[] = [];
    nombreCargoSeleccionado: string[] = [];
    nombreCargos: { label: string; value: string }[] = [];
    nombreMotivos: { label: string; value: string }[] = [];
    valoresUnicosPorColumna: {
        [key: string]: { label: string; value: string }[];
    } = {};
    empleadoSeleccionadoDNI: string = '';
    empleadoSeleccionadoNombreCompleto: string = '';

    @ViewChild('dt') dt: Table;

    diasSemana = [
        { nombre: 'Lunes', codigo: '01' },
        { nombre: 'Martes', codigo: '02' },
        { nombre: 'Miércoles', codigo: '03' },
        { nombre: 'Jueves', codigo: '04' },
        { nombre: 'Viernes', codigo: '05' },
        { nombre: 'Sábado', codigo: '06' },
        { nombre: 'Domingo', codigo: '07' },
    ];

    constructor(
        private horarioPersonalService: HorariopersonalService,
        private mS: MessageService,
        private bS: BreadcrumbService,
        private motivoHorarioService: MotivoHorarioService,
        private asistenciaService: AsistenciaService,
        private primengConfig: PrimeNGConfig,
        private configService: ConfigService
    ) {}

    ngOnInit(): void {
        this.cargarCargos();
        this.cargarMotivos();
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            {
                label: 'Asignación de horarios a personal',
                routerLink: '/Menu/motivohorario',
            },
        ]);
        this.bS.currentBreadcrumbs$.subscribe((bc) => {
            this.items = bc;
        });
        this.refrescar();
        this.traducirMenu();
    }

    traducirMenu() {
        this.primengConfig.setTranslation({
            startsWith: 'Empieza con',
            contains: 'Contiene',
            notContains: 'No contiene',
            endsWith: 'Termina con',
            equals: 'Igual a',
            notEquals: 'Distinto de',
            noFilter: 'Sin filtro',
            matchAll: 'Coincidir todo',
            matchAny: 'Coincidir alguno',
            addRule: 'Agregar regla',
            removeRule: 'Eliminar regla',
            clear: 'Limpiar',
            apply: 'Aplicar',
        });
    }

    loadHorarioPersonal(): void {
        this.horarioPersonalService
            .getAll(this.configService.getCodigoEmpresa())
            .subscribe({
                next: (data) => {
                    this.horarioPersonalLista = Array.isArray(data) ? data : [];
                    this.generarValoresUnicos();
                },
                error: (err) => {
                    console.error('Error al cargar horarios:', err);
                    this.horarioPersonalLista = [];
                },
            });
    }

    esMotivoInactivo(idMotivo: string): boolean {
        return idMotivo === '02' || idMotivo === '04';
    }

    actualizarHorasSiMotivoInactivo(registro: any): void {
        if (this.esMotivoInactivo(registro.idMotivo)) {
            registro.horaingreso = '00:00';
            registro.horasalida = '00:00';
        }
    }

    formatearHora(hora: string): string {
        const [h, m] = hora.split(':');
        const hh = h.padStart(2, '0');
        const mm = m.padStart(2, '0');
        return `${hh}:${mm}`;
    }

    normalizarHoras(): void {
        this.horarioEmpleado.forEach((item) => {
            item.horaingreso = this.formatearHora(item.horaingreso);
            item.horasalida = this.formatearHora(item.horasalida);
        });
    }

    abrirModalConDatos(horario: horario_personal): void {
        this.displayModal = true;
        let idEmpleado = horario.idEmpleado;

        this.empleadoSeleccionadoDNI = horario.nroDocumento || '';
        this.empleadoSeleccionadoNombreCompleto = `${horario.nombres ?? ''} ${
            horario.apellidos ?? ''
        }`.trim();

        this.horarioPersonalService
            .getHorarioPorEmpleado(idEmpleado)
            .subscribe({
                next: (data) => {
                    this.horarioEmpleado = data;
                    this.normalizarHoras();
                },
                error: (err) => console.error('Error cargando horarios: ', err),
            });

        // cargar motivos también
        this.motivoHorarioService
            .getAll(this.configService.getCodigoEmpresa())
            .subscribe({
                next: (data) => {
                    this.motivos = data;
                },
                error: (err) => console.error('Error cargando motivos: ', err),
            });
    }

    getDatosDia(codigoDia: string): any {
        return this.horarioEmpleado.find((d) => d.dia === codigoDia) ?? {};
    }

    cerrarDialogo(): void {
        this.displayModal = false;
        this.empleadoSeleccionadoDNI = '';
        this.empleadoSeleccionadoNombreCompleto = '';
    }

    formatHora(date: any): string {
        if (typeof date === 'string') return date;
        if (date instanceof Date) {
            const horas = date.getHours().toString().padStart(2, '0');
            const minutos = date.getMinutes().toString().padStart(2, '0');
            return `${horas}:${minutos}`;
        }
        return '00:00';
    }

    convertirHoraAFecha(hora: string | Date): Date | null {
        if (hora instanceof Date) {
            return hora;
        }

        if (typeof hora === 'string' && hora.includes(':')) {
            const [hh, mm] = hora.split(':').map(Number);
            if (!isNaN(hh) && !isNaN(mm)) {
                const fecha = new Date();
                fecha.setHours(hh, mm, 0, 0);
                return fecha;
            }
        }

        return null;
    }

    guardarHorario(): void {
        const motivoPorAsignar = this.motivos.find(
            (m) => m.idMotivo === '00'
        );
        const motivoPorAsignarId = motivoPorAsignar?.idMotivo;

        const tienePorAsignar = this.horarioEmpleado.some(
            (d) => d.idMotivo === motivoPorAsignarId
        );

        if (tienePorAsignar) {
            this.mS.add({
                severity: 'warn',
                summary: 'Motivo inválido',
                detail: 'No se puede guardar un horario con motivo "POR ASIGNAR".',
            });
            return;
        }

        const tieneErrorHorario = this.horarioEmpleado.some((item) => {
            if (this.esMotivoInactivo(item.idMotivo)) return false;

            const ingreso = this.convertirHoraAFecha(item.horaingreso);
            const salida = this.convertirHoraAFecha(item.horasalida);

            if (!ingreso || !salida) return true;

            return ingreso >= salida;
        });

        if (tieneErrorHorario) {
            this.mS.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'La hora de ingreso debe ser menor que la hora de salida',
            });
            return;
        }

        const registros = this.horarioEmpleado.map((d) => ({
            empresaCod: d.empresaCod,
            idEmpleado: d.idEmpleado,
            dia: d.dia,
            idMotivo: d.idMotivo,
            horaingreso: this.formatHora(d.horaingreso),
            horasalida: this.formatHora(d.horasalida),
        }));

        // Ejecutar cada llamada secuencialmente
        let errores = 0;
        const procesar = async () => {
            for (const registro of registros) {
                try {
                    await this.horarioPersonalService
                        .actualizarHorario(registro)
                        .toPromise();
                } catch (error) {
                    errores++;
                    console.error('Error al actualizar un horario:', error);
                }
            }

            if (errores === 0) {
                this.mS.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Todos los horarios fueron actualizados correctamente',
                });
            } else {
                this.mS.add({
                    severity: 'warn',
                    summary: 'Proceso parcial',
                    detail: `${errores} de ${registros.length} registros fallaron al actualizarse`,
                });
            }

            this.displayModal = false;
            this.loadHorarioPersonal();
        };

        procesar();
    }

    cargarCargos() {
        this.asistenciaService
            .getPlanillaCombo()
            .subscribe((cargos: PLanilla_Combo[]) => {
                this.nombreCargos = cargos.map((cargo) => ({
                    label: cargo.nombrePlanilla,
                    value: cargo.nombrePlanilla,
                }));
            });
    }

    cargarMotivos() {
        this.motivoHorarioService
            .getAll(this.configService.getCodigoEmpresa())
            .subscribe({
                next: (data) => {
                    this.nombreMotivos = data.map((motivo) => ({
                        value: motivo.descripcion,
                        label: motivo.descripcion,
                    }));
                },
                error: (err) => console.error('Error cargando motivos: ', err),
            });
    }

    logYFiltrar(selectedValues: any[], filterCallback: Function) {
        filterCallback(selectedValues);
    }

    refrescar(): void {
        if (this.dt) {
            this.dt.clear();
        }
        this.loadHorarioPersonal();
    }

    generarValoresUnicos(): void {
        const columnas = [
            'lunes',
            'martes',
            'miércoles',
            'jueves',
            'viernes',
            'sabado',
            'domingo',
            'nombreCargo',
            'nombreDept',
            'tipoDocumento',
        ];

        columnas.forEach((columna) => {
            const unicos = new Set<string>();
            this.horarioPersonalLista.forEach((fila) => {
                const valor = fila[columna];
                if (valor) {
                    unicos.add(valor.trim());
                }
            });

            this.valoresUnicosPorColumna[columna] = Array.from(unicos).map(
                (val) => ({
                    label: val,
                    value: val,
                })
            );
        });
    }
}
