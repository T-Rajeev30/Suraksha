const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: function () {
            return this.lastName != null && this.lastName !== '';
        },
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
                return this.phoneNumber || v; 
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
                return this.email || v; 
            },
            message: 'Either email or phone number must be provided.'
        }
    },
    createPassword:{
        type: String,
        required: true,
    },
    Password:{
        type: String,
        required: true,
    }

    
});


const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
