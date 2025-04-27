const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: Number, required: true },
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

const userModel = model('User', UserSchema);

module.exports ={userModel}
