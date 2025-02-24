/* eslint-disable no-undef */
export default (req, res, next) => {
  if (req.method === 'POST' && req.path === '/auth/login') {
    const { email, password } = req.body;
    const db = require('./db.json');
    
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Create a simple token (in production this would be a proper JWT)
      const token = Buffer.from(JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role
      })).toString('base64');

      // Remove sensitive data
      const {  ...safeUser } = user;

      res.json({
        user: safeUser,
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        error: 'Invalid email or password'
      });
    }
    return;
  }
  next();
}