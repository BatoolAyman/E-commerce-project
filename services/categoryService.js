const Category = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');


//@desc get list of categories
//@route get /api/v1/categories
//@access public
exports.getCategories = asyncHandler(async (req, res) => {
   const page = req.query.page * 1 || 1;
   const limit= req.query.limit* 1 || 5;
   const skip= (page -1) * limit;
   const categories= await Category.find({}).skip(skip).limit(limit);
   res.status(200).json({results: categories.length,page, data:categories});

});

// @desc get specific category by id
// @route get /api/v1/categories/:id
//@acess public
exports.getCategory = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const category = await Category.findById(id);
    if(!category){
        res.status(404).json({msg: 'No category for this id ${id}'});
    }
    res.status(200).json({data: category});
});


//@desc create category
//@route post /api/v1/categories
//@access private
exports.createCategory = asyncHandler (async (req, res) => {
    const name = req.body.name;
    const category = await Category.create({name, slug: slugify(name)});
    res.status(201).json({ data: category});
    

    
});
//@desc update specific category
//@route put api/v1/categories/id
//@access private
exports.updateCategory = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    const {name} = req.body;
    const category = await Category.findOneAndUpdate({_id: id}, {name, slug: slugify(name)}, {new: true});
    if(!category){
        res.status(404).json({msg: 'No category for this id ${id}'});
    }
    res.status(200).json({data: category});
}); 

//@desc delete specific category
//@route delete api/v1/categories/id
//@access private
exports.deleteCategory = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    const category = await Category.findByIdAndDelete(id);
    if(!category){
        res.status(404).json({msg: 'No category for this id ${id}'});
    }
    res.status(204).send();
});
