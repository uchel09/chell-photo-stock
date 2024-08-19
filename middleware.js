export { default } from "next-auth/middleware";

export const  config = {
    matcher:[
        "/upload/:path*/",
        "/upload/:path*/private",
        "/upload/:path*/favorite",
        "/search/private/:path*"
        
    ]
}