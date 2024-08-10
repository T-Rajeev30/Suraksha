const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the UserSchema
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false, // Remove condition to simplify
    },
    DOB: {
        type: Date, 
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                return !!v || !!this.phoneNumber; // Either email or phone number must be present
            },
            message: 'Either email or phone number must be provided.'
        }
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true, 
        validate: {
            validator: function (v) {
                return !!v || !!this.email; // Either phone number or email must be present
            },
            message: 'Either email or phone number must be provided.'
        }
    },
    createPassword: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    fourdigitPin: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{4}$/.test(v);
            },
            message: 'Pin must be a 10-digit number.'
        }
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
