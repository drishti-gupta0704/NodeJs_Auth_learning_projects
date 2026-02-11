
const ownershipMiddleware = (req, res, next) => {
  const loggedInUserId = req.user.id;
  const requestedUserId = parseInt(req.params.id);

  if (loggedInUserId !== requestedUserId) {
    return res.status(403).json({
      message: "Access denied: You can only modify your own data"
    });
  }

  next();
};

module.exports = ownershipMiddleware;
