import { supabase } from '../config/supabaseClient.js'; 
import { getDistance } from '../utils/getDistance.js';

// get all listings 
export const getListings = async (req, res) => {
  try {
    const searchTerm = req.query.search; 
    const sortBy  = req.query.sort;
    const types = req.query.types;
    // console.log(types);
    // console.log("Searh:",searchTerm);
    // console.log("Sort:",sortBy);
    let query = supabase.from('dorms').select('*'); 
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    if (types) {
    // 'studio'
    // '1br'
    // '2br'
    // 'coed'
    // 'female'
    // 'male'
    // 'ref'
    // 'aircon'
    // 'parking'
    // 'curfew'
    // 'cooking'
    // 'pets'
    // 'visitors'

      // split the string to array 
      const typeArray = types.split(','); 
      
      // room types
      const roomTypes = typeArray.filter(item => 
        ['studio', '1br', '2br','many_br'].includes(item)
      );
      if (roomTypes.length > 0) {
        query = query.in('type', roomTypes);
      }

      // tenants
      const tenants = typeArray.filter(item => 
        ['coed', 'female', 'male'].includes(item)
      );
      if (tenants.length > 0) {
        query = query.in('tenant_type', tenants);
      }

      // amenities and features
      if (typeArray.includes('ref')){
        query = query.eq('has_ref', true);
      }
      if (typeArray.includes('aircon')){
        query = query.eq('has_aircon', true);
      }
      if (typeArray.includes('visitors')){
        query = query.eq('visitors_allowed', true);
      }
      if (typeArray.includes('cooking')){
        query = query.eq('cooking_allowed', true);
      }
      if (typeArray.includes('pets')){
        query = query.eq('pets_allowed', true);
      }
      if (typeArray.includes('laundry')){
        query = query.eq('laundry_allowed', true);
      }
      if (typeArray.includes('parking')){
        query = query.eq('has_parking', true);
      }
      if (typeArray.includes('curfew')){
        query = query.eq('with_curfew', true);
      }

    }
    
    if (sortBy === 'price-asc') {
      query = query.order('price', {ascending: true});
    } else if (sortBy === 'price-desc') {
      query = query.order('price', {ascending: false});
    } else if (sortBy === 'distance-asc') {
      query = query.order('distance_from_up_main_gate', {ascending:true})
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

export const createListing = async (req, res) => {
  try {
    // grab the authenticated user's id from the auth middleware
    const userId = req.user.id;

    // destructure the listing details from the form body 
    const { name, price, lat, lng, type, capacity, has_aircon, tenant_type, visitors_allowed, pets_allowed, cooking_allowed, laundry_allowed, has_parking, with_curfew, address, phone } = req.body;

    const distance_from_up_main_gate = await getDistance(parseFloat(lat), parseFloat(lng));

    const { data, error } = await supabase 
      .from('dorms')
      .insert([
        {
          name, price, lat, lng, type, capacity, has_aircon, tenant_type, visitors_allowed, pets_allowed, cooking_allowed, laundry_allowed, has_parking, with_curfew, address, phone, distance_from_up_main_gate, user_id: userId
        }
      ])
      .select();

    if (error) throw error; 

    return res.status(201).json({ message: "Listing created successfully!", data}); 
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};