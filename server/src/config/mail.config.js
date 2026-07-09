import nodemailer from "nodemailer";
import { config_ENV } from "./auth.config.js";

const transporterConfig = config_ENV.EMAIL_HOST?.includes("gmail")
    ? {
        service: "gmail",
        auth: {
            user: config_ENV.EMAIL_USER,
            pass: config_ENV.EMAIL_PASS
        }
      }
    : {
        host: config_ENV.EMAIL_HOST,
        port: config_ENV.EMAIL_PORT,
        secure: config_ENV.EMAIL_SECURE,
        auth: {
            user: config_ENV.EMAIL_USER,
            pass: config_ENV.EMAIL_PASS
        }
      };

export const MailTransporter = nodemailer.createTransport(transporterConfig);

export const verifyMailConnection = async () => {
    try{
        await MailTransporter.verify();
        console.log("Mail server is ready to take messages");
    }catch(error){
        console.log("Mail server connection failed:", error.message);    
    }
}


