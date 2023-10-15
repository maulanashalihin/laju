
# Laju

Ship your next project faster with Laju.

Equipped with the *best* and the *fastest* web technology. 

|                          | Version | Requests/s | Latency | Throughput/s |
| :--                      | --:     | :-:        | --:     | --:          | 
| Laju / String            | 1.0.0   | 178,077.14 |  2.24m  | 19.87 MB/s   |
| Laju / JSON              | 1.0.0   | 158,273.52  | 2.53ms |   19.47 MB/s |
| Laju / HTML              | 1.0.0   | 143,676.34  | 2.82ms | 53.03 MB/s   |
| Laju / Inertia Render    | 1.0.0   | 90,271.41  | 4.40ms  | 80.32MB/s    |
| Laju / Drizzle Select    | 1.0.0   | 60,898.62  | 6.51ms  | 12.72MB/s    |
| Drizzle + Inertia        | 1.0.0   | 44,093.53  | 9.10 ms | 46.89 MB/s   |
| Native NodeJS            | 18.16.0 | 72,670     | 5.45ms  | 11.09 Mb/s   | 


## Tech Stack

**FrontEnd:** [Svelte](https://learn.svelte.dev/tutorial/welcome-to-svelte), [Inertia](https://inertiajs.com/), [TailwindCSS](https://tailwindcss.com/), [esbuild](https://esbuild.github.io/)

**BackEnd:** [Stric](https://stricjs.netlify.app/#/?id=stric/), [Bun](https://bun.sh/), Typescript

**Database** : [Drizzle ORM](https://orm.drizzle.team/)


## Get Started

Clone this repo and install packages

```bash
  bun create maulanashalihin/laju hi-laju
  cp  .env.example .env
  bun run generate
  bun run app/db/migrator.ts
  bun run dev
```

### Route to Controller

Create your first API with this simple flow

*routes/web.ts*
```bash

import { Router } from "@stricjs/router";
import AuthController from "../app/controllers/AuthController";

import Cookie from "../app/services/Cookie";

import Session from "../app/services/Session";

const Route = new Router();

Route.get("/login", AuthController.loginPage);
Route.post("/login", AuthController.loginWithPassword, { body: "json" });
Route.get("/login-with-google", AuthController.loginWithGoogle);
Route.get("/register", AuthController.registerPage);
Route.post("/register", AuthController.register, { body: "json" });
Route.post("/logout", AuthController.logout);

Route.guard("/auth", async (ctx: any) => {
   const session_id = Cookie(ctx).get("session_id");

   if (session_id) {
      let session_ = await Session.get(session_id);

      if (!session_) {
         return null;
      }

      return true;
   }

   return null;
});

Route.get("/auth/home", AuthController.home);

Route.reject("/auth", () => new Response("Forbidden"));

export default Route;



```
 

 
###  File Generator

Speed up development process with File Generator.

#### 1. Generate Controller

Controller is some function to handle REST 

Generate new Controller with **bun make.ts controller ControllerFile**

```bash
    bun make.ts controller User 
```

*UserController.ts*
```bash
 
class Controller {
    
  public async index () { 
  }

  public async create () {
  }

  public async store () {
  }

  public async show () {
  }

  public async edit () {
  }

  public async update () {
  }

  public async destroy () {
  }

}

export default new Controller()
  
```
      
 

#### 2. Generate Command

Create Command Line App then you can trigger with cron

Generate new CommandFile with **bun make.ts command CommandFile**

```bash
   bun make.ts command ShowUser 
```
command file will be generated in commands folder. you can execute the file with `bun run commands/ShowUser.ts`  

 


### Folder Structure

    .
    ├── app                     # Main App (mostly touch files)
    │   ├── controllers         # controllers
    │   ├── db                  # db connector, schema and migrators 
    │   ├── responses           # responses handler 
    │   └── services            # reusable function
    ├── commands                # files to use as command line service 
    ├── migrations              # Generated SQL files
    ├── public                  # static file of your apps 
    ├── resources               # front end files
    │   ├── js                  # js folders
    │   └── views               # server side rending files
    ├── routes                  # route configuration
    ├── index.ts                # first load file
    ├── .env.example 
    ├── sqlite.db
    ├── .gitignore 
    ├── clean.ts
    ├── sync_version.ts
    ├── make.ts
    ├── package.json 
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
| Laju / String            | 1.0.0   | 178,077.14 |  2.24m  | 19.87 MB/s   |
| Laju / JSON              | 1.0.0   | 158,273.52  | 2.53ms |   19.47 MB/s |
| Laju / HTML              | 1.0.0   | 143,676.34  | 2.82ms | 53.03 MB/s   |
| Laju / Inertia Render    | 1.0.0   | 90,271.41  | 4.40ms  | 80.32MB/s    |
| Laju / Drizzle Select    | 1.0.0   | 60,898.62  | 6.51ms  | 12.72MB/s    |
| Drizzle + Inertia        | 1.0.0   | 44,093.53  | 9.10 ms | 46.89 MB/s   |
| Native NodeJS            | 18.16.0 | 72,670     | 5.45ms  | 11.09 Mb/s   | 
 
