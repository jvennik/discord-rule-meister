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

  @Column({ type: 'varchar', name: 'message_id', nullable: true})
  public message_id: string;

  @Column({ type: 'varchar', name: 'grant_role', nullable: true })
  public grant_role: string;

  valid() {
    const values = [this.channel, this.message, this.grant_role];
    const validated = values.every(function(item) { 
      switch(item) {
        case null:
          return false;
        case '':
          return false;
        case undefined:
          return false;
        default:
          return true;
      }
     });
    return validated;
  }

  constructor(init?: Partial<Settings>) {
    Object.assign(this, init);
  }
}