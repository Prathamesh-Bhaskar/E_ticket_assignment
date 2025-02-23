// This dummy middleware simulates admin authentication
exports.adminAuth = (req, res, next) => {
    // For example, check for a header "x-admin-auth" set to a secret value
    if (req.headers['x-admin-auth'] === 'adminsecret') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as admin' });
    }
  };
  