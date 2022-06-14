import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosPagosRecurrentesComponent } from './parametros-pagos-recurrentes.component';

describe('ParametrosPagosRecurrentesComponent', () => {
  let component: ParametrosPagosRecurrentesComponent;
  let fixture: ComponentFixture<ParametrosPagosRecurrentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosPagosRecurrentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosPagosRecurrentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
