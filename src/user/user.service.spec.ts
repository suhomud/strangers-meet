import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockRepository = {
    find: jest.fn(() => Promise.resolve([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }])),
    findOne: jest.fn((options) => Promise.resolve({ id: options.where.id, name: 'John Doe', email: 'john.doe@example.com' })),
    create: jest.fn((user: Partial<User>) => user),
    save: jest.fn((user: Partial<User>) => Promise.resolve({ id: 1, ...user })),
    update: jest.fn((id: number, user: Partial<User>) => Promise.resolve({ id, ...user })),
    delete: jest.fn(() => Promise.resolve({ success: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user: Partial<User> = { name: 'Jane Doe', email: 'jane.doe@example.com' };
      const result = await service.create(user);
      expect(result).toEqual({ id: 1, ...user });
      expect(repository.create).toHaveBeenCalledWith(user);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const user: Partial<User> = { name: 'Updated Name' };
      const result = await service.update(1, user);
      expect(result).toEqual({ id: 1, ...user });
      expect(repository.update).toHaveBeenCalledWith(1, user);
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const result = await service.delete(1);
      expect(result).toEqual({ success: true });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});