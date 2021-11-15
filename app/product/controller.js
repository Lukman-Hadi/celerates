// file app/product/controller.js

const Product = require('./model');

async function index(req, res, next) {
    try {
        let { limit = 10, skip = 0, q = '' } = req.query;
        let criteria = {};
        if (q.length) {
            // --- gabungkan dengan criteria --- //
            criteria = {
                ...criteria,
                name: { $regex: `${q}`, $options: 'i' }
            }
        }
        let products = await Product.find(criteria).limit(parseInt(limit)).skip(parseInt(skip));
        return res.json(products);
    } catch (err) {
        next(err);
    }
}
// buat function store 
async function store(req, res, next) {
    try {
        let payload = req.body;
        let product = new Product(payload);
        await product.save();
        return res.json(product);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

async function update(req, res, next) {
    try {
        let payload = req.body;
        let product = await Product.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidators: true });
        await product.save();
        return res.json(product);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

async function destroy(req, res, next) {
    try {
        let product = await Product.findOneAndDelete({ _id: req.params.id });
        return res.json(product);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    store,
    index,
    update,
    destroy
}