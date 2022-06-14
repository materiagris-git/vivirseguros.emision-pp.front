import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaIndicadoresComponent } from './consulta-indicadores.component';

describe('ConsultaIndicadoresComponent', () => {
  let component: ConsultaIndicadoresComponent;
  let fixture: ComponentFixture<ConsultaIndicadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaIndicadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
