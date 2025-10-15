const mongoose = require("mongoose");
const Conversation = require("./Models/Conversation");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
// Add your MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

async function migrateExistingGroups() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all groups without admins field
    const groups = await Conversation.find({
      isGroup: true,
      $or: [{ admins: { $exists: false } }, { admins: { $size: 0 } }],
    });

    console.log(`Found ${groups.length} groups to migrate`);

    for (const group of groups) {
      // Make the first member the admin and creator
      if (group.members && group.members.length > 0) {
        group.admins = [group.members[0]];
        group.createdBy = group.members[0];
        await group.save();
        console.log(`Migrated group: ${group.groupName}`);
      }
    }

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateExistingGroups();
