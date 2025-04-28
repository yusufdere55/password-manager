const Category = require('../models/category.model')

exports.getAllCategories = async (req,res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories)
    } catch (error) {
        console.error('getAllCategories error:', error);
        res.status(500).json({ message: error.message });
    }
}

exports.getCategoriesByName = async (req,res) => {
    try {
        const name = req.params.name;
        const categories = await Category.findByName(name);

        if(!categories)
            return res.status(404).json({ message : 'Not found Category'})

        res.status(200).json(categories)
    } catch (error) {
        console.error('getCategoriesByName error:', error);
        res.status(500).json({ message: error.message });
    }
}

exports.createCategory = async (req,res) => {
    try {
        const { name, icon } = req.body;

        const category = await Category.create({
            name,
            icon
        })

        res.status(201).json({
            message : 'Create category successfully',
            category
        })
    } catch (error) {
        console.error('createCategory error:', error);
        res.status(500).json({ message: error.message });
    }
}

exports.deleteCategory = async (req,res) => {
    try {
        const del = await Category.delete(req.params.id);

        if(!del)
            return res.status(404).json({ message : 'Not found Category'})

        res.status(200).json({ message : 'Category delete successfully'})
    } catch (error) {
        console.error('deleteCategory error:', error);
        res.status(500).json({ message: error.message });
    }
}