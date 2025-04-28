const { verifyToken } = require('../utils/jwt.util');

const authMiddleware = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message : 'Yetkilendirme başlığı bulunamadı' })
        }
        
        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);

        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({ message : 'Geçersiz token' })
    }
};


module.exports = { authMiddleware }