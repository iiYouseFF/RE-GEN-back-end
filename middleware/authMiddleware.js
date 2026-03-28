import { supabase } from '../config/supabase.js';

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Protocol Violation: No Token Provided' });
  }

  // Verify the JWT with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Protocol Violation: Invalid Session' });
  }

  // Attach user to request for use in routes
  req.user = user;
  next();
};

export const adminOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Auth Required' });
  }

  // Check the role in the profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    return res.status(403).json({ error: 'Access Denied: Administrative Clearance Required' });
  }

  next();
};

export default authenticate;