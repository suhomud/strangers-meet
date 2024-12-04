import { Test, TestingModule } from '@nestjs/testing';
import { DinnerService } from './dinner.service';

describe('DinnerService', () => {
  let service: DinnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DinnerService],
    }).compile();

    service = module.get<DinnerService>(DinnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
