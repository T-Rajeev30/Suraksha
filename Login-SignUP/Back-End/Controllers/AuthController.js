const bcrypt = require('bcrypt');
const UserModel = require('../Models/user');
const jwt = require('jsonwebtoken');  // Corrected typo here

const signup = async (req, res) => {
    try {
        const { firstName, lastName, DOB, email, phoneNumber, password, fourdigitPin } = req.body;

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

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPin = await bcrypt.hash(fourdigitPin, 10);

        const newUser = new UserModel({
            firstName,
            lastName,
            DOB,
            email,
            phoneNumber,
            password: hashedPassword,
            fourdigitPin: hashedPin
        });

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

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: `${user.firstName} ${user.lastName}` // Added full name response
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
