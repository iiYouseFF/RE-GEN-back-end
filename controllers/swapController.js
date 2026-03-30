import { supabase } from "../config/supabase.js";

export const proposeSwap = async ( req , res ) => {
    const { offeredItemId, requestedItemId } = req.body;
    const proposerId = req.user.id;

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
        console.error('Error Proposing Swap', error);
        return res.status(500).json({error: 'Failed to propose swap'}); 
    }
}

export const getUserSwaps = async (req, res) => {
    const userId = req.user.id;
    try {
        const { data, error } = await supabase.from('swaps')
            .select(`
                *,
                offered_item:offered_item_id(*),
                desired_item:desired_item_id(*)
            `)
            .eq('user_id', userId);
        
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error Fetching User Swaps', error);
        return res.status(500).json({ error: 'Failed to fetch user swaps' });
    }
}

export const getIncomingSwaps = async (req, res) => {
    const userId = req.user.id;
    try {
        const { data: myProducts, error: prodError } = await supabase.from('products').select('id').eq('owner_id', userId);
        if (prodError) throw prodError;
        if (myProducts.length === 0) return res.status(200).json([]);

        const myProductIds = myProducts.map(p => p.id);

        const { data, error } = await supabase.from('swaps')
            .select(`
                *,
                offered_item:offered_item_id(*),
                desired_item:desired_item_id(*)
            `)
            .in('desired_item_id', myProductIds);
        
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error Fetching Incoming Swaps', error);
        return res.status(500).json({ error: 'Failed to fetch incoming swaps' });
    }
}


export const getPotentialMatches = async (req, res) => {
    const userId = req.user.id;
    try {
        // Find swaps where others want what this user has offered,
        // or where others are offering what this user wants.
        
        // 1. Get user's own active swaps
        const { data: mySwaps, error: mySwapsError } = await supabase.from('swaps')
            .select('offered_item_id, desired_item_id')
            .eq('user_id', userId)
            .eq('status', 'pending');
            
        if (mySwapsError) throw mySwapsError;
        
        if (mySwaps.length === 0) {
            return res.status(200).json([]);
        }

        const myOfferedIds = mySwaps.map(s => s.offered_item_id);
        const myDesiredIds = mySwaps.map(s => s.desired_item_id);

        // 2. Find other users' swaps that match
        const { data: matches, error: matchError } = await supabase.from('swaps')
            .select(`
                *,
                user:user_id(id),
                offered_item:offered_item_id(*),
                desired_item:desired_item_id(*)
            `)
            .neq('user_id', userId)
            .eq('status', 'pending')
            .or(`offered_item_id.in.(${myDesiredIds.join(',')}),desired_item_id.in.(${myOfferedIds.join(',')})`);

        if (matchError) throw matchError;

        return res.status(200).json(matches);
    } catch (error) {
        console.error('Error Fetching Potential Matches', error);
        return res.status(500).json({ error: 'Failed to fetch potential matches' });
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
                const newQty = Math.max(0, offeredItem.stock_quantity - 1);
                const updates = { stock_quantity: newQty };
                if (newQty === 0) updates.status = 'sold';
                
                await supabase
                .from('products')
                .update(updates)
                .eq('id', swap.offered_item_id);
            }

            if (desiredItem) {
                const newQty = Math.max(0, desiredItem.stock_quantity - 1);
                const updates = { stock_quantity: newQty };
                if (newQty === 0) updates.status = 'sold';

                await supabase
                .from('products')
                .update(updates)
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
    } catch(error) {
        console.error("SWAP_UPDATE_CRASH:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update swap status",
            error: error.message || error,
            details: JSON.stringify(error)
        });
    }
}
