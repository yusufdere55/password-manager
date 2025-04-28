const jwt = require('jsonwebtoken');

const generateToken = (u) => {
    return jwt.sign(
        {
            id:u.id,
            name:u.name,
            surname:u.surname,
            email:u.email,
            isAdmin:u.isAdmin,
            isActive:u.isActive
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRES_IN,
        }
    );
};

const verifyToken = (t) => {
    return jwt.verify(t,process.env.JWT_SECRET);
};

module.exports = { generateToken , verifyToken };