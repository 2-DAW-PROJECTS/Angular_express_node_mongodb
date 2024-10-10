const Offert = require('../models/offerts.model');
const User = require('../models/users.model');
const Comment = require('../models/comments.model');
const asyncHandler = require('express-async-handler');

// ADD COMMENT TO OFFER
const addCommentToOffert = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { slug } = req.params;
    const user = await User.findById(userId).exec();
    const offert = await Offert.findOne({ slug }).exec();

    if (!user || !offert) return res.status(404).json({ message: "User or Offert Not Found" });

    const { body } = req.body.comment;
    const newComment = new Comment({ body, author: user._id, offert: offert._id });
    await newComment.save();

    offert.comments.push(newComment._id);
    await offert.save();

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
        return comment ? await comment.toCommentResponse(user) : null;
    }));

    return res.status(200).json({ comments: comments.filter(c => c) });
});

// DELETE COMMENT
// DELETE COMMENT
const deleteComment = asyncHandler(async (req, res) => {
    const { slug, id } = req.params;
    const userId = req.userId;
    const user = await User.findById(userId).exec();
    const offert = await Offert.findOne({ slug }).exec();
    const comment = await Comment.findById(id).exec();

    if (!user || !offert || !comment) return res.status(404).json({ message: "Data Not Found" });

    if (comment.author.toString() === user._id.toString()) {
        // Cambia comment.remove() por deleteOne
        await Comment.deleteOne({ _id: id });
        offert.comments.pull(comment._id); // Esta línea es correcta
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
