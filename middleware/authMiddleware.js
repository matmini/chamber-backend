import { supabase } from '../config/supabaseClient.js'; 

export const requireAuth = async (req, res, next) => {
  try {
    // extract the authorization header
    const authHeader = req.headers.authorization; 

    // check if the header exists an starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token required'});
    }

    // isolate the actual token string 
    const token = authHeader.split(' ')[1]; 
    // console.log('token:', token);
    // ask supabase to validate the token 
    const { data: {user}, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired session token'});
    }

    // attach the verified user object directly to the request object 
    req.user = user; 

    next(); // move to the next controller function safely

  } catch (error) {
    return res.status(500).json({ message: 'Internal auth server error', error: error.message })
  }
}