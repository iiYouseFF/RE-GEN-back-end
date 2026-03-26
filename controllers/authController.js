import { supabase } from "../config/supabase.js";

export const register = async ( req , res ) =>{
    const { email , password } = req.body;
    try{
        const { data: user, error } = await supabase.auth.signUp({
            email,
            password
        });
        if(error) throw error;
        return res.status(201).json(user);
    }
    catch(error){
        console.error('Error Registering User');
        return res.status(500).json({error: 'Failed to register user', error});
    }
}

export const login = async ( req , res ) =>{
    const { email , password } = req.body;
    try{
        const { data: user, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if(error) throw error;
        return res.status(200).json(user);
    }
    catch(error){
        console.error('Error Logging In');
        return res.status(500).json({error: 'Failed to log in', error});
    }
}