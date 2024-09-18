const enterprisesController = require('../controllers/enterprises.controller.js');
// const verifyJWT = require('../middleware/verifyJWT');
// const verifyJWTOptional = require('../middleware/verifyJWTOptional.js');

module.exports = (app) => {
    // CREATE OFFERT
    app.post('/enterprises', enterprisesController.createEnterprise);

    // FIND ALL OFFERTS
    app.get('/enterprises', /*verifyJWTOptional ,*/ enterprisesController.findAllEnterprises);

    // FIND ONE OFFERT
    app.get('/enterprises/:slug', /*verifyJWTOptional ,*/ enterprisesController.findOneEnterprise);

    // DELETE ONE OFFERT
    app.delete('/enterprises/:slug', enterprisesController.deleteOneEnterprise);

    // UPDATE OFFERT
    app.put('/enterprises/:slug', /*verifyJWT ,*/ enterprisesController.updateEnterprise);
}
