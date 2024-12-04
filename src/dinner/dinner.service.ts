import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dinner } from './entities/dinner.entity';
import { User } from '../user/entities/user.entity';


@Injectable()
export class DinnerService {

  constructor(
    @InjectRepository(Dinner)
    private readonly dinnerRepository: Repository<Dinner>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.dinnerRepository.find();
  }

  findOne(id: number) {
    return this.dinnerRepository.findOne({ where: { id } });
  }

  async create(userId: number, dinner: Partial<Dinner>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const newDinner = this.dinnerRepository.create({
      ...dinner,
      createdBy: user,
      guests: [user],
      currentGuests: 1,
    });

    return this.dinnerRepository.save(newDinner);
  }

  async joinDinner(dinnerId: number, userId: number) {
    const dinner = await this.dinnerRepository.findOne({
      where: { id: dinnerId },
      relations: ['guests'],
    });
    if (!dinner) {
      throw new NotFoundException('Dinner not found');
    }
    if (dinner.currentGuests >= dinner.maxGuests) {
      throw new BadRequestException('Dinner is full');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Not found');
    }

    if (dinner.guests.some(guest => guest.id === user.id)) {
      throw new BadRequestException('User is already in the dinner');
    }

    dinner.guests.push(user);
    dinner.currentGuests += 1;

    return this.dinnerRepository.save(dinner);
  }

  async leave(dinnerId: number, userId: number) {
    const dinner = await this.dinnerRepository.findOne({
      where: { id: dinnerId },
      relations: ['guests'],
    });

    if (!dinner) {
      throw new BadRequestException('Dinner not found');
    }

    const user = await this.userRepository.findOne({where: {id: userId}})

    if (!user) {
      throw new BadRequestException("Not found")
    }

    const userIndex = dinner.guests.findIndex(guest => guest.id === user.id);

    if (userIndex === -1) {
      throw new BadRequestException('User is not a guest of this dinner');
    }

    dinner.guests.splice(userIndex, 1); 
    dinner.currentGuests -= 1;

    return this.dinnerRepository.save(dinner);
  }

  update(id: number, dinner: Partial<Dinner>) {
    return this.dinnerRepository.update(id, dinner);
  }

  delete(id: number) {
    return this.dinnerRepository.delete(id);
  }
}