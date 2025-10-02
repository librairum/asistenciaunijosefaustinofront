import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoHorarioComponent } from './motivo-horario.component';

describe('MotivoHorarioComponent', () => {
  let component: MotivoHorarioComponent;
  let fixture: ComponentFixture<MotivoHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotivoHorarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotivoHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
