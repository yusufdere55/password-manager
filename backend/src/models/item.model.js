const sql = require('mssql');
const crypto = require('crypto');

class Item {
    constructor(d) {
        this.id = d.id;
        this.name = d.name;
        this.username = d.username;
        this.email = d.email;
        this.passwords = d.passwords;
        this.url = d.url;
        this.icon = d.icon;
        this.categoryId = d.categoryId;
        this.userId = d.userId;
        this.createAt = d.createAt;
        this.updateAt = d.updateAt;
    }

    static async create(iData) {
        try {
            // Şifreleme için gereken key ve iv oluştur
            const key = crypto.scryptSync(process.env.JWT_SECRET, 'salt', 32);
            const iv = crypto.randomBytes(16);
    
            // Şifreyi encrypt et
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update(iData.passwords, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            // IV'yi encrypted string'in başına ekle (decrypt ederken kullanmak için)
            const finalEncrypted = iv.toString('hex') + ':' + encrypted;
    
            const pool = await global.sqlPool;
            const result = await pool.request()
                .input('name', sql.NVarChar, iData.name)
                .input('username', sql.NVarChar, iData.username)
                .input('email', sql.NVarChar, iData.email)
                .input('passwords', sql.NVarChar, finalEncrypted)
                .input('url', sql.NVarChar, iData.url)
                .input('icon', sql.NVarChar, iData.icon)
                .input('categoryId', sql.Int, iData.categoryId)
                .input('userId', sql.Int, iData.userId)
                .input('createAt', sql.DateTime, new Date())
                .input('updateAt', sql.DateTime, new Date())
                .query(`
                    INSERT INTO Passwords (name, username, email, passwords, url, icon, categoryId, userId, createAt, updateAt)    
                    OUTPUT INSERTED.*
                    VALUES (@name, @username, @email, @passwords, @url, @icon, @categoryId, @userId, @createAt, @updateAt)
                `);
    
            if(result.recordset.length > 0) {
                const item = new Item(result.recordset[0]);
                item.passwords = iData.passwords; // Orijinal şifreyi geri döndür
                return item;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, iData) {
        try {
            const updateFields = [];

            
            const result = (await global.sqlPool).request()
                .input('id', sql.Int, id)
                .input('updateAt',sql.DateTime, new Date())

            if(iData.name !== undefined) {
                request.input('name', sql.NVarChar, iData.name);
                updateFields.push('name = @name');
            }
            
            if(iData.username !== undefined) {
                request.input('username', sql.NVarChar, iData.username);
                updateFields.push('username = @username');
            }
            
            if(iData.email !== undefined) {
                request.input('email', sql.NVarChar, iData.email);
                updateFields.push('email = @email');
            }
            
            if(iData.passwords !== undefined) {
                // bcrypt yerine crypto kullan
                const cipher = crypto.createCipher('aes-256-cbc', process.env.JWT_SECRET);
                let encrypted = cipher.update(iData.passwords, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                
                request.input('passwords', sql.NVarChar, encrypted);
                updateFields.push('passwords = @passwords');
            }
            
            if(iData.url !== undefined) {
                request.input('url', sql.NVarChar, iData.url);
                updateFields.push('url = @url');
            }
            
            if(iData.icon !== undefined) {
                request.input('icon', sql.NVarChar, iData.icon);
                updateFields.push('icon = @icon'); // Fixed: Was incorrectly using 'name = @icon'
            }
            
            if(iData.categoryId !== undefined) {
                request.input('categoryId', sql.Int, iData.categoryId);
                updateFields.push('categoryId = @categoryId');
            }
            
            if(iData.userId !== undefined) {
                request.input('userId', sql.Int, iData.userId);
                updateFields.push('userId = @userId');
            }
            updateFields.push('updateAt = @updateAt');

            const query = `
                UPDATE Passwords
                SET ${updateFields.join(', ')}
                OUTPUT INSERTED.*
                WHERE id = @id
            `;

            if(result.recordset.length > 0)
                return new Item(result.recordset[0])
            return null
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const result = (await global.sqlPool).request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Passwords OUTPUT DELETED.* WHERE id = @id')
            if(result.recordset.length > 0)
                return new Item(result.recordset[0])
            return null
        } catch (error) {
            throw error
        }
    }

    static async findByUserId(userId) {
        try {
            if (!userId) throw new Error('User ID is required');
    
            const pool = await global.sqlPool;
            const result = await pool.request()
                .input('userId', sql.Int, parseInt(userId)) 
                .query('SELECT * FROM Passwords WHERE userId = @userId ORDER BY createAt DESC');
    
            return result.recordset.map(record => new Item(record));
        } catch (error) {
            console.error('findByUserId error:', error);
            throw error; 
        }
    }
}

module.exports = Item;