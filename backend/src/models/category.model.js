const sql = require('mssql');

class Category {
    constructor(d) {
        this.id = d.id;
        this.name = d.name;
        this.icon = d.icon;
        this.createAt = d.createAt;
    }

    static async create(cData) {
        try {
            const pool = await global.sqlPool;
            const result = await pool.request()
                .input('name', sql.NVarChar, cData.name)
                .input('icon', sql.NVarChar, cData.icon)
                .input('createAt', sql.DateTime, new Date())
                .query(`
                    INSERT INTO Categories (name, createAt, icon)
                    OUTPUT INSERTED.*
                    VALUES (@name, @createAt, @icon)
                `);
            if(result.recordset.length > 0)
                return new Category(result.recordset[0])
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const pool = await global.sqlPool;
            const result = await pool.request()
                .query('SELECT * FROM Categories')
            
            return result.recordset.map(category => new Category(category))
        } catch (error) {
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const pool = await global.sqlPool;
            const result = await pool.request()
                .input('name', sql.NVarChar, name)
                .query('SELECT * FROM Categories WHERE name = @name')
            if(result.recordset.length > 0)
                return new Category(result.recordset[0])
            return null
        } catch (error) {
            throw error
        }
    }

    static async delete(id)  {
        try {
            const pool = await global.sqlPool;
            const result = await pool.request()
                .query('DELETE FROM Categories OUTPUT DELETED.* WHERE id = @id')
            
            if(result.recordset.length > 0)
                return new Category(result.recordset[0])
            return null
        } catch (error) {
            throw error
        }
    }
}

module.exports = Category;