 
import DB from "../app/db";
import { users } from "../app/db/schema";


const result = await DB.select().from(users).prepare();

console.log(await result.execute())
            
        
      
  