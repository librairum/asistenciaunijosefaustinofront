import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, of, startWith, timer } from 'rxjs';
import { Marcaciones } from '../../model/Marcaciones';
import { MarcacionesService } from '../../service/marcaciones.service';
import { MessageService, SelectItem } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ColumnFilter, TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
  selector: 'app-consulta-marcaciones',
  standalone: true,
  imports: [PanelModule,TableModule,FormsModule,ReactiveFormsModule,
    DropdownModule,CalendarModule,CommonModule,BreadcrumbModule,InputTextModule,
    MultiSelectModule],
  templateUrl: './consulta-marcaciones.component.html',
  styleUrl: './consulta-marcaciones.component.scss',
  providers:[MessageService,ColumnFilter]
})
export class ConsultaMarcacionesComponent implements OnInit {
    marcaciones:Marcaciones[]=[];
    marcacionesoriginal:Marcaciones[] = [];
    columnas:any[] = [];
    loading:boolean = false;
    searchForm: FormGroup;

    columnsGlobalFilterFields = ['Fecha', 'Hora', 'NroDocumento', 'NombresYApellidos', 'NombreSedeEquipo', 'NombreSedeTrabajador', 'CodigoEquipo', 'NombreEquipo'];
    items:any[] = [];

    //combos
    equipos:SelectItem[] = [];
    sedesEquipos:SelectItem[] = [];
    sedesTrabajador:SelectItem[] = [];

    constructor(private mS:MarcacionesService,private bS:BreadcrumbService,private fb:FormBuilder,private messageService: MessageService){}
    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home',routerLink: '/Menu' },
            { label: 'Marcaciones', routerLink: '/Menu/marcaciones' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc=>{
            this.items=bc;
        })
        this.marcacionesoriginal=[...this.marcaciones];
        this.Columnas();
        this.cargarMarcaciones();

        //Formulario
        this.searchForm=this.fb.group({
            nombreSedeEquipo: [''],
            nombreEquipo: [''],
            nombreSedeTrabajador: [''],
            fechaInicio: [null],
            fechaFin: [null],
        });
    }
    cargarMarcaciones(): void {
        this.loading = true;
        this.mS.getMarcaciones().subscribe({
            next: (data) => {
                this.marcacionesoriginal = [...data];
                this.marcaciones = data;

                // Format dropdown options
                this.equipos = [...new Set(data.map(m => m.NombreEquipo))]
                    .map(equipo => ({ label: equipo, value: equipo }));
                this.sedesEquipos = [...new Set(data.map(m => m.NombreSedeEquipo))]
                    .map(sede => ({ label: sede, value: sede }));
                this.sedesTrabajador = [...new Set(data.map(m => m.NombreSedeTrabajador))]
                    .map(sede => ({ label: sede, value: sede }));
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las marcaciones'
                });
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
    Columnas():void{
        this.columnas=[
            { field: 'Fecha', header: 'Fecha' },
            { field: 'Hora', header: 'Hora' },
            { field: 'NroDocumento', header: 'NroDoc' },
            { field: 'NombresYApellidos', header: 'Nombres y apellidos' },
            { field: 'NombreSedeEquipo', header: 'Sede Equipo' },
            { field: 'NombreSedeTrabajador', header: 'Sede Trabajador' },
            { field: 'CodigoEquipo', header: 'Equipo Cod' },
            { field: 'NombreEquipo', header: 'Equipo Nombre' }

        ];
    }
    buscarConParametros():void{

        const { nombreSedeEquipo, nombreEquipo, nombreSedeTrabajador, fechaInicio, fechaFin } =
        this.searchForm.value;
        this.loading = true;
        this.mS.getMarcacionesParametros(nombreSedeEquipo, nombreEquipo, nombreSedeTrabajador, fechaInicio, fechaFin).subscribe(
        (data) => {
            this.marcaciones = data;
            this.loading = false;
        },
        (error) => {
            console.error('Error en la búsqueda avanzada', error);
            this.loading = false;
        }
        );
    }
}
