import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(title: string, description: string): Promise<Task> {
    const task = this.tasksRepository.create({ title, description });
    return this.tasksRepository.save(task);
  }

  async list(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async markAsCompleted(id: number): Promise<void> {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (task) {
      task.isCompleted = true;
      await this.tasksRepository.save(task);

      await this.notificationsQueue.add('send-notification', {
        taskId: task.id,
        email: 'user@example.com',
      });
    }
  }

  async delete(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
