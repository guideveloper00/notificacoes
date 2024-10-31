import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    
    @InjectQueue('notifications')
    private notificationsQueue: Queue,

    private dataSource: DataSource
  ) {}

  async onModuleInit() {
    await this.createTrigger();
  }

  async createTrigger() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const tableExists = await queryRunner.hasTable('tasks');
      if (tableExists) {
        await queryRunner.query(`
          DELIMITER //

          CREATE TRIGGER date_trigger
          BEFORE UPDATE ON tasks
          FOR EACH ROW
          BEGIN
            IF DATEDIFF(CURDATE(), NEW.created_at) > 7 THEN
              SET NEW.status = 'vencido';
            END IF;
          END //

          DELIMITER ;
        `);
        console.log('Trigger `date_trigger` criada com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao criar a trigger:', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async create(title: string, description: string, email: string): Promise<Task> {
    const task = this.tasksRepository.create({ title, description, email });
    return this.tasksRepository.save(task);
  }

  async list(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async markAsCompleted(id: number): Promise<void> {
    const task = await this.tasksRepository.findOne({ where: { id } });
  
    if (!task) {
      throw new Error('Tarefa não encontrada');
    }
  
    task.isCompleted = true;
    await this.tasksRepository.save(task);
  
    await this.notificationsQueue.add('send-notification', {
      email: task.email,
      taskId: task.id,
    });

    return;
  }

  async delete(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
