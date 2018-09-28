const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, required: true},
  draft: Boolean,
  description: String,
  location: {latitude: Number, longitude: Number},
  scheduleOptions: [
    {
      date: String, 
      votes: {type: Number, default: 0}
    }
  ],
  restaurantOptions: [
    {
      zomatoId: String,
      website: String,
      name: String,
      votes: {type: Number, default: 0}
    }
  ]
});

eventSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.scheduleOptions.forEach(time => {
      time.id = time._id;
    });
    ret.id = ret._id;
    delete ret._id;
  }
});


module.exports = mongoose.model('Event', eventSchema);