const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, required: true},
  date: Date,
  timeOptions: [{time: Date, votes: {type: Number, default: 0}}],
  //change times so they associate with dates?
  /* 
  scheduleOptions: 
  [{date:
    day: Date
    times: [{time: Date, votes: {type: Number, default: 0}}}]]
  */

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