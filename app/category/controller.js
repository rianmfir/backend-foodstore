const Categories = require('./model');

const index = async (req, res, next) => {
    try {
        let category = await Categories.find();
        return res.json(category);
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

const store = async (req, res, next) => {
    try {
        let payload = req.body;
        let category = new Categories(payload);
        await category.save();
        console.log(category);
        return res.json(category);

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

const update = async (req, res, next) => {
    let { id } = req.params;
    let category = await Categories.findById(id);

    try {
        let payload = req.body;
        category = await Categories.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
        return res.json(category);
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

const destroy = async (req, res, next) => {
    let { id } = req.params;

    try {
        let category = await Categories.findByIdAndDelete(id);
        return res.json(category);
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

module.exports = {
    index,
    store,
    update,
    destroy
}