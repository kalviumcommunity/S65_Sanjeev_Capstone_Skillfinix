const User = require('../models/User.js');
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

const acceptFriendRequest = async (req, res) => {
    try {
        const {id:requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId); 
        if(!friendRequest){
            return res.status(404).json({ message: "Friend request not found" });
        }

        // check if the logged in user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        // add each other as friends array
        // $addToSet adds eleenments to an array only if they do not already exist in the array

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender  }
        });

        res.status(200).json({ message: "Friend request accepted successfully" });
        
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error in accepting friend request" });
    }
}


const getFriendRequests = async (req, res) => {

    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: 'pending'
        }).populate('sender', 'fullName profilePic');
        

        const acceptedRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: 'accepted'
        }).populate('sender', 'fullName profilePic');

        res.status(200).json({ incomingRequests, acceptedRequests }); 
    } catch (error) {
        console.error("Error in getFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal server error in fetching friend requests" });
    }

}

const getOutgoingFriendRequests = async (req, res) => {

    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: 'pending'
        }).populate('recipient', 'fullName profilePic');

        res.status(200).json(outgoingRequests);
        
    } catch (error) {
        console.error("Error in getOutgoingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal server error in fetching outgoing friend requests" });
    }
}

module.exports = { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequests };