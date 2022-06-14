import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosSuspendidosComponent } from './pagos-suspendidos.component';

describe('PagosSuspendidosComponent', () => {
  let component: PagosSuspendidosComponent;
  let fixture: ComponentFixture<PagosSuspendidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosSuspendidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosSuspendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
