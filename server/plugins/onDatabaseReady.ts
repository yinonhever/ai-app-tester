import mongoose from "mongoose";

const updateStoppedScans = async () => {
  try {
    const result = await Scan.updateMany(
      { status: "in_progress" },
      {
        $set: {
          status: "error",
          currentStage: "Failed to complete",
          errorMsg: "Server shut down during scan"
        }
      }
    );
    console.log(`Updated the status of ${result.modifiedCount} stopped scans`);
  } catch (err: any) {
    console.log("Error in updating stopped scans", err);
  }
};

export default defineNitroPlugin(() => {
  mongoose.connection.on("connected", () => {
    updateStoppedScans();
  });
});
