import { TestBed } from '@angular/core/testing';

import { IplService } from './ipl.service';

describe('IplService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IplService = TestBed.get(IplService);
    expect(service).toBeTruthy();
  });
});
