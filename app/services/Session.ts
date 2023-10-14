import DB from "../db/index";
import { sessions, users } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import Cookie from "./Cookie";

const session = DB.select()
   .from(sessions)
   .where(eq(sessions.id, sql.placeholder("session_id")))
   .prepare();

const user = DB.select()
   .from(users)
   .where(eq(users.id, sql.placeholder("user_id")))
   .prepare();

class Session {
   public sessions = {};

   public async get(id: string) {
      if (this.sessions[id]) {
         return this.sessions[id];
      } else {
         const _session = (await session.execute({ session_id: id })) as any;

         if (_session.length === 0) {
            return null;
         }
         this.sessions[id] = _session[0];

         const _user = await user.execute({ user_id: _session[0].user_id });

         this.sessions[id].user = _user[0];

         return this.sessions[id];
      }
   }

   public async current(ctx) {
      const id = Cookie(ctx).get("session_id");

      return this.get(id);
   }

   public async logout(ctx) {
    
    const id = Cookie(ctx).get("session_id");

    Cookie(ctx).remove("session_id");

    await DB.delete(sessions).where(eq(sessions.id, id));


    return this.get(id);
 }
}
export default new Session();
