
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function MailTo({to,subject,text}: {to:string,subject:string,text:string })
{
  resend.emails.send({
    from: 'Laju Notification <hello@laju.dev>',
    to: to,
    subject: subject,
    replyTo : 'hello@laju.dev',
    text  : text, 
  });
}