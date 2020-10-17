import { PrimaryGeneratedColumn, Entity, Column } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public guild: string;

  @Column({ type: 'varchar', name: 'channel', nullable: true })
  public channel: string;

  @Column({ type: 'varchar', name: 'message', nullable: true })
  public message: string;

  @Column({ type: 'varchar', name: 'initial_role', nullable: true })
  public initial_role: string;

  @Column({ type: 'varchar', name: 'grant_role', nullable: true })
  public grant_role: string;

  valid() {
    const values = [this.channel, this.message, this.initial_role, this.grant_role];
    const validated = values.every(function(item) { return item !== '' });
    return validated;
  }

  constructor(init?: Partial<Settings>) {
    Object.assign(this, init);
  }
}