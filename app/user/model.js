const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

let userSchema = Schema({

    full_name: {
        type: String,
        minlength: [3, 'Panjang nama minimal 3 karakater'],
        maxlength: [255, 'Panjang nama maksimal 255 karakater'],
        required: [true, 'Nama harus diisi']
    },

    customer_id: {
        type: Number
    },

    email: {
        type: String,
        maxlength: [255, 'Panjang email maksimal 255 karakater'],
        required: [true, 'Email harus diisi']
    },

    password: {
        type: String,
        maxlength: [255, 'Panjang password maksimal 255 karakater'],
        required: [true, 'Password harus diisi']
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    token: [String]

}, { timestamps: true });

// Validasi email
userSchema.path('email').validate(function (value) {
    const EMAIL_RE = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

// Cek email terdaftar
userSchema.path('email').validate(async function (value) {
    try {
        const count = await this.model('User').count({ email: value });
        return !count;
    } catch (err) {
        throw err;
    }
}, attr => `${attr.value} sudah terdaftar`);

const HASH_ROUND = 10;
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

// Plugin untuk AutoIncrement
userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

module.exports = model('User', userSchema);