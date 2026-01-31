/**
 * Migration Script: Update existing users to be email verified
 * Run this once after deploying the new auth system
 * 
 * Usage: node scripts/migrate-existing-users.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  isEmailVerified: Boolean
}, { strict: false });

const User = mongoose.model('User', UserSchema);

async function migrateUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to database');

    // Update all users without email to have a placeholder email
    const usersWithoutEmail = await User.updateMany(
      { email: { $exists: false } },
      { 
        $set: { 
          isEmailVerified: true
        }
      }
    );
    console.log(`📧 Updated ${usersWithoutEmail.modifiedCount} users without email field`);

    // Set all existing users as verified (they were created before email verification)
    const result = await User.updateMany(
      { isEmailVerified: { $exists: false } },
      { $set: { isEmailVerified: true } }
    );
    console.log(`✅ Set ${result.modifiedCount} existing users as email verified`);

    // Add placeholder email for users without email
    const usersNeedingEmail = await User.find({ 
      $or: [
        { email: { $exists: false } },
        { email: null },
        { email: '' }
      ]
    });

    for (const user of usersNeedingEmail) {
      user.email = `${user.username}@legacy.goviisuru.lk`;
      await user.save();
      console.log(`📧 Added placeholder email for user: ${user.username}`);
    }

    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers();
