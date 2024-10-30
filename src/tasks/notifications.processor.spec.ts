import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsProcessor } from './notifications.processor';
import { Job } from 'bull';

describe('NotificationsProcessor', () => {
  let processor: NotificationsProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsProcessor],
    }).compile();

    processor = module.get<NotificationsProcessor>(NotificationsProcessor);
  });

  it('deve processar a notificação e imprimir no console', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const job: Job = {
      data: {
        taskId: 1,
        email: 'user@example.com',
      },
    } as any;

    await processor.handleNotification(job);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Notificação de tarefa 1 enviada para o e-mail: user@example.com',
    );
  });
});
