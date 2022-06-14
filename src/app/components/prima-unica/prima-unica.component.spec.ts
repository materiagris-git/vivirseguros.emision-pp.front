import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaUnicaComponent } from './prima-unica.component';

describe('PrimaUnicaComponent', () => {
  let component: PrimaUnicaComponent;
  let fixture: ComponentFixture<PrimaUnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimaUnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaUnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
