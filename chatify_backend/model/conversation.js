const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
    sender_id: {
        type:String
    },
    receiver_id: {
        type:String
    },
    message:{
        type: String,
    }
  },{timestamps:true});
  
exports.conversations = mongoose.model('conversations', conversationSchema);