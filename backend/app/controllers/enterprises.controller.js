
const Enterprise = require('../models/enterprises.model.js');
const asyncHandler = require('express-async-handler');






// CREATE NEW ENTERPRISE
const createEnterprise = asyncHandler(async (req, res) => {
    const enterpriseData = {
        name: req.body.name,
        description: req.body.description || null,
        industry: req.body.industry || null,
        location: {
            country: req.body.location?.country || null, //Depende de la versión el ?. pot no funcionar !!!
            city: req.body.location?.city || null,//Depende de la versión el ?. pot no funcionar !!!
            address: req.body.location?.address || null//Depende de la versión el ?. pot no funcionar !!!
        },
        logo: req.body.logo || null,
        website: req.body.website || null,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone || null,
    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////
        category: req.body.category || null,
        offers: req.body.offers || null,
    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////
        slug: req.body.slug,
        state: req.body.state || 'active'
    };

    const newEnterprise = new Enterprise(enterpriseData);
    await newEnterprise.save();

    return res.status(201).json(newEnterprise);
});







// FIND ALL ENTERPRISES
const findAllEnterprises = asyncHandler(async (req, res) => {
    let query = {};
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const name = req.query.name || '';

    if (name) {
        query.name = { $regex: new RegExp(name, 'i') };
    }

    const enterprises = await Enterprise.find(query).limit(limit).skip(offset);
    const enterpriseCount = await Enterprise.countDocuments(query);

    return res.status(200).json({ enterprises, count: enterpriseCount });
});








// FIND ONE ENTERPRISE
const findOneEnterprise = asyncHandler(async (req, res) => {
    const enterprise = await Enterprise.findOne({ slug: req.params.slug });

    if (!enterprise) {
        return res.status(404).json({ message: 'Enterprise not found' });
    }

    return res.status(200).json(enterprise);
});





// DELETE ONE ENTERPRISE
const deleteOneEnterprise = asyncHandler(async (req, res) => {
    const result = await Enterprise.deleteOne({ slug: req.params.slug });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Enterprise not found' });
    }

    return res.status(200).json({ message: 'Enterprise deleted' });
});






// UPDATE ENTERPRISE
const updateEnterprise = asyncHandler(async (req, res) => {
    const updatedEnterprise = await Enterprise.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedEnterprise) {
        return res.status(404).json({ message: 'Enterprise not found' });
    }

    return res.status(200).json(updatedEnterprise);
});





// EXPORT MODULE
module.exports = {
    createEnterprise,
    findAllEnterprises,
    findOneEnterprise,
    deleteOneEnterprise,
    updateEnterprise
};
