const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        default: '' 
    },
    DOB: {
        type: Date, 
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true, 
        trim: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    password: {  
        type: String,
        required: true,
    },
    fourdigitPin: {
        type: String, 
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{4}$/.test(v); 
            },
            message: 'Pin must be a 4-digit number.'
        }
    }
}, { timestamps: true }); 

UserSchema.pre('validate', function(next) {
    if (!this.email && !this.phoneNumber) {
        this.invalidate('email', 'Either email or phone number must be provided.');
        this.invalidate('phoneNumber', 'Either email or phone number must be provided.');
    }
    next();
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
