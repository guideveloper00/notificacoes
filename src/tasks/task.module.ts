import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Task } from './entities/task.entity';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { NotificationsProcessor } from './notifications.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, NotificationsProcessor],
})
export class TasksModule {}
