const model = require('../model/conversation');
const conversation = model.conversations;

exports.addconversations = async(req,res)=>{
    try {
        const Conversation = new conversation(req.body);
        await Conversation.save();
        res.status(201).json({message : 'Your message send successfully'});
      } catch (error) {
        res.status(500).json({message : 'Your message is not send successfully'});
      }
}

exports.getallconversations = async(req,res)=>{
    try {
      const sender_id = req.params.sender_id;
      const receiver_id = req.params.receiver_id;
      if (!sender_id || !receiver_id) {
        return res.status(400).json({ message: 'Both sender_id and receiver_id are required query parameters.' });
      }
      const getallchats = await conversation.find({
        $or: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id }, // Include the reverse scenario in case the chat was initiated by the other user.
        ]
      });
      res.status(200).json(getallchats);
    } catch (error) {
      res.status(400).json({message : 'An error is occurred in getting all conversations between two users from the database'});
    }
}

exports.getlatestconversations = async(req,res)=>{
    try {
      const sender_id = req.params.sender_id;
      const receiver_id = req.params.receiver_id;
      if (!sender_id || !receiver_id) {
        return res.status(400).json({ message: 'Both sender_id and receiver_id are required query parameters.' });
      }
      const getallchats = await conversation.find({
        $or: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id }, // Include the reverse scenario in case the chat was initiated by the other user.
        ]
      }).sort({ _id: -1 }) // Sort the messages in descending order by _id to get the latest message first
      .limit(1);
      res.status(200).json(getallchats);
    } catch (error) {
      res.status(500).json({message : 'An error is occurred in getting all conversations between two users in the database'});
    }
}
