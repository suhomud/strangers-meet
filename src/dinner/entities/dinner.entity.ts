import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Dinner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  location: string;

  @Column({ type: 'int', default: 0 })
  maxGuests: number;

  @Column({ type: 'int', default: 0 })
  currentGuests: number;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  guests: User[];

  @ManyToOne(() => User, { eager: true })
  createdBy: User;
}