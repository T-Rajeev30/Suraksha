const bcrypt = require('bcrypt');
const UserModel = require('../Models/user');

const signup = async (req, res) => {
    try {
        const { firstName, lastName, DOB, email, phoneNumber, createPassword, Password, fourdigitPin } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({
                message: 'Either email or phone number must be provided.',
                success: false
            });
        }

        const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists, you can login.',
                success: false
            });
        }

        const newUser = new UserModel({
            firstName,
            lastName,
            DOB,
            email,
            phoneNumber,
            createPassword,
            Password,
            fourdigitPin
        });

        newUser.createPassword = await bcrypt.hash(createPassword, 10);
        newUser.Password = await bcrypt.hash(Password, 10);
        newUser.fourdigitPin = await bcrypt.hash(fourdigitPin, 10);

        await newUser.save();

        res.status(201).json({
            message: 'Signup successful',
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, phoneNumber, fourdigitPin } = req.body;

        // Validate input
        if (!fourdigitPin || (!email && !phoneNumber)) {
            return res.status(400).json({
                message: 'Email or phone number and four-digit pin are required.',
                success: false
            });
        }
        const user = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        const isPinMatch = await bcrypt.compare(fourdigitPin, user.fourdigitPin);
        if (!isPinMatch) {
            return res.status(401).json({
                message: 'Invalid four-digit pin.',
                success: false
            });
        }

        res.status(200).json({
            message: 'Login successful',
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

module.exports = {
    signup,
    login
};
