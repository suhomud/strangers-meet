import { Test, TestingModule } from '@nestjs/testing';
import { DinnerController } from './dinner.controller';

describe('DinnerController', () => {
  let controller: DinnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DinnerController],
    }).compile();

    controller = module.get<DinnerController>(DinnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
