import { supabase } from "../config/supabase.js";

export const proposeSwap = async ( req , res ) => {
    const {proposerId, receiverId, offeredItemId, requestedItemId} = req.body;

    try{
        const { data, error } = await supabase.from('swaps').insert([
            {
                user_id: proposerId,
                offered_item_id: offeredItemId,
                desired_item_id: requestedItemId,
                status: 'pending'
            }
        ]).select('*').single();
        if(error) throw error;
        return res.status(201).json(data);
    }
    catch(error){
        console.error('Error Proposing Swap');
        return res.status(500).json({error: 'Failed to propose swap', error}); 
    }
}

export const updateSwapStatus = async ( req , res ) => {
    const { id } = req.params;
    const { status } = req.body;
    try{
        const {data: swap, error: findError } = await supabase.from('swaps')
        .select('*')
        .eq('id', id)
        .single();

        if (findError || !swap) {
        return res.status(404).json({ success: false, message: "Swap offer not found." });
        }

        if (status === "accepted") {
            const { data: offeredItem } = await supabase.from('products').select('stock_quantity').eq('id', swap.offered_item_id).single();
            const { data: desiredItem } = await supabase.from('products').select('stock_quantity').eq('id', swap.desired_item_id).single();

            if (offeredItem) {
                await supabase
                .from('products')
                .update({ stock_quantity: Math.max(0, offeredItem.stock_quantity - 1) })
                .eq('id', swap.offered_item_id);
            }

            if (desiredItem) {
                await supabase
                .from('products')
                .update({ stock_quantity: Math.max(0, desiredItem.stock_quantity - 1) })
                .eq('id', swap.desired_item_id);
            }
        }

        const { data: updatedSwap, error: updateError } = await supabase
        .from('swaps')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

        if(updateError) throw updateError;

        return res.status(200).json({ success: true, message: `Swap status updated successfully to ${status}`, swap: updatedSwap });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Failed to update swap status",
            error: error.message
        });
    }
}
