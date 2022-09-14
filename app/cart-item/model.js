const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const cartItemSchema = Schema({

    name: {
        type: String,
        minlength: [5, 'Panjang nama minimal 5 karakter'],
        required: [true, 'Nama harus diisi']
    },

    qty: {
        type: Number,
        min: [1, 'Minimal qty adalah 1'],
        required: [true, 'Qty harus diisi']
    },

    price: {
        type: Number,
        default: 0
    },

    image_url: String,

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
});

module.exports = model('CartItem', cartItemSchema);
