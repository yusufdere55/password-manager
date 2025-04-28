const sql = require('mssql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class User {
    constructor(d) {
        this.id = d.id;
        this.name = d.name;
        this.surname = d.surname;
        this.email = d.email;
        this.phone = d.phone;
        this.isActive = d.isActive != undefined ? d.isActive : true;
        this.isAdmin = d.isAdmin != undefined ? d.isAdmin : false;
        this.password = d.password;
        this.createAt = d.createAt;
        this.updateAt = d.updateAt;
    }

    // Create user
    static async create(uData) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hPassword = await bcrypt.hash(uData.password,salt);

            const pool = await global.sqlPool;
            const result = await pool.request()
                .input('name',sql.NVarChar,uData.name)
                .input('surname',sql.NVarChar,uData.surname)
                .input('email', sql.NVarChar,uData.email)
                .input('phone',sql.NVarChar, uData.phone || null)
                .input('isActive',sql.Bit, uData.isActive != undefined ? uData.isActive : true)
                .input('isAdmin', sql.Bit, false)
                .input('createAt',sql.DateTime, new Date())
                .input('updateAt', sql.DateTime, new Date())
                .input('password',sql.NVarChar, hPassword)
                .query(`
                    INSERT INTO Users (name, surname, email, phone, isActive, isAdmin, createAt, updateAt, password)
                    OUTPUT INSERTED.*
                    VALUES (@name, @surname, @email, @phone, @isActive, @isAdmin, @createAt, @updateAt, @password)    
                `);
            if(result.recordset.length > 0)
                return new User(result.recordset[0])
            return null;
        } catch (error) {
            throw error
        }
    }

    // Find user by Id
    static async findById(id) {
        try {
            const pool = await global.sqlPool;
            const result = await pool.request()
                .input('id',sql.Int,id)
                .query('SELECT * FROM Users WHERE id = @id');
            if(result.recordset.length > 0)
                return new User(result.recordset[0])
            return null
        } catch (error) {
            throw error
        }
    }

    // Find user by email
     //Kullanıcıyı kullanıcı adına göre bulma
     static async findByEmail(email) {
        try {
            const pool = await global.sqlPool;
            const result = await pool.request()
                .input('email',sql.NVarChar,email)
                .query('SELECT * FROM Users WHERE email = @email');

            if(result.recordset.length  > 0){
                return new User(result.recordset[0])
            }
            return null;
        } catch (error) {
            throw error
        }
    }

    // Update user
    static async update(id, uData) {
        try {
            const updateFields = [];
            const request = (await global.sqlPool).request()
                .input('id',sql.Int,id)
                .input('updateAt',sql.DateTime,new Date());
            
            if(uData.name !== undefined) {
                request.input('name',sql.NVarChar, uData.name);
                updateFields.push('name = @name');
            }
            if(uData.surname !== undefined) {
                request.input('surname',sql.NVarChar, uData.surname);
                updateFields.push('surname = @surname');
            }
            if(uData.email !== undefined) {
                request.input('email',sql.NVarChar, uData.email);
                updateFields.push('email = @email');
            }
            if(uData.phone != undefined) {
                request.input('phone',sql.NVarChar, uData.phone);
                updateFields.push('phone = @phone');
            }
            if(uData.isActive != undefined) {
                request.input('isActive',sql.Bit, uData.isActive);
                updateFields.push('isActive = @isActive');
            }

            updateFields.push('updateAt = @updateAt');

            const query = `
                UPDATE Users
                SET ${updateFields.join(', ')}
                OUTPUT INSERTED.*
                WHERE id = @id
            `;

            const result = await request.query(query);

            if(result.recordset.length > 0 )
                return new User(result.recordset[0])
            return null
        } catch (error) {
            throw error
        }
    }

    // Delete user
    static async delete(id) {
        try {
            const pool = await global.sqlPool;
            const transaction = new sql.Transaction(pool);
    
            await transaction.begin();
    
            try {
                // Önce kullanıcıya ait tüm şifreleri sil
                await transaction.request()
                    .input('userId', sql.Int, id)
                    .query('DELETE FROM Passwords WHERE userId = @userId');
    
                // Sonra kullanıcıyı sil
                const result = await transaction.request()
                    .input('id', sql.Int, id)
                    .query('DELETE FROM Users OUTPUT DELETED.* WHERE id = @id');
    
                await transaction.commit();
    
                if (result.recordset && result.recordset.length > 0) {
                    return new User(result.recordset[0]);
                }
                return null;
    
            } catch (err) {
                await transaction.rollback();
                throw err;
            }
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    }

    // Password verification method
    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword,this.password);
    }

    static async createPasswordResetToken(email) {
        try {
            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const passwordResetToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');

            // Set token expiry (10 minutes)
            const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

            // Update user in database
            const pool = await global.sqlPool;
            await pool.request()
                .input('email', sql.NVarChar, email)
                .input('resetToken', sql.NVarChar, passwordResetToken)
                .input('resetExpires', sql.DateTime, passwordResetExpires)
                .query(`
                    UPDATE Users 
                    SET passwordResetToken = @resetToken,
                        passwordResetExpires = @resetExpires
                    WHERE email = @email
                `);

            return resetToken;
        } catch (error) {
            throw error;
        }
    }

    static async resetPassword(token, newPassword) {
        try {
            // Hash the token
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            // Find user with valid token
            const pool = await global.sqlPool;
            const result = await pool.request()
                .input('token', sql.NVarChar, hashedToken)
                .input('now', sql.DateTime, new Date())
                .query(`
                    SELECT * FROM Users 
                    WHERE passwordResetToken = @token 
                    AND passwordResetExpires > @now
                `);

            if (result.recordset.length === 0) {
                throw new Error('Token geçersiz veya süresi dolmuş');
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password and clear reset token
            await pool.request()
                .input('id', sql.Int, result.recordset[0].id)
                .input('password', sql.NVarChar, hashedPassword)
                .query(`
                    UPDATE Users 
                    SET password = @password,
                        passwordResetToken = NULL,
                        passwordResetExpires = NULL
                    WHERE id = @id
                `);

            return new User(result.recordset[0]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User