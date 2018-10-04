const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, required: true},
  draft: Boolean,
  description: String,
  location: {latitude: Number, longitude: Number},
  locationCity: {city: String, state: String},
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
  ],
  activityOptions: [
    {
      ebId: String,
      link: String,
      title: String,
      description: String,
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
      delete time._id;
    });
    ret.id = ret._id;
    delete ret._id;
  }
});


module.exports = mongoose.model('Event', eventSchema);
