import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dinner } from './entities/dinner.entity';

@Injectable()
export class DinnerService {
  constructor(
    @InjectRepository(Dinner)
    private readonly dinnerRepository: Repository<Dinner>,
  ) {}

  findAll() {
    return this.dinnerRepository.find();
  }

  findOne(id: number) {
    return this.dinnerRepository.findOne({ where: { id } });
  }

  create(dinner: Partial<Dinner>) {
    const newDinner = this.dinnerRepository.create(dinner);
    return this.dinnerRepository.save(newDinner);
  }

  update(id: number, dinner: Partial<Dinner>) {
    return this.dinnerRepository.update(id, dinner);
  }

  delete(id: number) {
    return this.dinnerRepository.delete(id);
  }
}