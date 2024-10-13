const offertsController = require('../controllers/offerts.controller.js');
const verifyJWT = require('../middleware/verifyJWT');  // Verifica JWT para rutas protegidas
const verifyJWTOptional = require('../middleware/verifyJWTOptional');  // JWT opcional para ciertas rutas

module.exports = (app) => {
    // CREATE OFFERT
    app.post('/offerts', verifyJWT, offertsController.createOffert);  // Requiere autenticación

    // FIND ALL OFFERTS
    app.get('/offerts', verifyJWTOptional, offertsController.findAllOfferts);  // Autenticación opcional

    // FIND OFFERTS BY FILTERS
    app.get('/offerts/filter', verifyJWTOptional, offertsController.filterAndSearchOfferts);  // Autenticación opcional

    // FIND ONE OFFERT
    app.get('/offerts/:slug', verifyJWTOptional, offertsController.findOneOffert);  // Autenticación opcional

    // DELETE ONE OFFERT
    app.delete('/offerts/:slug', verifyJWT, offertsController.deleteOneOffert);  // Requiere autenticación

    // UPDATE OFFERT
    app.put('/offerts/:slug', verifyJWT, offertsController.updateOffert);  // Requiere autenticación

    // GET COUNT OF FAVORITES FOR A SPECIFIC OFFER
    app.get('/offerts/:slug/favorites/count', verifyJWTOptional, offertsController.getFavoriteCount);  // Obtener el conteo de favoritos (opcional)

    // FAVORITE OFFERT
    app.post('/offerts/:slug/favorite', verifyJWT, offertsController.favoriteOffert);  // Añadir a favoritos (Requiere autenticación)

    // GET USER FAVORITES
    app.post('/offerts/favorites', verifyJWT, offertsController.getUserFavorites);  // Requiere autenticación

    // console.log("Routes for offerts loaded");
    // UNFAVORITE OFFERT
    app.delete('/offerts/:slug/favorite', verifyJWT, offertsController.unfavoriteOffert);  // Eliminar de favoritos

    // FEED OFFERTS (ofertas de empresas seguidas)
    app.get('/offerts/feed', verifyJWT, offertsController.feedOfferts);  // Requiere autenticación para ver ofertas de empresas seguidas

    app.get('/offerts/filter-and-search', verifyJWTOptional, offertsController.filterAndSearchOfferts);

    app.get('/offerts/search-suggestions', verifyJWTOptional, offertsController.getSearchSuggestions);//Sugerencias de Busqueda para los usuarios

    app.get('/locations', verifyJWTOptional, offertsController.getUniqueLocations);
//Ciudades de las ofertas

};
