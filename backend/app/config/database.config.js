console.log("AQUI ENTRAMOS");
require('dotenv').config({ path: '../../.env'});
    // COMPROVACIONES
        console.log('MONGO_URI:', process.env.MONGO_URI);
        console.log('PORT:', process.env.PORT);
        console.log('CORSURL:', process.env.CORSURL);
        console.log('DUMMY_PRODUCTS:', process.env.DUMMY_PRODUCTS);
    //
module.exports = {
    url: process.env.MONGO_URI  
};
