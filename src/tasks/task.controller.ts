import { Body, Controller, Get, Post, Put, Param, Delete } from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto.title, createTaskDto.description, createTaskDto.email);
  }

  @Get()
  async list() {
    return this.tasksService.list();
  }

  @Put(':id')
  async markAsCompleted(@Param('id') id: number) {
    await this.tasksService.markAsCompleted(id);
    return { message: 'Tarefa marcada como concluída' };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.tasksService.delete(id);
  }
}
