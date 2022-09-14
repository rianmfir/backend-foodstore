const { Schema, model } = require('mongoose');

const deliveryAddressSchema = Schema({

    nama: {
        type: String,
        maxlength: [255, 'Panjang maksimal nama alamat adalah 255 karakter'],
        required: [true, 'Nama alamat harus diisi']
    },

    kelurahan: {
        type: String,
        maxlength: [255, 'Panjang maksimal kelurahan adalah 255 karakter'],
        required: [true, 'Kelurahan harus diisi']
    },

    kecamatan: {
        type: String,
        maxlength: [255, 'Panjang maksimal kecamatan adalah 255 karakter'],
        required: [true, 'Kecamatan harus diisi']
    },

    kabupaten: {
        type: String,
        maxlength: [255, 'Panjang maksimal kabupaten adalah 255 karakter'],
        required: [true, 'Kabupaten harus diisi']
    },

    provinsi: {
        type: String,
        maxlength: [255, 'Panjang maksimal provinsi adalah 255 karakter'],
        required: [true, 'Provinsi harus diisi']
    },

    detail: {
        type: String,
        maxlength: [1000, 'Panjang maksimal detail adalah 1000 karakter'],
        required: [true, 'Detail Alamat harus diisi']
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamp: true });

module.exports = model('DeliveryAddress', deliveryAddressSchema);
