import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HijosMayoresComponent } from './hijos-mayores.component';

describe('HijosMayoresComponent', () => {
  let component: HijosMayoresComponent;
  let fixture: ComponentFixture<HijosMayoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HijosMayoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HijosMayoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
