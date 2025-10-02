import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariopersonalComponent } from './horariopersonal.component';

describe('HorariopersonalComponent', () => {
  let component: HorariopersonalComponent;
  let fixture: ComponentFixture<HorariopersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariopersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorariopersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
