import { Test, TestingModule } from '@nestjs/testing';
import { DinnerController } from './dinner.controller';
import { DinnerService } from './dinner.service';
import { Dinner } from './entities/dinner.entity';

describe('DinnerController', () => {
  let controller: DinnerController;
  let service: DinnerService;

  // Mock DinnerService
  const mockDinnerService = {
    findAll: jest.fn(() => Promise.resolve([{ id: 1, title: 'Test Dinner' }])),
    findOne: jest.fn((id: number) =>
      Promise.resolve({ id, title: 'Test Dinner' }),
    ),
    create: jest.fn((userId: number, dinnerData: Partial<Dinner>) =>
      Promise.resolve({
        id: 1,
        ...dinnerData,
        createdBy: { id: userId, name: 'Test User' },
        guests: [{ id: userId, name: 'Test User' }],
      }),
    ),
    joinDinner: jest.fn((dinnerId: number, userId: number) =>
      Promise.resolve({
        id: dinnerId,
        title: 'Test Dinner',
        guests: [{ id: userId, name: 'Test User' }],
        currentGuests: 1,
      }),
    ),
    leave: jest.fn((dinnerId: number, userId: number) =>
      Promise.resolve({
        id: dinnerId,
        title: 'Test Dinner',
        guests: [],
        currentGuests: 0,
      }),
    ),
    delete: jest.fn((id: number) => Promise.resolve({ success: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DinnerController],
      providers: [
        {
          provide: DinnerService,
          useValue: mockDinnerService,
        },
      ],
    }).compile();

    controller = module.get<DinnerController>(DinnerController);
    service = module.get<DinnerService>(DinnerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of dinners', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 1, title: 'Test Dinner' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single dinner by ID', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({ id: 1, title: 'Test Dinner' });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new dinner and return it', async () => {
      const userId = 1;
      const dinnerData: Partial<Dinner> = {
        title: 'Test Dinner',
        description: 'A test dinner description',
        maxGuests: 5,
      };
      const result = await controller.create(userId, dinnerData);
      expect(result).toEqual({
        id: 1,
        ...dinnerData,
        createdBy: { id: userId, name: 'Test User' },
        guests: [{ id: userId, name: 'Test User' }],
      });
      expect(service.create).toHaveBeenCalledWith(userId, dinnerData);
    });
  });

  describe('join', () => {
    it('should allow a user to join a dinner', async () => {
      const dinnerId = 1;
      const userId = 2;
      const result = await controller.join(dinnerId, userId);
      expect(result).toEqual({
        id: dinnerId,
        title: 'Test Dinner',
        guests: [{ id: userId, name: 'Test User' }],
        currentGuests: 1,
      });
      expect(service.joinDinner).toHaveBeenCalledWith(dinnerId, userId);
    });
  });

  describe('leave', () => {
    it('should allow a user to leave a dinner', async () => {
      const dinnerId = 1;
      const userId = 2;
      const result = await controller.leave(dinnerId, userId);
      expect(result).toEqual({
        id: dinnerId,
        title: 'Test Dinner',
        guests: [],
        currentGuests: 0,
      });
      expect(service.leave).toHaveBeenCalledWith(dinnerId, userId);
    });
  });

  describe('delete', () => {
    it('should delete a dinner by ID', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual({ success: true });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});