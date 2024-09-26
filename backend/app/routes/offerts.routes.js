const offertsController = require('../controllers/offerts.controller.js');
// const verifyJWT = require('../middleware/verifyJWT');
// const verifyJWTOptional = require('../middleware/verifyJWTOptional.js');

module.exports = (app) => {
    // CREATE OFFERT
    app.post('/offerts', offertsController.createOffert);

    // FIND ALL OFFERTS
    app.get('/offerts', /*verifyJWTOptional ,*/ offertsController.findAllOfferts);

    // FIND ONE OFFERT
    app.get('/offerts/:slug', /*verifyJWTOptional ,*/ offertsController.findOneOffert);

    // DELETE ONE OFFERT
    app.delete('/offerts/:slug', offertsController.deleteOneOffert);

    // UPDATE OFFERT
    app.put('/offerts/:slug', /*verifyJWT ,*/ offertsController.updateOffert);

    // FIND OFFERTS BY CATEGORY
    app.get('/offerts/category/:slug', offertsController.GetOffertsByCategory);

    //Filter Offerts by Search
    app.get('/offerts', offertsController.filterOfferts);

}
