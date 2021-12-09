import { TestBed } from '@angular/core/testing';

import { SmsListService } from './sms-list.service';

describe('SmsListService', () => {
  let service: SmsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
