const mongoose = require('mongoose');
const slugify = require('slugify'); // SLUGIFY



const Schema = mongoose.Schema;

const enterpriseSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique: true,
    },
    description : { type : String },
    industry : { type : String },
    location : {
        country : { type : String },
        city : { type : String },
        address : { type : String }
    },
    logo : { type : String },
    website : { type : String },
    contactEmail : {
        type : String,
        required : true
    },
    contactPhone : { type : Number },
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////PREGUNTAR SI ESTO FUNCIONARIA CORRECTAMENT
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'categorys',
    },
    offers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'offerts',
    }],
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    slug : {
        type: String,
        lowercase: true,
        unique: true
    },
    state : { 
        type : String,
        default : 'active'
    },
    image : { 
        type : String
    }
});



// MIDDLEWARE PARA GENERAR SLUG CON TOKEN ALEATORIO

    enterpriseSchema.pre('save', function (next) {
        if (!this.slug) {
          const randomToken = Math.random().toString(36).substring(2, 8);  // TOKEN de 6 caracteres
          this.slug = `${slugify(this.name, { lower: true })}-${randomToken}`;  // Usamos 'name' en vez de 'title'
        }
        next();
      });


module.exports = mongoose.model('enterprises', enterpriseSchema);
