
const Offert = require('../models/offerts.model');
const User = require('../models/users.model');
const Comment = require('../models/comments.model');
const asyncHandler = require('express-async-handler');

// ADD COMMENT TO OFFER
const addCommentToOffert = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { slug } = req.params;
    const user = await User.findById(userId).exec();

    if (!user) return res.status(404).json({ message: "User Not Found" });

    const { body } = req.body.comment;

    if (!body) return res.status(400).json({ message: "Comment body is required" });

    const newComment = new Comment({ body, author: user._id });
    await newComment.save();

    return res.status(201).json({ comment: await newComment.toCommentResponse(user) });
});

// GET COMMENTS FROM OFFER
const getCommentsFromOffert = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const offert = await Offert.findOne({ slug }).exec();
    
    if (!offert) return res.status(404).json({ message: "Offert Not Found" });

    const user = req.loggedin ? await User.findById(req.userId).exec() : null;
    const comments = await Promise.all(offert.comments.map(async (commentId) => {
        const comment = await Comment.findById(commentId).exec();
        console.log('Loaded Comment:', comment);
        return comment ? await comment.toCommentResponse(user) : null;
    }));
    

    return res.status(200).json({ comments: comments.filter(c => c) });
});

// DELETE COMMENT
const deleteComment = asyncHandler(async (req, res) => {
    const { slug, id } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    const offert = await Offert.findOne({ slug }).exec();
    const comment = await Comment.findById(id).exec();

    if (!user || !offert || !comment) return res.status(404).json({ message: "Data Not Found" });

    if (comment.author.toString() === user._id.toString()) {
        await Comment.deleteOne({ _id: id });
        offert.comments.pull(comment._id); 
        await offert.save();
        return res.status(200).json({ message: "Comment deleted successfully" });
    } else {
        return res.status(403).json({ error: "You can only delete your own comments" });
    }
});


module.exports = {
    addCommentToOffert,
    getCommentsFromOffert,
    deleteComment
};
