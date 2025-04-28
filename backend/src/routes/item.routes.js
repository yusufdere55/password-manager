const router = require('express').Router();
const itemController = require('../controllers/item.controller');

router.get('/:id', itemController.getItemByUserId);

router.post('/:id', itemController.createItem);

router.put('/:id', itemController.itemUpdate);

router.delete('/:id', itemController.deleteItem);

module.exports = router;