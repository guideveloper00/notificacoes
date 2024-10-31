## Certifique-se de ter o seguinte instalado

Docker
Docker Compose
Node.js (v14 ou superior)
npm ou yarn

## Comando para clonar o repositorio

git clone https://github.com/guideveloper00/notificacoes.git
cd sistema-notificacoes

## Comando para instalar dependencias

npm install ou yarn install

## Variaveis de ambiente

SMTP_HOST=bulk.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASS=b0a2c514bf5aed0acadc46d1d41749ff
SMTP_FROM=no-reply@myapp.com
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASS=2035
DB_NAME=notificacoes
REDIS_HOST=redis
REDIS_PORT=6379
PORT=3000

## Comando para rodar o container

docker-compose up -d

## Rotas

POST /tasks: Cria uma nova tarefa.
GET /tasks: Lista todas as tarefas.
PUT /tasks/:id: Marca uma tarefa como concluída.
DELETE /tasks/:id: Exclui uma tarefa.

## API Teste

Insomnia

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```