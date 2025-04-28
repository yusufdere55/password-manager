const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');
const { sendPasswordResetEmail } = require('../utils/mail.util');

// User login
exports.login = async (req,res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findByEmail(email);

        if(!user)
            return res.status(401).json({ message : 'Invalid username or password'});

        // Pasword control
        const isPassValid = await user.comparePassword(password);
        if(!isPassValid)
            return res.status(401).json({ message : 'Invalid username or password'});

        if(!user.isActive)
            return res.status(403).json({ message : 'Your account has been disabled'});

        const token = generateToken(user);

        res.status(200).json({
            message : 'Login successfully',
            token,
            user:{
                id:user.id,
                name:user.name,
                surname:user.surname,
                email:user.email,
                isAdmin : user.isAdmin,
                isActive : user.isActive
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Giriş işlemi sırasında bir hata oluştu' });
    }
}


// User register
exports.register = async (req, res) => {
    try {
        const { name, surname, email, phone, password } = req.body;
        
        // Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email zaten kullanılıyor' });
        }

        const userData = {
            name,
            surname,
            email,
            phone,
            password
        };

        const user = await User.create(userData);

        if (!user)
            return res.status(500).json({ message: 'Kullanıcı oluşturulamadı' });

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Kullanıcı oluşturma sırasında bir hata oluştu' });
    }
}

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'Kullanıcı bilgileri alınırken bir hata oluştu' });
    }
}

exports.forgotPassword = async (req,res) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);

        if(!user)
            return res.status(404).json({ message : 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'});

        const resetToken = await User.createPasswordResetToken(email);
        await sendPasswordResetEmail(email , resetToken);

        res.status(200).json({ message : 'Şifre sıfırlama linki email adresinize gönderildi'});
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
            message: 'Şifre sıfırlama işlemi sırasında bir hata oluştu' 
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.resetPassword(token, password);

        const newToken = generateToken(user);

        res.status(200).json({
            message: 'Şifre başarıyla güncellendi',
            token: newToken
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req,res) => {
    try {
        const updated = await User.update(req.params.id , req.body);

        if(!updated)
            return res.status(404).json({ message : 'Kullanıcı bulunamadı'})

        res.status(200).json({
            message: 'Kullanıcı başarıyla güncellendi',
            user: updated,
        })


    } catch (error) {
        console.error('Update account error:', error);
        res.status(400).json({ message: error.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const deletedUser = await User.delete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Account deleted successfully',
            user: deletedUser
        });

    } catch (error) {
        console.error('Delete account error:', error);
        res.status(400).json({ 
            message: 'Failed to delete account',
            error: error.message 
        });
    }
};