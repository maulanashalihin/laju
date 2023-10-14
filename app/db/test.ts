 
import DB from "./index"; 


import {  users } from './schema';

 
const user = await DB.insert(users).values({
    id : "1",
    username : "Maulana Shalihin"
}).returning();
console.log(user) 