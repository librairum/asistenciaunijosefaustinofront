import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { motivo_horario } from '../../model/motivo_horario';
import { MotivoHorarioService } from '../../service/motivo-horario.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfigService } from '../../service/config.service';

@Component({
    selector: 'app-motivo-horario',
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
        CheckboxModule
    ],
    standalone: true,
    templateUrl: './motivo-horario.component.html',
    styleUrl: './motivo-horario.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class MotivoHorarioComponent implements OnInit {
    motivoHorarioForm: FormGroup;
    motivoHorarioLista: motivo_horario[] = [];
    isEditing: boolean = false;
    editingRowIndex: number | null = null;
    editingMotivoHorario: motivo_horario | null = null;
    editingRows: { [s: string]: boolean } = {};
    editingData: any = {};
    displayDialog: boolean = false;
    isNew: boolean = false;
    items: any[] = [];
    isEditingAnyRow: boolean = false;

    constructor(
        private fb: FormBuilder,
        private motivoHorarioSerice: MotivoHorarioService,
        private mS: MessageService,
        private confirmationService: ConfirmationService,
        private bS: BreadcrumbService,
        private configService: ConfigService
    ) {}

    ngOnInit(): void {
        this.bS.setBreadcrumbs([
            { icon: 'pi pi-home', routerLink: '/Menu' },
            { label: 'Motivo Horario', routerLink: '/Menu/motivohorario' },
        ]);
        this.bS.currentBreadcrumbs$.subscribe((bc) => {
            this.items = bc;
        });
        this.initForm();
        this.loadMotivoHorario();
    }

    initForm(): void {
        this.motivoHorarioForm = this.fb.group({
            idMotivo: ['', Validators.required],
            descripcion: ['', Validators.required],
            flagCalculaTiempo: [false]
        });
    }

    loadMotivoHorario(): void {
        this.motivoHorarioSerice.getAll(this.configService.getCodigoEmpresa()).subscribe({
            next: (data) => (this.motivoHorarioLista = data),
        });
    }

    onRowEditInit(motivoHorario: motivo_horario) {
        this.editingMotivoHorario = { ...motivoHorario };
        this.isEditingAnyRow = true;

        motivoHorario.flagCalculaTiempo = motivoHorario.flagCalculaTiempo === 'S';
    }

    onRowEditSave(motivoHorario: motivo_horario) {

        motivoHorario.empresaCod = this.configService.getCodigoEmpresa();

        motivoHorario.flagCalculaTiempo = motivoHorario.flagCalculaTiempo ? 'S' : 'N';

        if (this.editingMotivoHorario) {
            this.motivoHorarioSerice.update(motivoHorario).subscribe({
                next: () => {
                    this.editingMotivoHorario = null;
                    this.isEditingAnyRow = false;
                    this.mS.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Registro actualizado',
                    });
                    this.loadMotivoHorario();
                },
                error: (err) => {
                    console.error(err)
                    this.mS.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar',
                    });
                },
            });
        }
    }

    onRowEditCancel(motivo: motivo_horario, index: number) {
        if (this.editingMotivoHorario) {
            this.motivoHorarioLista[index] = { ...this.editingMotivoHorario };
            this.editingMotivoHorario = null;
            this.isEditingAnyRow = false;
            this.loadMotivoHorario();
        }
    }

    showAddRow() {
        this.isEditing = true;
        this.isNew = true;
        this.motivoHorarioForm.reset();
    }

    onSave() {
        if (this.motivoHorarioForm.valid) {
            const raw = this.motivoHorarioForm.value;
            const motivoHorario: motivo_horario = {
                empresaCod: this.configService.getCodigoEmpresa(),
                idMotivo: raw.idMotivo,
                descripcion: raw.descripcion,
                flagCalculaTiempo: raw.flagCalculaTiempo ? 'S' : 'N',
            };

            this.motivoHorarioSerice.create(motivoHorario).subscribe({
                next: () => {
                    this.isEditing = false;
                    this.isNew = false;
                    this.motivoHorarioForm.reset();
                    this.mS.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Registro guardado',
                    });
                    this.loadMotivoHorario();
                },
                error: (err) => {
                    console.error('Error al guardar:', err);
                    this.mS.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo guardar el registro',
                    });
                },
            });
        }
    }

    onDelete(motivo: any, rowIndex: number) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el motivo "${motivo.descripcion}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const empresaCod = this.configService.getCodigoEmpresa();
                this.motivoHorarioSerice
                    .delete(empresaCod, motivo.idMotivo)
                    .subscribe({
                        next: () => {
                            this.mS.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: 'Registro eliminado correctamente',
                            });
                            this.loadMotivoHorario();
                        },
                        error: (err) => {
                            console.error('Error al eliminar:', err);
                            this.mS.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'No se pudo eliminar el registro',
                            });
                        },
                    });
            },
        });
    }

    onCancel() {
        this.isEditing = false;
        this.isNew = false;
        this.motivoHorarioForm.reset();
    }
}
