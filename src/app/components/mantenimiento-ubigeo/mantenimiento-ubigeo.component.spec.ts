import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoUbigeoComponent } from './mantenimiento-ubigeo.component';

describe('MantenimientoUbigeoComponent', () => {
  let component: MantenimientoUbigeoComponent;
  let fixture: ComponentFixture<MantenimientoUbigeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoUbigeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoUbigeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
