import { supabase } from "../config/supabase.js";
import { calculateCarbonSaved, getEcoFriendlyComparison } from "../utils/ecoCalculator.js";

export const getUserProfile = async ( req , res ) =>{
    try {
        // user is already attached to req by the protect middleware
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        return res.status(200).json(req.user);
    } catch (error) {
        console.error('Error Fetching User Profile', error);
        return res.status(500).json({error: 'Failed to fetch user profile'});
    }
}

export const getEcoStats = async ( req , res ) =>{
    const userId = req.user.id;

    try{
        const {data: completedSwaps, error} = await supabase.from('swaps')
        .select(`
            id,
            status,
            offered_item_id(name, eco_score),
            desired_item_id(name, eco_score)
        `)
        .eq('status' , 'completed')
        .eq('user_id', userId);

        if(error) throw error;

        let totalCarbonSavedKg = 0;
        let itemsSaved = 0;

        completedSwaps.forEach(swap =>{
            if (swap.offered_item_id) {
                totalCarbonSavedKg += calculateCarbonSaved(swap.offered_item_id.name, swap.offered_item_id.eco_score || 0);
            }
            if (swap.desired_item_id) {
                totalCarbonSavedKg += calculateCarbonSaved(swap.desired_item_id.name, swap.desired_item_id.eco_score || 0);
            }
            itemsSaved += 2;
        });

        totalCarbonSavedKg = parseFloat(totalCarbonSavedKg.toFixed(2));

        res.status(200).json({
        success: true,
        data: {
            total_carbon_saved_kg: totalCarbonSavedKg,
            items_recycled: itemsSaved,
            eco_rank: totalCarbonSavedKg > 50 ? 'Eco-Warrior' : 'Circular Starter',
            total_swaps: completedSwaps.length,
            comparisons: getEcoFriendlyComparison(totalCarbonSavedKg)
        }
    });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Could not calculate eco-stats.",
            error: error.message
        });
    }
}