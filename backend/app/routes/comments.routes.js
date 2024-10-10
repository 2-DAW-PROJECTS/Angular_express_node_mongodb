const commentsController = require('../controllers/comments.controller.js');
const verifyJWT = require('../middleware/verifyJWT');  // Verifica JWT para rutas protegidas
const verifyJWTOptional = require('../middleware/verifyJWTOptional');  // JWT opcional para ciertas rutas

module.exports = (app) => {
    // ADD COMMENT TO OFFER
    app.post('/offerts/:slug/comments', verifyJWT, commentsController.addCommentToOffert);  // Requiere autenticación para añadir comentario

    // GET ALL COMMENTS FROM OFFER
    app.get('/offerts/:slug/comments', verifyJWTOptional, commentsController.getCommentsFromOffert);  // Autenticación opcional para obtener los comentarios

    // DELETE COMMENT
    app.delete('/offerts/:slug/comments/:id', verifyJWT, commentsController.deleteComment);  // Requiere autenticación para eliminar comentario
};
