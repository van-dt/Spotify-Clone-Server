<!-- PROJECT LOGO -->
<br />
<div align="center">
  <p align="center">
    <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  </p>

  <h3 align="center">Spotify-clone-API-V1</h3>

  <p align="center">
    Project Backend
    <br />
    <br />
    <a href="https://github.com/spin-online/spin-online-api/tree/master/src/modules/example">View Demo CRUD</a>
    ·
    <a href="https://github.com/spin-online/spin-online-api/blob/master/.github/pull_request_template.md">Pull Request Template</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#running">Running</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Name `Spin Online`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

Frameworks/libraries used to project

- [![Node][Nodejs.org]][Node-url]
- [![Expressjs][Expressjs.com]][Expressjs-url]
- [![Nestjs][Nestjs.com]][Nestjs-url]
- [![Mysql][Mysql.com]][Mysql-url]
- [![Typeorm][typeorm.io]][Typeorm-url]
- [![Redis][Redis.io]][Redis-url]
- [![Docker][Docker.com]][Docker-url]
- [![Aws][Aws.amazon.com]][Aws-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Instructions on setting up your project locally.
To get a local copy up and running follow these steps.

### Prerequisites

- Node

```sh
  Node version >= 18.14.2

  Yarn version 1.22.19
```

- Docker and docker compose

  ```sh
  Docker version >= 23.0.1

  Docker compose version 1.25.5
  ```

### Create file .env like .env.example

```sh
copy file .env.example
```

### Running

```bash
# development
$ docker compose up

# detach container
$ docker compose up -d

# rebuild container application backend
$ docker compose up --build
```

### Database

```bash
# generate entity auto
$ yarn db:generate-prisma-dev

# run migrate
$ yarn db:migrate-prisma-dev

# run seed
$ yarn db:seed
```

### Tool optional

- Redis web management tool (https://www.npmjs.com/package/redis-commander)

  ```bash
  $ npm install -g redis-commander
  ```

## Features

I. Design pattern

- Directory structure
  - src
    - github
    - config
    - database
    - decorator
    - enum
    - global
    - interface
    - modules
    - helper
    - static
    - test
    - .env
    - ormconfig.js
    - main.ts
    - dockerfile
    - docker-compose.yml
    - dockerfile.production
- Description
  - main.ts.
    - Init application.
  - .env
    - file environment
  - config
    - define variables by file .env to used in ConfigModule Global
  - decorator
    - define decorators, example use data {id:1, name:'haihoang'} in many places then define @data() contain that data
  - enum
    - define enum
  - i18n
    - multi language
  - interface
    - define interface
  - database
    - define entities or schema of mysql
    - create migration
  - global
    - it'll contain modules global like Queue, Redis, ...
    - maybe contain config third party
  - helper
    - contain config like validation. exception, ... generally configs relate to Nestjs
  - static
    - contain file static like html, image, ...
  - ormconfig.js
    - config mysql for CLI serve migration ...
    - note config mysql for app Nestjs then use TypeormModule.forRoot().

II. What are there?

- [Auth]
  - strategy: ['local','th_party: facebook, google']
- [Role]
  - create decorator role attach to endpoint
- [CRUD]
  - module demo
- [Logger]
  - winston
- [Validate]
  - validate request body
  - validate file .env
- [Interceptor]
  - request
  - response: ['format data', 'pagination', 'status code']
- [Exception]
  - config global
  - return format error
- [Queue]
  - create example queue
- [Redis]
  - config connection redis
- [Cache]
  - create cache example
- [Schedule]
  - create cronjob example
- [Mysql]
  - connect database
  - inti entities
  - migration
  - transaction
  - seed
  - fake data
- [Upload]
  - upload to server
  - upload to aws s3
- [Swagger]
  - create example swagger in module demo
  - create decorator request, response common
- [i18n]
  - ja
  - en
  - vn

III. Tutorial

- Overview

  - In Nestjs each feature will be called a `module`. Module will contain :
    - controller: define router
    - service: handle logic, interact entity, schema
    - dto: define validate body request
    - module: it's here
      - import: other modules
      - export: it's services, it's process, it's modules
      - controller: define file controller, instantiated
      - provider: define file service, instantiated
    - command line generate CRUD: $ `nest g resource demo`
  - Stream application
    - Client call router -> Middleware -> Guar -> Interceptor -> Pipe -> Module.

- Middleware

  - after client access router then app will go here first, but middleware express after run next(), it dose not know handler will be executed. So app will not use middleware, instead app'll use [Guar] because GUAR can access execution context

- Guar

  - Logic authentication and authorization
  - check token, check role

- Interceptor

  - access request, change request
  - transform response

- Pipe
  - validate request body
- Database

  - Mysql

    - Config
      - for app nestjs: TypeormModule.forRoot
      - for typeOrm CLI: create file ormconfig.js - create file migration - [solution1]: - add package.json "typeorm:migration:create": "func() { npx typeorm migration:create -n \"$1\" -d src/core/database/mysql/migrations; }; func", - command line terminal `yarn run typeorm:migration:create Fake1` - [solution2] - add package.json "typeorm:migration:create": "npx typeorm migration:create -n $NAME -d core/database/mysql/migrations" - command line terminal `NAME=Fake1 yarn run typeorm:migration:create` - "typeorm:migration:run": "yarn typeorm migration:run", - init migration - "typeorm:migration:revert": "yarn typeorm migration:revert" - revert migration
        -warning: alway giữ vị trí của module app cùng cấp với main. nếu không thì sẽ mất đi tính naawg auto load, auto import khi dùng command nest
      - seed
        - fakerjs fake data cho model, create file in factories for data fake
        - then create file seed , upsert db by data fake\
      - typeorm version + typeorm-seed alway compatible
      - typeorm type timestamp if nullable:false then need default value for prevent create file new migrate

  @Column({
  name: 'expired_time',
  type: 'timestamp',
  default: null,
  onUpdate: 'current_timestamp',
  })
  expiredTime: Date;

  - Swagger
    Define API Document
    - Config
      - main.ts (config option auth type Bear)
        .addBearerAuth(
        {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
        },
        'access-token',
        )
      - in controller of modules then required add @ApiBearerAuth('access-token') to @Controller()
      - Decorator
        - @ApiQuery({ name: 'type', enum: EAccountType }) define enum when method GET use query ?account_type=1
        - @ApiBody({ type: [CreateStaffDto] }) defin type generic
    - Use
      - http://localhost:3000/api/
  - I18n
    - config i18n in i18nCustom
    - create file language in folder i18n
    - method common in i18nCustomService
    - httpException i18n
