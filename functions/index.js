// Import required packages
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// eslint-disable-next-line max-len
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path || "/opt/homebrew/bin/ffmpeg";
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const fluentFfmpeg = require("fluent-ffmpeg");

fluentFfmpeg.setFfmpegPath(ffmpegPath);
fluentFfmpeg.setFfprobePath(ffprobePath);

admin.initializeApp();

const storage = admin.storage();
const database = admin.database();


// Cloud Function to validate the video
// eslint-disable-next-line max-len
exports.validateVideo = functions.storage.object().onFinalize(async (object) => {
  if (object.contentType && object.contentType.startsWith("video/")) {
    const filePath = object.name;
    const fileBucket = object.bucket;
    const bucket = storage.bucket(fileBucket);

    // Fetch the video metadata
    const metadata = await new Promise((resolve, reject) => {
      fluentFfmpeg({source: bucket.file(filePath).createReadStream()})
          .ffprobe((err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
    });

    const {width, height} = metadata.streams[0];
    const isHorizontal = width >= height;
    const isHD = width >= 1280 && height >= 720;

    if (isHorizontal && isHD) {
      console.log("Video meets the requirements");

      // Extract videoId and userId from the customMetadata
      const {videoId, userId} = object.metadata;

      // Add video information to the Realtime Database
      const videoData = {
        title: object.metadata.title,
        url: object.mediaLink,
        fileName: filePath.split("/").pop(),
        userId: userId,
        timestamp: admin.database.ServerValue.TIMESTAMP,
      };

      await database.ref(`videos/${videoId}`).set(videoData);
      console.log("Video information added to the Realtime Database");
    } else {
      console.log("Video does not meet the requirements");

      // Delete the video from Firebase Storage
      await bucket.file(filePath).delete();
      console.log("Video removed from Firebase Storage");
    }
  }
});
