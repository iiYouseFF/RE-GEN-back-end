import { supabase } from "../config/supabase.js";

export const getProducts = async( req , res ) =>{
    try {
        const { data, error } = await supabase.from('products')
        .select('*')
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Failed to fetch products" });
    }
}

export const getProductById = async( req , res ) =>{
    try {
        const { id } = req.params;

        // Verify if the ID matches a UUID format to prevent database syntax errors
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({ error: "Invalid product ID format. Expected a UUID." });
        }

        const { data, error } = await supabase.from('products')
        .select('*')
        .eq('id', id)
        .single();
        if(error) throw error;
        return res.status(200).json(data);
    }
    catch(error){
        console.error('Error Fetching This Product');
        return res.status(500).json({error: 'Failed to fetch product', error});
    }
}

export const getProductsByCategory = async( req , res ) =>{
    try{
        const { category } = req.params;
        const { data, error } = await supabase.from('products')
        .select('*')
        .eq('category', category)
        if(error) throw error;
        return res.status(200).json(data);
    }
    catch(error){
        console.error('Error Fetching This Product');
        return res.status(500).json({error: 'Failed to fetch product', error});
    }
}

export const addProduct = async ( req , res ) =>{
    try{
        const {name, description, price, categoryId, stockQuantity, ecoScore, isSwapable} = req.body;
        // Verify req.file exists before attempting to read its path
        const image_url = req.file ? req.file.path : 'default_placeholder_url';
        
        const { data: category, error } = await supabase.from('categories').select('id').eq('id', categoryId).single();
        if(error) throw error;
        
        const { data: product, error: productError } = await supabase.from('products').insert([
            {
                name,
                description,
                price,
                category_id: categoryId,
                stock_quantity: stockQuantity,
                eco_score: ecoScore,
                image_url: image_url,
                is_swap_eligible: isSwapable,
                owner_id: req.user.id
            }
        ]).select('*').single();
        if(productError) throw productError;
        
        return res.status(201).json(product);
    }
    catch(error){
        console.error('Error Adding Product:', error);
        // Changed key to 'details' to prevent replacing the main 'error' text,
        // and using error.message or the raw error object to ensure it serializes properly.
        return res.status(500).json({ error: 'Failed to add product', details: error.message || error });
    }
}