'use strict';

const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  eventList: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  email: String
});

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
  }
});




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



const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

module.exports = { User, Event };