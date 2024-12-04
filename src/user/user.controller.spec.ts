import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findAll: jest.fn(() => Promise.resolve([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }])),
    findOne: jest.fn((id: number) =>
      Promise.resolve({ id, name: 'John Doe', email: 'john.doe@example.com' }),
    ),
    create: jest.fn((user: Partial<User>) =>
      Promise.resolve({ id: 1, ...user }),
    ),
    update: jest.fn((id: number, user: Partial<User>) =>
      Promise.resolve({ id, ...user }),
    ),
    delete: jest.fn((id: number) => Promise.resolve({ success: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: Partial<User> = { name: 'Jane Doe', email: 'jane.doe@example.com' };
      const result = await controller.create(user);
      expect(result).toEqual({ id: 1, ...user });
      expect(service.create).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const user: Partial<User> = { name: 'Updated Name' };
      const result = await controller.update(1, user);
      expect(result).toEqual({ id: 1, ...user });
      expect(service.update).toHaveBeenCalledWith(1, user);
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual({ success: true });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});