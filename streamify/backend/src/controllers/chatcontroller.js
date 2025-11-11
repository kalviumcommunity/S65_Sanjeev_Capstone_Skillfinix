const { generateStreamToken } = require("../lib/stream");


const getStreamToken = async (req, res) => {
    try {
        const token = generateStreamToken(req.user.id);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error in getStreamToken controller", error);
        res.status(500).json({ message: "Internal server error in generating stream token" });
    }
};

module.exports = { getStreamToken };