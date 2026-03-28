import { supabase } from "../config/supabase.js";

export const getCategories = async (req, res) => {
    try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { data, error } = await supabase.from('categories').insert([{ name }]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ message: 'Category removed' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPendingProducts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, profiles(full_name)')
            .eq('status', 'pending');
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
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
        return res.status(500).json({ error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        // Assuming an 'orders' table exists or using 'swaps' as a proxy for transactions
        const { data, error } = await supabase
            .from('swaps')
            .select('*, profiles!user_id(full_name)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
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
        return res.status(500).json({ error: error.message });
    }
};
