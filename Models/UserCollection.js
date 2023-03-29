const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
       Username: {
                type: String,
                required: true,
                 },
          Email: {
                 type: String,
                 required: true,
                 unique: true,
                 },
       Password: {
                 type: String,
                 required:true
                 },
       IsAdmin:{
                type: Boolean,
                default:false
               },
       Photo:{
              type: String,
              default:"Avator"
             },         
     createdAt: {
                type: Date,
                default: Date.now,
               },
});

module.exports = mongoose.model('User', userSchema,'User');
