const offertsController = require('../controllers/offerts.controller.js');

module.exports = (app) => {
    // CREATE OFFERT
    app.post('/offerts', offertsController.createOffert);

    // FIND ALL OFFERTS
    app.get('/offerts', offertsController.findAllOfferts);

    // FIND OFFERTS BY FILTERS
    app.get('/offerts/filter', offertsController.filterOffert); // Cambiado a filterOffert
    console.log('Ruta de filtro de ofertas');

    // FIND ONE OFFERT
    app.get('/offerts/:slug', offertsController.findOneOffert);

    // DELETE ONE OFFERT
    app.delete('/offerts/:slug', offertsController.deleteOneOffert);

    // UPDATE OFFERT
    app.put('/offerts/:slug', offertsController.updateOffert);

    // FIND OFFERTS BY FILTERS
    app.get('/offerts', offertsController.filterOfferts);

};

