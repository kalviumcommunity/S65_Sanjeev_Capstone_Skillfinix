const User = require('../models/User.js');
const FriendRequest = require('../models/FriendRequest.js');
const FriendRequest = require('../models/FriendRequest.js');


const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and : [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } }, // Exclude current user's friends
                {isOnboarded: true} // Only include onboarded users
            ]
        })

        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error);
        res.status(500).json({ message: "Internal server error in fetching recommended users" });
    }
}

const getMyFriends = async (req, res) => {
    try {
       const user  = await User.findById(req.user.id).select('friends').populate("friends", "fullName profilePic bio location");
         res.status(200).json(user.friends);

    } catch (error) {
        console.error("Error in getMyFriends controller", error);
        res.status(500).json({ message: "Internal server error in fetching friends list" });

    }
}

const sendFriendRequest = async (req, res) => { 
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        // prevent sending request to yourself
        if(myId === recipientId){
            return res.status(400).json({ message: "You can't send a friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message: "Recipient user not found" });
        }

        // check if already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or:[
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
        });

        if (existingRequest){
            return res.status(400).json({message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(200).json(friendRequest);
            
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error in sending friend request" });
    }
}

module.exports = { getRecommendedUsers, getMyFriends, sendFriendRequest };