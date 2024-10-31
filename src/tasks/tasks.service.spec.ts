import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TasksService } from './task.service';
import { Task } from './entities/task.entity';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Repository, DataSource } from 'typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let tasksRepository: Repository<Task>;
  let notificationsQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getQueueToken('notifications'),
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              release: jest.fn(),
              query: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    notificationsQueue = module.get<Queue>(getQueueToken('notifications'));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova tarefa', async () => {
      const title = 'Test Task';
      const description = 'Test Description';
      const email = 'teste@hotmail.com';

      const task = { id: 1, title, description, email, isCompleted: false };

      jest.spyOn(tasksRepository, 'create').mockReturnValue(task as any);
      jest.spyOn(tasksRepository, 'save').mockResolvedValue(task as any);

      const result = await service.create(title, description, email);

      expect(tasksRepository.create).toHaveBeenCalledWith({ title, description, email });
      expect(tasksRepository.save).toHaveBeenCalledWith(task);
      expect(result).toEqual(task);
    });
  });

  describe('list', () => {
    it('deve retornar a lista de tarefas', async () => {
      const tasks = [{ id: 1, title: 'Test Task', description: 'Test Description', isCompleted: false }];
      jest.spyOn(tasksRepository, 'find').mockResolvedValue(tasks as any);

      const result = await service.list();

      expect(tasksRepository.find).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('markAsCompleted', () => {
    it('deve marcar a tarefa como completa e enviar uma notificação', async () => {
      const task = { id: 1, title: 'Test Task', description: 'Test Description', isCompleted: false, email: 'teste@hotmail.com' };
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(task as any);
      jest.spyOn(tasksRepository, 'save').mockResolvedValue({ ...task, isCompleted: true } as any);
      jest.spyOn(notificationsQueue, 'add').mockResolvedValue(undefined as any);

      await service.markAsCompleted(1);

      expect(tasksRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(tasksRepository.save).toHaveBeenCalledWith({ ...task, isCompleted: true });
      expect(notificationsQueue.add).toHaveBeenCalledWith('send-notification', {
        taskId: task.id,
        email: task.email
      });
    });
  });

  describe('delete', () => {
    it('deve deletar uma tarefa', async () => {
      jest.spyOn(tasksRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.delete(1);

      expect(tasksRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
