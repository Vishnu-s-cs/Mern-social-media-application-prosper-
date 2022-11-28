const router = require("express").Router();

const { newConversation, getConv, getConvIncTwo } = require("../controllers/conversationController");

//new conv

router.post("/", newConversation);

//get conv of a user

router.get("/:userId", getConv);

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", getConvIncTwo);

module.exports = router;