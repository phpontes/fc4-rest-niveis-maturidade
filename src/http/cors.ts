import type { CorsOptions } from "cors";


export const defaultCorsOptions: CorsOptions = {
    origin: "http://localhost:3000",
    allowedHeaders: ['Content-Type', 'Authorization'] 
}