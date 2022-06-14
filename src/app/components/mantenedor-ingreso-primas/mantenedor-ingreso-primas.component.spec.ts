import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorIngresoPrimasComponent } from './mantenedor-ingreso-primas.component';

describe('MantenedorIngresoPrimasComponent', () => {
  let component: MantenedorIngresoPrimasComponent;
  let fixture: ComponentFixture<MantenedorIngresoPrimasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenedorIngresoPrimasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenedorIngresoPrimasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
