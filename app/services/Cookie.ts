 export default function(ctx){
    return {
        get : (name : string)=>{

            const has_cookie = ctx.headers.get("cookie");

            if(has_cookie)
            {
                const cookies = ctx.headers.get("cookie").split('; ');

                for (const cookie of cookies) {
                    if(cookie.includes(name))
                    {
                        return cookie.split("=")[1];
                    } 
                }
            }else{
                return null;
            }
            
            
        },
        set : (name : string, value : string)=>{
            ctx.headers.set("Set-Cookie", `${name}=${value};Path=/;Secure;`); 
        },
        remove : (name : string)=>{
            
            ctx.headers.set("Set-Cookie",  `${name}=; Secure;Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`); 
        }
    }
}