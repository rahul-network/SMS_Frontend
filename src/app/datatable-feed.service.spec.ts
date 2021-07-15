import { TestBed } from '@angular/core/testing';

import { DatatableFeedService } from './datatable-feed.service';

describe('DatatableFeedService', () => {
  let service: DatatableFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatatableFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
