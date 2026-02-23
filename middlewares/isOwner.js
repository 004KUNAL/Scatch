module.exports = function isOwner(req, res, next) {
    if (!req.user || req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Owners only.' });
    }
    next();
};
