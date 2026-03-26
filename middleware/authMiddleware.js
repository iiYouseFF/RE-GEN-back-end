import { supabase } from "../config/supabase.js";

export const protect = async ( req , res , next ) =>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const { data: { user }, error} = await supabase.auth.getUser(token);

            if(error || !user){
                return res.status(401).json({
                    success: false,
                    message: 'Not Authorized'
                });
            }
            req.user = user;
            next();
        }
        catch(error){
            console.error('Error Verifying Token' , error);
            return res.status(401).json({
                success: false,
                message: 'Not Authorized'
            });
        }
    }
    if (!token){
        res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    };
};