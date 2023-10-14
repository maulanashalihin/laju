let cache = {} as any;
export default function (ctx,headers = {}) {
    return {
        redirect : (location,status=302)=>{
 
             
            return new Response("",{
                status: status,
                headers: { 
                    ...headers,
                    "Set-Cookie": ctx.headers.get("Set-Cookie"), 
                    'Location': location
                }
            });
        },
        json : (data,status=200)=>{
            return new Response(JSON.stringify(data),{
                status: status,
                headers: { 
                    ...headers,
                    "Set-Cookie": ctx.headers.get("Set-Cookie"), 
                    'Content-Type': 'application/json'
                }
            });
        },
        send : (data,status=200)=>{
            return new Response(data,{
                status: status,
                headers: { 
                    ...headers,
                    "Set-Cookie": ctx.headers.get("Set-Cookie")
                }
            });
        },
        html : (data,status=200)=>{
            return new Response(data,{
                status: status,
                headers: { 
                    ...headers,
                    "Set-Cookie": ctx.headers.get("Set-Cookie"),
                    "Content-Type": "text/html"
                }
            });
        }
    }
}
