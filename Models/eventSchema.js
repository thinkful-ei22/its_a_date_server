const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  date: Date,
  timeOptions: [{time: Date, votes: {type: Number, default: 0}}],
  restaurantOptions: [{zomatoId: String, votes: {type: Number, default: 0}}]
});

eventSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});


module.exports = mongoose.model('Event', eventSchema);