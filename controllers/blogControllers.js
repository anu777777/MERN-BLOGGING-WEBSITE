const mongoose = require('mongoose');
const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel');

//GET ALL BLOGS

exports.getAllBlogController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate('user');
        if (!blogs) {
            return res.status(200).send({
                success: false,
                message: 'No blogs found',
            })
        }
        return res.status(200).send({
            success: true,
            count: blogs.length,
            message: 'All blogs found',
            blogs
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error while getting blogs',
            error
        })
    }
}

//CREATE BLOGS

exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all details',
            });
        }
        const existingUser = await userModel.findById(user)
        //validation
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: 'User does not exists!'
            })
        }
        const newBlog = new blogModel({ title, description, image, user });

        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({ session });
        existingUser.blogs.push(newBlog);
        await existingUser.save({ session })
        await session.commitTransaction();
        await newBlog.save();
        return res.status(201).send({
            success: true,
            message: 'Blog added',
            newBlog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'Error while creating blogs',
            error,
        })
    }
}

//UPDTAE BLOGS

exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image } = req.body;
        const blog = await blogModel.findByIdAndUpdate(id, { ...req.body }, { new: true })
        return res.status(200).send({
            success: true,
            message: 'Blog updated',
            blog,
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'Error while updating blog',
            error
        })
    }
}

//GET SINGLE BLOGS

exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id)
        if (!blog) {
            return res.status(404).send({
                success: false,
                message: 'Blog not found'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Fetch single blog',
            blog,
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'Single blog not found',
            error
        })
    }
}

//DELETE BLOGS

exports.deleteBlogController = async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndDelete(req.params.id).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            success: true,
            message: 'Blog deleted',
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'Blog cant be deleted',
            error
        })
    }
}

//GET USER BLOGS

exports.userBlogControllers = async (req, res) => {
    try {
        const userBlogs = await userModel.findById(req.params.id).populate("blogs");
        if (!userBlogs) {
            return res.status(400).send({
                success: false,
                message: 'No blogs found with this id',
            });
        }
        return res.status(200).send({
            success: true,
            message: 'User Blogs',
            userBlogs,
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'Error while loading blogs',
            error,
        })
    }
}