import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role_name: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({ name: 'user_roles' })
  user: User[];
}
