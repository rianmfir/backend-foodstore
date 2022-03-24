const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = Schema({

    name: {
        type: String,
        minLength: [3, 'Panjang nama makanan minimal 3 karakter'],
        required: [true, 'Nama makanan harus diisi']
    },

    description: {
        type: String,
        maxLength: [1000, 'Panjang deskripsi maksimal 1000 karakter'],
    },

    price: {
        type: Number,
        default: 0
    },

    image_url: String,

}, { timestamps: true });

module.exports = model('Product', productSchema);