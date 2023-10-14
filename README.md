
# Laju

Ship your next project faster with Laju.

Equipped with the *best* and the *fastest* web technology. 

|                          | Version | Requests/s | Latency | Throughput/s |
| :--                      | --:     | :-:        | --:     | --:          | 
| Laju / String            | 1.0.0   | 113,907.24 | 3.47ms  | 13.80 MB/s   |
| Laju / JSON              | 1.0.0   | 101193.37  | 3.91ms  | 12.16 MB/s   |
| Laju / HTML              | 1.0.0   | 88,924.53  | 4.44ms  | 42.06 MB/s   |
| Laju / Inertia Render    | 1.0.0   | 81,181.96  | 4.87ms  | 48.23 MB/s   |
| Laju / Drizzle Select    | 1.0.0   | 51,281.99  | 7.78ms  | 9.9 8MB/s    |
| Native NodeJS            | 18.16.0 | 72,670     | 5.45ms  | 11.09 Mb/s   | 


## Tech Stack

**FrontEnd:** [Svelte](https://learn.svelte.dev/tutorial/welcome-to-svelte), [Inertia](https://inertiajs.com/), [TailwindCSS](https://tailwindcss.com/), [esbuild](https://esbuild.github.io/)

**BackEnd:** [Stric](https://stricjs.netlify.app/#/?id=stric/), [Bun](https://bun.sh/), Typescript

**Database** : [Drizzle ORM](https://orm.drizzle.team/)


## Get Started

Clone this repo and install packages

```bash
  git clone https://github.com/maulanashalihin/laju.git
  bun install
  cp  .env.example .env
  bun run dev
```

### Route to Controller

Create your first API with this simple flow

*routes/web.ts*
```bash

import { Stric } from "Stric";
import UserController from "../app/controllers/UserController"; 
import { view } from "../app/services/View"; 
const Route = new Stric();

Route.get("/string", ({inertia} : any) => {
    return "Hello World"
});

Route.get("/json", ({inertia} : any) => {
    return {
        name : "Maulana"
    }
});

Route.get("/", ({inertia} : any) => {
    return inertia.render("hello",{name : "World"})
});

Route.get("/html", ({inertia} : any) => {
    return view("index.html")
});

Route.get("/users", UserController.index);

export default Route;

```
 

 
###  File Generator

Speed up development process with File Generator.

#### 1. Generate Controller

Controller is some function to handle REST 

Generate new Controller with **node laju make:controller ControllerFile**

```bash
    node ace make:controller User 
```

*UserController.ts*
```bash
 
class Controller {
    
  public async index () { 
  }

  public async create () {
  }

  public async store ({params, body} : any) {
  }

  public async show ({params} : any) {
  }

  public async edit ({params} : any) {
  }

  public async update ({params, body} : any) {
  }

  public async destroy ({params} : any) {
  }

}

export default new Controller()
  
```
      
 

#### 2. Generate Command

Create Command Line App then you can trigger with cron

Generate new CommandFile with **node laju make:command CommandFile**

```bash
   node ace make:command UnsubUser 
```
command file will be generated in commands folder. you can execute the file with `bun run commands/CommandFile.ts`  

 


### Folder Structure

    .
    ├── app                     # Main App (mostly touch files)
    │   ├── controllers         # controllerss 
    │   └── services            # reusable services such as connecting to DB and Redis Service  
    ├── commands                # files to use as command line service
    ├── db                      # Database Schema
    ├── drizzle                 # Generated SQL files
    ├── public                  # static file of your apps
    ├── public                  # static file of your apps
    ├── resources               # front end files
    │   ├── js                  # js folders
    │   └── views               # server side rending files
    ├── routes                  # route configuration
    ├── bootstrap               # first load file
    ├── env.dev
    ├── env.production
    ├── sqlite.db
    ├── .gitignore
    ├── ace
    ├── clean
    ├── package.json
    ├── sync_version
    ├── tailwind.config.js
    ├── esbuild.watch.ts
    ├── esbuild.build.ts
    └── tsconfig.json

 
    
### Inertia
create https://inertiajs.com/ with by passing the inertia file in Pages folder like this.

    public async loginPage ({inertia}) { 
 
        return inertia.render("auth/login")
    
    }


## Documentation

You can study the stacks in the repository in the respective library documentation.

[1. Stric](https://stricjs.netlify.app/#/?id=stric/)


[2. Svelte](https://learn.svelte.dev/tutorial/welcome-to-svelte)


[3. Inertia](https://inertiajs.com/)


[4. TailwindCSS](https://tailwindcss.com/)


[5. Drizzle ORM](https://orm.drizzle.team//)


[6. Bun](https://bun.sh/)


[7. esbuild](https://esbuild.github.io/)



    
### Benchmark Results
**Note!** these benchmark test in Macbook Air M1 with [wrk](https://github.com/wg/wrk). test script in benchmark folder.

|                          | Version | Requests/s | Latency | Throughput/s |
| :--                      | --:     | :-:        | --:     | --:          | 
| Laju / String            | 1.0.0   | 113,907.24 | 3.47ms  | 13.80 MB/s   |
| Laju / JSON              | 1.0.0   | 101193.37  | 3.91ms  | 12.16 MB/s   |
| Laju / HTML              | 1.0.0   | 88,924.53  | 4.44ms  | 42.06 MB/s   |
| Laju / Inertia Render    | 1.0.0   | 81,181.96  | 4.87ms  | 48.23 MB/s   |
| Laju / Drizzle Select    | 1.0.0   | 51,281.99  | 7.78ms  | 9.9 8MB/s    |
| Native NodeJS            | 18.16.0 | 72,670     | 5.45ms  | 11.09 Mb/s   | 

 