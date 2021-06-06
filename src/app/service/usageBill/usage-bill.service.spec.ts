import { TestBed } from '@angular/core/testing';

import { UsageBillService } from './usage-bill.service';

describe('UsageBillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsageBillService = TestBed.get(UsageBillService);
    expect(service).toBeTruthy();
  });
});
