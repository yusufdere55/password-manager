const Item = require('../models/item.model');
const sql = require('mssql');
const crypto = require('crypto');

exports.createItem = async (req,res) => {
    try {
        const { name, username, email, passwords, url, icon, categoryId} = req.body;
        const userId = req.params.id;

        const iData = {
            name,
            username,
            email,
            passwords,
            url,
            icon,
            categoryId,
            userId
        }

        const items = await Item.create(iData);

        if(!items)
            return res.status(500).json({ message : 'Şifre kaydedilemedi' });

        res.status(201).json({
            message: 'Şifre başarıyla kaydedildi',
            item: {
                id:iData.id,
                name: iData.name,
                username: iData.username,
                email:iData.email,
                passwords:iData.passwords,
                url:iData.url,
                icon:iData.icon,
                categoryId:iData.categoryId,
                userId:iData.userId
            }
        });
    } catch (error) {
        console.error('createItem error:', error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteItem = async (req,res) => {
    try {
        const del = await Item.delete(req.params.id);

        if(!del)
            return res.status(404).json({ message : 'Not found Item'})

        res.status(200).json({ message : 'Item delete successfuly'})
    } catch (error) {
        console.error('deleteItem error:', error);
        res.status(500).json({ message: error.message });
    }
}

exports.getItemByUserId = async (req,res) => {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        const items = await Item.findByUserId(userId);
        
        if(!items || items.length === 0) {
            return res.status(200).json([])
        }

        // Her item için şifreyi çöz
        const decryptedItems = items.map(item => {
            try {
                // Şifrelenmiş veriyi ve IV'yi ayır
                const [ivHex, encryptedHex] = item.passwords.split(':');
                
                // IV ve key'i oluştur
                const iv = Buffer.from(ivHex, 'hex');
                const key = crypto.scryptSync(process.env.JWT_SECRET, 'salt', 32);
                
                // Şifreyi çöz
                const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
                decrypted += decipher.final('utf8');

                return {
                    ...item,
                    passwords: decrypted
                };
            } catch (error) {
                console.error('Password decryption error for item:', item.id, error);
                return {
                    ...item,
                    passwords: 'Şifre çözülemedi'
                };
            }
        });

        res.status(200).json(decryptedItems);
    } catch (error) {
        console.error('getItemByUserId error:', error);
        res.status(500).json({ message: error.message });
    }
}

exports.itemUpdate = async (req,res) => {
    try {
        const updated = await Item.update(req.params.id, req.body)
        
        if(!updated)
            return res.status(404).json({ message : 'Item not found'})

        res.status(201).json({
            message:'Item update successfully',
            item:updated
        })
    } catch (error) {
        console.error('itemUpdate error:', error);
        res.status(500).json({ message: error.message });
    }
}