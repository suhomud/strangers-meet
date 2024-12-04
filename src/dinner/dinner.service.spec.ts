import { Test, TestingModule } from '@nestjs/testing';
import { DinnerService } from './dinner.service';
import { Dinner } from './entities/dinner.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DinnerService', () => {
  let service: DinnerService;
  let dinnerRepository: Repository<Dinner>;
  let userRepository: Repository<User>;

  const mockDinnerRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DinnerService,
        {
          provide: getRepositoryToken(Dinner),
          useValue: mockDinnerRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<DinnerService>(DinnerService);
    dinnerRepository = module.get<Repository<Dinner>>(getRepositoryToken(Dinner));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a dinner and return it', async () => {
      const user = { id: 1, name: 'Test User' } as User;
      const dinnerData: Partial<Dinner> = {
        title: 'Test Dinner',
        description: 'A test dinner description',
        maxGuests: 5,
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      mockDinnerRepository.create.mockReturnValue({ ...dinnerData, createdBy: user, guests: [user], currentGuests: 1 });
      mockDinnerRepository.save.mockResolvedValue({ id: 1, ...dinnerData, createdBy: user, guests: [user], currentGuests: 1 });

      const result = await service.create(1, dinnerData);

      expect(result).toEqual({
        id: 1,
        ...dinnerData,
        createdBy: user,
        guests: [user],
        currentGuests: 1,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dinnerRepository.create).toHaveBeenCalledWith({
        ...dinnerData,
        createdBy: user,
        guests: [user],
        currentGuests: 1,
      });
      expect(dinnerRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(1, {} as Partial<Dinner>)).rejects.toThrow(NotFoundException);
    });
  });

  describe('joinDinner', () => {
    it('should allow a user to join a dinner', async () => {
      const dinner = { id: 1, guests: [], currentGuests: 0, maxGuests: 5 } as Dinner;
      const user = { id: 2, name: 'Test User' } as User;

      mockDinnerRepository.findOne.mockResolvedValue(dinner);
      mockUserRepository.findOne.mockResolvedValue(user);
      mockDinnerRepository.save.mockResolvedValue({ ...dinner, guests: [user], currentGuests: 1 });

      const result = await service.joinDinner(1, 2);

      expect(result).toEqual({ ...dinner, guests: [user], currentGuests: 1 });
      expect(dinnerRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['guests'] });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(dinnerRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if dinner is not found', async () => {
      mockDinnerRepository.findOne.mockResolvedValue(null);

      await expect(service.joinDinner(1, 2)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if the dinner is full', async () => {
      const dinner = { id: 1, guests: [], currentGuests: 5, maxGuests: 5 } as Dinner;

      mockDinnerRepository.findOne.mockResolvedValue(dinner);

      await expect(service.joinDinner(1, 2)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if the user is already in the dinner', async () => {
      const dinner = { id: 1, guests: [{ id: 2 }], currentGuests: 1, maxGuests: 5 } as Dinner;

      mockDinnerRepository.findOne.mockResolvedValue(dinner);

      await expect(service.joinDinner(1, 2)).rejects.toThrow(BadRequestException);
    });
  });

  describe('leaveDinner', () => {
    it('should allow a user to leave a dinner', async () => {
      const dinner = { id: 1, guests: [{ id: 2 }], currentGuests: 1 } as Dinner;
      const user = { id: 2 } as User;

      mockDinnerRepository.findOne.mockResolvedValue(dinner);
      mockUserRepository.findOne.mockResolvedValue(user);
      mockDinnerRepository.save.mockResolvedValue({ ...dinner, guests: [], currentGuests: 0 });

      const result = await service.leave(1, 2);

      expect(result).toEqual({ ...dinner, guests: [], currentGuests: 0 });
      expect(dinnerRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['guests'] });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(dinnerRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if dinner is not found', async () => {
      mockDinnerRepository.findOne.mockResolvedValue(null);

      await expect(service.leave(1, 2)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user is not found', async () => {
      const dinner = { id: 1, guests: [{ id: 3 }] } as Dinner;

      mockDinnerRepository.findOne.mockResolvedValue(dinner);
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.leave(1, 2)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user is not a guest', async () => {
      const dinner = { id: 1, guests: [{ id: 3 }] } as Dinner;
      const user = { id: 2 } as User;

      mockDinnerRepository.findOne.mockResolvedValue(dinner);
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.leave(1, 2)).rejects.toThrow(BadRequestException);
    });
  });
});