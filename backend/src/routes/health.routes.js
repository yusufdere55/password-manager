const router = require('express').Router();

router.get('/health', async (req,res) => {
    try {
        await global.sqlPool.request().query('SELECT 1');

        const healthCheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now(),
            databaseStatus:'Connected'
        };

        res.status(200).json(healthCheck);
    } catch (error) {
        const healthCheck = {
            uptime: process.uptime(),
            message: error.message,
            timestamp: Date.now(),
            databaseStatus: 'Disconnected'
        };

        res.status(503).json(healthCheck);
    }
})

module.exports = router;