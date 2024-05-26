const mongoose = require('mongoose');
const { Schema } = mongoose;

const userdatasSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: false,
        unique: true
      },
    number: {
        type: Number,
        trim: true,
        required: true,
        unique: true
      },
    email: {
        type: String,
        unique: true,
        trim: true,
        validate: {
          validator: function(v) {
            return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(v);
          },
          message: props => `${props.value} is not a valid Email`
        },
        required: [true, 'User Email is required']
      },
    password: {
        type: String,
        trim: true,
        required: true
      },
    bio: {
        type: String,
        trim: true,
        required: false,
      },
    pic: {
        type: String,
        default:'https://img.freepik.com/free-icon/user_318-159711.jpg'
      },
    otp: {
        type: String,
        trim: true,
        required: false,
        maxlength: 4
      },
    statusFlag : { 
        required: false,
        type: Number, 
        default: 0,
        maxlength: 1
    },
    token : {type: String}
  },{timestamps:true});
  
exports.Userdatas = mongoose.model('Userdatas', userdatasSchema);