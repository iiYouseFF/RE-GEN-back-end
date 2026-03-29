import { supabase } from "../config/supabase.js";

export const createOrder = async (req, res) => {
    const { items, total_amount, shipping_address } = req.body;
    const userId = req.user.id;

    try {
        // 1. Validate items and availability
        for (const item of items) {
            const { data: product, error: checkError } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', item.id)
                .single();
            
            if (checkError || product.stock_quantity <= 0) {
                return res.status(400).json({ 
                    error: `Item node ${item.id} is no longer available in the network buffer.` 
                });
            }
        }

        // 2. Create the main Order record
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: userId,
                total_amount,
                shipping_address,
                status: 'completed' // In this RE-GEN world, transactions are instant finality
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create individual Order Items and Update Stock
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            quantity: 1, // RE-GEN assumes single units for hardware nodes
            price_at_purchase: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // 4. Manual stock reduction
        for (const item of items) {
            const { data: product } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', item.id)
                .single();

            if (product) {
                await supabase
                    .from('products')
                    .update({ stock_quantity: Math.max(0, product.stock_quantity - 1) })
                    .eq('id', item.id);
            }
        }

        return res.status(201).json({ 
            success: true, 
            message: "Protocol synchronized. Transaction logged on manifest.",
            order 
        });

    } catch (error) {
        console.error("[ORDER_API] Transaction Failure:", error);
        return res.status(500).json({ error: "Failed to finalize transaction manifest.", details: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error("[ORDER_API] Fetch Error:", error);
        return res.status(500).json({ error: "Failed to retrieve personal transaction history." });
    }
};
