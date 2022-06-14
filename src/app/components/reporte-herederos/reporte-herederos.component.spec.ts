import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteHerederosComponent } from './reporte-herederos.component';

describe('ReporteHerederosComponent', () => {
  let component: ReporteHerederosComponent;
  let fixture: ComponentFixture<ReporteHerederosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteHerederosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteHerederosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
