import Asset from './app/responses/Asset';
import Route from './routes/web';


Route.get("/asset/*",Asset)

Route.get("/favicon.ico",()=>new Response(Bun.file("public/favicon/favicon.ico")))

Route.listen();