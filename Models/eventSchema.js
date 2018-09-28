const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, required: true},
  draft: Boolean,
  description: String,
  location: {city:String, state:String}, //name of city, but maybe store codes or coordinates to use with apis
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