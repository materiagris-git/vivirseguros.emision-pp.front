import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorreosInicioPolizaComponent } from './correos-inicio-poliza.component';

describe('CorreosInicioPolizaComponent', () => {
  let component: CorreosInicioPolizaComponent;
  let fixture: ComponentFixture<CorreosInicioPolizaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorreosInicioPolizaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorreosInicioPolizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
