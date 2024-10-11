const Offert = require('../models/offerts.model.js');
const Category = require('../models/categorys.model.js');
const Enterprise = require('../models/enterprises.model.js'); // Importar el modelo de empresa
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const User = require('../models/users.model.js'); // Asegúrate de que esta ruta sea correcta

// CREATE NUEVA OFFERT
const createOffert = asyncHandler(async (req, res) => {
    const { title, company, location, description, requirements, salary, image, categorySlug } = req.body;

    const categoryObj = await Category.findOne({ slug: categorySlug }).exec();
    if (!categoryObj) return res.status(400).json({ error: 'Categoría no encontrada' });

    const enterprise = await Enterprise.findOne({ name: company }).exec();
    if (!enterprise) return res.status(400).json({ error: 'Empresa no encontrada' });

    const randomToken = Math.random().toString(36).substring(2, 8);

    const newOffert = new Offert({
        title,
        company: enterprise.name,
        company_slug: enterprise.slug,
        location,
        description,
        requirements,
        salary,
        category: categoryObj._id,
        slug: `${slugify(title, { lower: true })}-${randomToken}`,
        image, 
        categorySlug: categoryObj.slug,
        favouritesCount: 0,
        comments: []
    });

    const savedOffert = await newOffert.save();
    res.status(201).json(savedOffert);
});
// FIND ALL OFFERTS
const findAllOfferts = asyncHandler(async (req, res) => {
    let query = {};
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const title = req.query.title || '';

    if (title) {
        query.title = { $regex: new RegExp(title, 'i') };
    }

    const offerts = await Offert.find(query).limit(limit).skip(offset);
    const offertCount = await Offert.countDocuments(query);

    return res.status(200).json({ offerts, count: offertCount });
});


// FIND ONE OFFERT
const findOneOffert = asyncHandler(async (req, res) => {
    const offert = await Offert.findOne({ slug: req.params.slug });

    if (!offert) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json(offert);
});

// DELETE ONE OFFERT
const deleteOneOffert = asyncHandler(async (req, res) => {
    const result = await Offert.deleteOne({ slug: req.params.slug });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json({ message: 'Offert deleted' });
});

// UPDATE OFFERT
const updateOffert = asyncHandler(async (req, res) => {
    const updatedOffert = await Offert.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedOffert) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json(updatedOffert);
});



// FAVORITE OFFER
const favoriteOffert = asyncHandler(async (req, res) => {
    const userId = req.userId; 
    const { slug } = req.params; 
    
    const user = await User.findById(userId).exec();
    const offert = await Offert.findOne({ slug }).exec();

    if (!user || !offert) {
        return res.status(404).json({ message: "Offert or User Not Found" });
    }

    if (!offert.favorites.includes(userId)) {
        offert.favorites.push(userId); // Agregar el ID del usuario a favorites
        await offert.updateFavoriteCount(); // Actualiza el contador de favoritos
        await offert.save(); // Guarda la oferta
    }

    return res.status(200).json({ offert: await offert.toOffertResponse(user) });
});



// UNFAVORITE OFFER
const unfavoriteOffert = asyncHandler(async (req, res) => {
    const userId = req.userId; // ID del usuario desde el token
    const { slug } = req.params; // slug de la oferta

    const user = await User.findById(userId).exec();
    const offert = await Offert.findOne({ slug }).exec();

    if (!user || !offert) {
        return res.status(404).json({ message: "Offert or User Not Found" });
    }

    const index = offert.favorites.indexOf(userId);
    if (index !== -1) {
        offert.favorites.splice(index, 1);
        offert.favouritesCount = offert.favorites.length;
        await offert.save(); // Guardar los cambios en la oferta
    }

    return res.status(200).json({ offert: await offert.toOffertResponse(user) });
});

// FEED OFFERTS (offers from followed companies)
const feedOfferts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const user = await User.findById(req.userId).exec();
    const filteredOfferts = await Offert.find({ company_slug: { $in: user.followingCompanies } })
        .limit(limit)
        .skip(offset)
        .exec();

    const offertCount = await Offert.countDocuments({ company_slug: { $in: user.followingCompanies } });

    return res.status(200).json({
        offerts: await Promise.all(filteredOfferts.map(async offert => await offert.toOffertResponse(user))),
        count: offertCount // Asegúrate de enviar el recuento total
    });
});

// GET COUNT OF FAVORITES
const getFavoriteCount = asyncHandler(async (req, res) => {
    const { slug } = req.params; // Obtener el slug de la oferta

    const offert = await Offert.findOne({ slug }).exec();

    if (!offert) {
        return res.status(404).json({ message: 'Offert not found' });
    }

    return res.status(200).json({ favoritesCount: offert.favouritesCount });
});

// OBTENER OFERTAS FAVORITAS DEL USUARIO
const getUserFavorites = asyncHandler(async (req, res) => {
    console.log("getUserFavorites called");

    const userId = req.userId;
    // console.log("User ID:", userId); 

    const user = await User.findById(userId).exec();
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const favorites = await Offert.find({ favorites: { $in: [userId] } }).exec();

    if (!favorites || favorites.length === 0) {
        return res.status(200).json({ offerts: [], message: 'No tienes ofertas favoritas' });
    }

    return res.status(200).json({ offerts: favorites });
});

// const filterAndSearchOfferts = asyncHandler(async (req, res) => {
//     const { categorySlug, companySlug, salaryMin, salaryMax, searchTerm } = req.query;

//     let query = {};

//     if (categorySlug) {
//         const category = await Category.findOne({ slug: categorySlug }).exec();
//         if (category) {
//             query.category = category._id;
//         }
//     }
//     if (companySlug) {
//         query.company_slug = companySlug;
//     }

//     if (salaryMin) {
//         query.salary = { $gte: Number(salaryMin) };
//     }
//     if (salaryMax) {
//         query.salary = { ...query.salary, $lte: Number(salaryMax) };
//     }

//     if (searchTerm) {
//         query.title = { $regex: new RegExp(searchTerm, 'i') };
//     }

//     try {
//         const offerts = await Offert.find(query).exec();
//         const offertCount = await Offert.countDocuments(query);
    
//         return res.status(200).json({ offerts, count: offertCount });
//     } catch (error) {
//         console.error('Error al buscar las ofertas:', error);
//         return res.status(500).json({ message: 'Error al buscar las ofertas' });
//     }
// });
const filterAndSearchOfferts = asyncHandler(async (req, res) => {
    const { categorySlug, companySlug, salaryMin, salaryMax, searchTerm, offset, limit } = req.query;
  
    let query = {};
  
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) query.category = category._id;
    }
    if (companySlug) query.company_slug = companySlug;
    if (salaryMin) query.salary = { $gte: Number(salaryMin) };
    if (salaryMax) query.salary = { ...query.salary, $lte: Number(salaryMax) };
    if (searchTerm) query.title = { $regex: new RegExp(searchTerm, 'i') };
  
    const offerts = await Offert.find(query)
      .skip(Number(offset) || 0)
      .limit(Number(limit) || 20);
    const count = await Offert.countDocuments(query);
  
    res.json({ offerts, count });
  });
  


// EXPORT MODULE
module.exports = {
    createOffert,
    findAllOfferts,
    findOneOffert,
    filterAndSearchOfferts,
    deleteOneOffert,
    favoriteOffert,
    unfavoriteOffert,
    getFavoriteCount,
    getUserFavorites,
    feedOfferts,
    updateOffert,
};