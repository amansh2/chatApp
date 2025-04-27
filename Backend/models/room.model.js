const { model, Schema, Types } = require('mongoose');


const RoomSchema = new Schema(
    {
        roomId: { type: String, required: true },
        chatsArray: [
            {
              user: { type: Number, required: true }, 
              message: { type: String, required: true }
            }
          ]
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

const roomModel = model('room', RoomSchema);

module.exports = roomModel;
