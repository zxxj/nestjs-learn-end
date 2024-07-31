import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Logs, (logs) => logs.user)
  logs?: Logs[];

  @ManyToMany(() => Roles, (roles) => roles.user)
  roles?: Roles[];

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;
}
