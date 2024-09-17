const offertsController = require('../controllers/categorys.controller.js');
// const verifyJWT = require('../middleware/verifyJWT');
// const verifyJWTOptional = require('../middleware/verifyJWTOptional.js');

module.exports = (app) => {
    // CREATE CATEGORYS
    app.post('/categorys', categorysController.createCategorys);

    // FIND ALL CATEGORYS
    app.get('/categorys', /*verifyJWTOptional ,*/ categorysController.findAllCategorys);

    // FIND ONE CATEGORYS
    app.get('/categorys/:slug', /*verifyJWTOptional ,*/ categorysController.findOneCategorys);

    // DELETE ONE CATEGORYS
    app.delete('/categorys/:slug', categorysController.deleteOneCategorys);

    // UPDATE CATEGORYS
    app.put('/categorys/:slug', /*verifyJWT ,*/ categorysController.updateCategorys);
}
