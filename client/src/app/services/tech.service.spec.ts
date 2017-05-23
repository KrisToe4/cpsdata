import { TestBed, inject } from '@angular/core/testing';

import { TechService } from '@services/tech.service';

describe('TechService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechService]
    });
  });

  it('should ...', inject([TechService], (service: TechService) => {
    expect(service).toBeTruthy();
  }));
});
