const Message = require("../models/Message");
const NotificationModel = require("../models/Notification");
const Conversation = require("../models/Conversation");

exports.newConversation=async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
  
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }

exports.addMessage=async (req, res) => {
    const newMessage = new Message(req.body);
    const conversation = Conversation.findById()
    try {
      const savedMessage = await newMessage.save();

      if(req.body.sendNot){
      NotificationModel.create({
            userId: req.body.receiverId,
            emiterId: req.user.id,
            text: 'just sent you a message',
            postId: req.body.conversationId
      })}
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  
  exports.getMessage=async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  }


  
  