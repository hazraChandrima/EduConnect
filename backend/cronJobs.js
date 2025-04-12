const cron = require("node-cron");
const User = require("./models/User"); 

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("[CRON] Running to expire access...");

  const now = new Date();
  const expiredUsers = await User.find({
    hasAccess: true,
    accessExpiresAt: { $lte: now },
  });

  for (const user of expiredUsers) {
    user.hasAccess = false;
    user.accessExpiresAt = null;
    await user.save();
    console.log(`[CRON] Access expired for: ${user.email}`);
  }

  if (expiredUsers.length === 0) {
    console.log("[CRON] No expired access found.");
  }
});