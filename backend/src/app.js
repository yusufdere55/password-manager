const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sql = require('mssql');
const expressStatusMonitor = require('express-status-monitor');

require('dotenv').config();

// Routes import 
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const itemRoutes = require('./routes/item.routes');
const healthRoutes = require('./routes/health.routes');
const app = express();

// Middleware import
const { errorHandler } = require('./middleware/error.middleware');
const { authMiddleware } = require('./middleware/auth.middleware');

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(morgan('dev'));

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis:30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

global.sqlPool = new sql.ConnectionPool(sqlConfig);
global.sqlPool.connect()
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Database connection error: ', err))

// Routes 
app.use('/api/auth',authRoutes);
app.use('/api/category',authMiddleware,categoryRoutes);
app.use('/api/item',authMiddleware, itemRoutes);
app.use('/api/',healthRoutes);

app.get('/',(req,res) => {
    res.json({ message : 'My Accounts API'})
})

app.use(errorHandler);
app.use(expressStatusMonitor());

module.exports = app;