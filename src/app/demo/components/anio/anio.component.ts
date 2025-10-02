import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAnioService } from '../../service/m-anio.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { m_anio } from '../../model/M_Anio';
import { BreadcrumbService } from '../../service/breadcrumb.service';

@Component({
  selector: 'app-anio',
  standalone: true,
  imports: [ToastModule,TableModule,ReactiveFormsModule,CommonModule,ButtonModule,CardModule,InputTextModule,PanelModule,BreadcrumbModule,ConfirmDialogModule,FormsModule],
  templateUrl: './anio.component.html',
  styleUrl: './anio.component.scss',
  providers:[MessageService,ConfirmationService]
})
export class AnioComponent implements OnInit {
    mAnioForm:FormGroup;
    mAnioList:m_anio[]=[];
    isEditing:boolean = false;
    editingRowIndex:number|null = null;
    editingAnio: m_anio | null = null;
    editingRows: { [s: string]: boolean } = {};
    editingData:any={};
    displayDialog:boolean = false;
    isNew:boolean = false;
    clonedAnios:{[s:string]:m_anio}={}
    items:any[] = [];
    isEditingAnyRow: boolean = false;

    constructor(private fb:FormBuilder,private maS:MAnioService,private mS:MessageService,private  confirmationsService:ConfirmationService,private bS:BreadcrumbService){}
    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home',routerLink: '/Menu' },
            { label: 'Manteniemiento Años', routerLink: '/Menu/anio' }
        ]);
        this.bS.currentBreadcrumbs$.subscribe(bc=>{
            this.items=bc;
        })
        this.initForm()
        this.loadMAnio()
    }

    initForm(){
        this.mAnioForm=this.fb.group({
            pla61Codigo: ['', Validators.required],
            pla61Descripcion: ['', Validators.required]
        });
    }
    loadMAnio(): void{
        this.maS.getAll()
          .subscribe({
            next: (data) => this.mAnioList = data,
          });
    }

    onRowEditInit(m_anio:m_anio) {
        this.editingAnio={...m_anio}
        this.isEditingAnyRow=true;
    }
    onRowEditSave(anio: m_anio) {
        if (this.editingAnio) {
          this.maS.update(anio.pla61Codigo, anio).subscribe({
            next: () => {
              this.editingAnio = null;
              this.isEditingAnyRow = false;
              this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro actualizado' });
            },
            error: () => {
              this.mS.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar' });
            }
          });
        }
    }

    onRowEditCancel(anio: m_anio, index: number) {
        if (this.editingAnio) {
          this.mAnioList[index] = { ...this.editingAnio };
          this.editingAnio = null;
          this.isEditingAnyRow = false;
          this.loadMAnio()
        }
    }


    showAddRow() {
        this.isEditing = true;
        this.isNew=true;
        this.mAnioForm.reset();
    }

    onSave() {
        if (this.mAnioForm.valid) {
            const newAnio: m_anio = this.mAnioForm.value;
            this.maS.create(newAnio).subscribe({
                next: () => {
                    this.isEditing = false;
                    this.isNew=false;
                    this.mAnioForm.reset();
                    this.mS.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado' });
                    this.loadMAnio();
                },
                error: (err) => {
                    console.error('Error al guardar:', err);
                    this.mS.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el registro' });
                },
            });
        }
    }

    onCancel() {
        this.isEditing = false;
        this.isNew=false;
        this.mAnioForm.reset();
    }


    onDelete(anio: m_anio, index: number) {
        this.confirmationsService.confirm({
            message: `¿Está seguro que desea eliminar el año <b>${anio.pla61Descripcion}</b>?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'No, cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button',
          accept: () => {
            this.maS.delete(anio.pla61Codigo).subscribe({
              next: () => {
                this.mAnioList.splice(index, 1);
                this.mS.add({
                  severity: 'success',
                  summary: 'Éxito',
                  detail: 'Registro eliminado'
                });
              }
            });
          }
        });
    }
}
