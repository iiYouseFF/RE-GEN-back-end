import { supabase } from "../config/supabase.js";

export const findAutomatedMatches = async (userId, userItems) =>{
    try{
        const { data: allSwaps, error} = await supabase.from('swaps')
        .select('*')
        .eq('status', 'pending')

        if (error) throw error;

        const matches = [];

        for (let i = 0; i < allSwaps.length; i++) {
            for (let j = i + 1; j < allSwaps.length; j++) {
                const swapA = allSwaps[i];
                const swapB = allSwaps[j];
                
                const isReciprocal = 
                swapA.desired_item_id === swapB.offered_item_id &&
                swapB.desired_item_id === swapA.offered_item_id;

                if(isReciprocal){
                    matches.push({
                        matchType: 'Perfect Match',
                        users: [swapA.user_id, swapB.user_id],
                        items: [swapA.offered_item_id, swapB.offered_item_id],
                        swapIds: [swapA.id, swapB.id]
                    });
                }
            }
        }
        return matches;
    }
    catch(error){
        console.error('Error finding matches', error);
        return [];
    }
}

export const suggestMatchesForItem = async (productId) =>{
    const { data, error } = await supabase.from('products')
    .select('user_id')
    .eq('desired_item_id', productId)
    .eq('status', 'pending');

    return data || [];
}