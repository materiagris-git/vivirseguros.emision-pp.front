import { TestBed } from '@angular/core/testing';

import { TraspasoPolizaService } from './traspaso-poliza.service';

describe('TraspasoPolizaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraspasoPolizaService = TestBed.get(TraspasoPolizaService);
    expect(service).toBeTruthy();
  });
});
