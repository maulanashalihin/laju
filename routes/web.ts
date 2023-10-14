import { Router } from '@stricjs/router';
import { html } from '@stricjs/utils';
import UserController from '../app/controllers/UserController'; 
import React from '../app/responses/React';
import Html from '../app/responses/Html';
import Inertia from '../app/responses/Inertia';
import DB from '../app/db';
import { users } from '../app/db/schema';

const Route = new Router();





Route.get("/jsx",()=>{
    return React("home.jsx",{message : "Hello World"})
   
})
Route.get("/html",()=>{
    return Html("home.html",{message : "Hello World"})
})
const results = await DB.select().from(users).prepare()

Route.get("/inertia",async (ctx)=>{

    
    const _user = await results.execute();

    return Inertia(ctx).render("home",_user)

})

Route.get("/about",(ctx)=>{

    return Inertia(ctx).render("about")

})
 
Route.get('/', () => html(`<p>Hi guys</p>`));

Route.get('/json', () => new Response(JSON.stringify({ message: 'Hi guys' }),{
    headers: { 'Content-Type': 'application/json' },
}));


Route.get("/user",UserController.index)
 


export default Route;