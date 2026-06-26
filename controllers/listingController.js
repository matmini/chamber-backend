import { supabase } from '../config/supabaseClient.js'; 

export const getListings = async (req, res) => {
  try {
    const searchTerm = req.query.search; 
    let query = supabase.from('dorms').select('*'); 
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    const { data, error } = await query; 

    if (error) throw error; 

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}