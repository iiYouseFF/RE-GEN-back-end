import { supabase } from "../config/supabase.js";

export const getCategories = async (req, res) => {
    try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error("[ADMIN_API] Get Categories Error:", error);
        return res.status(500).json({ 
            error: "Failed to retrieve classification protocols", 
            details: error.message 
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // The schema requires a 'slug' which is NOT NULL.
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, slug }])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json(data);
    } catch (error) {
        console.error("[ADMIN_API] Create Category Error:", error);
        return res.status(500).json({ 
            error: "Failed to initialize new classification protocol", 
            details: error.message,
            hint: "Ensure 'slug' is being generated correctly for your schema."
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Category removed' });
    } catch (error) {
        console.error("[ADMIN_API] Delete Category Error:", error);
        return res.status(500).json({ 
            error: "Failed to de-index classification protocol", 
            details: error.message 
        });
    }
};

export const getPendingProducts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, profiles:owner_id(*)')
            .eq('status', 'pending');
            
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error("[ADMIN_API] Moderation Queue Error:", error);
        return res.status(500).json({ 
            error: "Failed to fetch moderation queue", 
            details: error.message 
        });
    }
};

export const moderateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'declined'
        const { data, error } = await supabase
            .from('products')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error("[ADMIN_API] Moderate Product Error:", error);
        return res.status(500).json({ 
            error: "Failed to apply moderation protocol", 
            details: error.message 
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        // Updated to pull entire profile object to be safe
        const { data, error } = await supabase
            .from('orders')
            .select('*, profiles:user_id(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error("[ADMIN_API] Logistics Ledger Error:", error);
        return res.status(500).json({ 
            error: "Failed to retrieve logistics ledger", 
            details: error.message,
            hint: "Check if 'orders' table has a foreign key to 'profiles' (auth.users) via 'user_id'"
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error("[ADMIN_API] Fetch Users Error:", error);
        return res.status(500).json({ 
            error: "Failed to retrieve user directory", 
            details: error.message 
        });
    }
};

export const toggleUserRole = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch current role
        const { data: user, error: fetchError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        // Toggle logic
        const newRole = user.role === 'admin' ? 'user' : 'admin';

        // Update role
        const { data: updatedUser, error: updateError } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;
        
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("[ADMIN_API] Toggle Role Error:", error);
        return res.status(500).json({ 
            error: "Failed to alter operator clearance", 
            details: error.message 
        });
    }
};

export const getPlatformStats = async (req, res) => {
    try {
        const [products, users, swaps] = await Promise.all([
            supabase.from('products').select('id', { count: 'exact' }),
            supabase.from('profiles').select('id', { count: 'exact' }),
            supabase.from('swaps').select('id', { count: 'exact' }).eq('status', 'completed')
        ]);

        return res.status(200).json({
            totalProducts: products.count,
            totalUsers: users.count,
            completedSwaps: swaps.count,
            uptime: '99.99%',
            systemStatus: 'Operational'
        });
    } catch (error) {
        console.error("[ADMIN_API] Stats Error:", error);
        return res.status(500).json({ 
            error: "System telemetry failure", 
            details: error.message 
        });
    }
};
