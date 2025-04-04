import type { CorsOptions } from "cors";


export const defaultCorsOptions: CorsOptions = {
    //origin: "http://localhost:3000",
    origin: "*",
    allowedHeaders: ['Content-Type', 'Authorization'] 
}