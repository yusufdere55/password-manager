const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/', categoryController.getAllCategories);

router.post('/', categoryController.createCategory);

router.get('/:name', categoryController.getCategoriesByName);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;