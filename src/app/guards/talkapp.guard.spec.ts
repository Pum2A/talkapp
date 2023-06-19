import { TestBed } from '@angular/core/testing';

import { TalkappGuard } from './talkapp.guard';

describe('TalkappGuard', () => {
  let guard: TalkappGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TalkappGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
