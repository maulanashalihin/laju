
# Laju

Ship your next project faster with Laju.

Equipped with the *best* and the *fastest* web technology. 

|                          | Version | Requests/s | Latency | Throughput/s |
| :--                      | --:     | :-:        | --:     | --:          | 
| Hyper Express / Laju     | 6.5.9   | 193,834    |  2.04ms  | 17.38 Mb/s  |
| Native NodeJS            | 18.16.0  | 72,670    |  5.45ms  | 11.09 Mb/s  | 


## Tech Stack

**FrontEnd:** [Svelte](https://learn.svelte.dev/tutorial/welcome-to-svelte), [Inertia](https://inertiajs.com/), [TailwindCSS](https://tailwindcss.com/), [vite](https://vite.dev/)

**BackEnd:** [Hyper Express](https://github.com/kartikk221/hyper-express), Typescript

**Database** : [Knex.js](https://knexjs.org/)


## Get Started

Clone this repo and install packages

```bash
  git clone https://github.com/maulanashalihin/laju.git
  npm install
  cp .env.example .env
  npm run dev
```

### Route to Controller

Create your first API with this simple flow

*web.ts*
```bash

  import UserController from "../app/controllers/UserController"; 

  Route.get("/user",UserController.index);
```

*UserController.ts*
```bash

class Controller {

  public async index (request,response) { 

    const users = await DB.from("users");

    return response.json(users)
  } 

}

export default new Controller()
```


 
###  File Generator

Speed up development process with File Generator.

#### 1. Generate Controller

Controller is some function to handle REST 

Generate new Controller with **node laju make:controller ControllerFile**

```bash
    node laju make:controller User 
```

*UserController.ts*
```bash

import { Response, Request } from "../../type"; 
import DB from "../services/DB";

class Controller {
    
  public async index (request : Request,response : Response) { 
  }

  public async create (request : Request, response : Response) {
  }

  public async store (request : Request, response : Response) {
  }

  public async show (request : Request, response : Response) {
  }

  public async edit (request : Request, response : Response) {
  }

  public async update (request : Request, response : Response) {
  }

  public async destroy (request : Request, response : Response) {
  }

}

export default new Controller()
```
      
 

#### 2. Generate Command

Create Command Line App then you can trigger with cron

Generate new CommandFile with **node laju make:command CommandFile**

```bash
   node laju make:command UnsubUser 
```
command file will be generated in commands folder. you can execute the file with `npx ts-node commands/CommandFile.ts` (development) or `node build/commands/CommandFile.js` (production)


#### 2. Generate Migration
```bash
  npx knex migrate:make users
```

generated users migration

*20230513055909_users.ts*
```bash
  import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().notNullable()
        table.string('name', 255)
        table.string('phone', 255)
        table.string('email', 255).notNullable()
        table.boolean("is_verified").defaultTo(false)
        table.uuid("plan_id")
        table.dateTime('membership_date');
        table.boolean("is_admin").defaultTo(false);
        table.string('password', 180).notNullable()
        table.string('remember_me_token').nullable()
  
        table.index(['email'], 'user_email_index')
        /**
         * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.bigInteger("created_at")
        table.bigInteger("updated_at")
      
    }) 
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

```
Learn more about Knex.js migration here https://knexjs.org/guide/migrations.html

    


### Folder Structure

    .
    ├── app                     # Main App (mostly touch files)
    │   ├── controllers         # controllerss
    │   ├── middlewares         # request interceptor
    │   └── services            # reusable services such as connecting to DB and Redis Service
    ├── benchmark               # Source files to compare this framework
    ├── build                   # compiled JS files
    ├── commands                # files to use as command line service
    ├── migrations              # create, alter and drop DB tables
    ├── public                  # static file of your apps
    ├── resources               # front end files
    │   ├── js                  # js folders
    │   └── views               # server side rending files
    ├── routes                  # route configuration
    ├── env.example
    ├── .gitignore
    ├── laju
    ├── clean
    ├── knexfile.ts
    ├── nodemon.json
    ├── package.json
    ├── postcss.config.js
    ├── sync_version
    ├── tailwind.config.js 
    └── tsconfig.json

 
    
### Inertia
create https://inertiajs.com/ with by passing the inertia file in Pages folder like this.

    public async loginPage (request,response) { 
 
        return response.inertia("auth/login")
    
    }


## Documentation

You can study the stacks in the repository in the respective library documentation.

[1. Hyper Express](https://github.com/kartikk221/hyper-express)


[2. Svelte](https://learn.svelte.dev/tutorial/welcome-to-svelte)


[3. Inertia](https://inertiajs.com/)


[4. TailwindCSS](https://tailwindcss.com/)


[5. Knex.js](https://knexjs.org/)


[6. Redis](https://github.com/redis/node-redis)


[7. esbuild](https://esbuild.github.io/)



    
### Benchmark Results
**Note!** these benchmark test in Macbook Air M1 with [wrk](https://github.com/wg/wrk). test script in benchmark folder.

|                          | Version | Requests/s | Latency | Throughput/s |
| :--                      | --:     | :-:        | --:     | --:          | 
| Hyper Express / Laju     | 6.5.9   | 193,834    |  2.04ms  | 17.38 Mb/s  |
| Native NodeJS            | 18.16.0  | 72,670    |  5.45ms  | 11.09 Mb/s  | 


**Hyper Express / Laju**

    wrk -t12 -c400 -d30s http://localhost:3006

```bash
Running 30s test @ http://localhost:3006
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.04ms  486.96us  19.81ms   95.72%
    Req/Sec    16.24k     1.45k   21.21k    84.36%
  5820498 requests in 30.03s, 521.78MB read
  Socket errors: connect 0, read 372, write 0, timeout 0
Requests/sec: 193834.13
Transfer/sec:     17.38MB
```

**Native NodeJS**

    wrk -t12 -c400 -d30s http://localhost:3007

```bash
Running 30s test @ http://localhost:3007
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.45ms  729.74us  34.11ms   97.20%
    Req/Sec     6.09k   370.90     7.83k    92.00%
  2181301 requests in 30.02s, 332.84MB read
  Socket errors: connect 0, read 676, write 5, timeout 0
Requests/sec:  72670.72
Transfer/sec:     11.09MB
```
