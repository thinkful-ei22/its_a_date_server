const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, required: true},
  description: String,
  scheduleOptions: 
  [
    {
      option: {
        date: {type: Date, required: true},
        times:  [{time: Date, votes: {type: Number, default: 0}}]}
    }
  ],
  restaurantOptions: [
    {
      zomatoId: String, 
      votes: {type: Number, default: 0}
    }
  ]
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