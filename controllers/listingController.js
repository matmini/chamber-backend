import { supabase } from '../config/supabaseClient.js'; 

// get all listings 
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

// fetch a single listing by its ID 
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params; 

    const { data:listingData, error:listingError } = await supabase
      .from('dorms')
      .select('*') 
      .eq('id', id)
      .single(); // tells supabase to return an object instead of an array 
    
    if (listingError || !listingData) {
      return res.status(404).json({ error: 'Listing not found'});
    }

    // fetch the images 
    const { data:imagesData, error:imagesError } = await supabase 
      .from('dorm_images') 
      .select('image_url') 
      .eq('dorm_id', id) 
    
    if (imagesError) throw imagesError;

    const images = imagesData ? imagesData.map(item => item.image_url) : []; 

    return res.json({
      ...listingData,
      images: images
    }); 
  } catch (error) {
    console.log('Backend Server Error: ', error.message);
    return res.status(500).json({ error: error.message });
  }
}
