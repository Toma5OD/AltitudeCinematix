const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {setFfmpegPath, ffprobe} = require("fluent-ffmpeg");
const {path: ffmpegPath} = require("@ffmpeg-installer/ffmpeg");

setFfmpegPath(ffmpegPath);
admin.initializeApp();

const storage = admin.storage();

// eslint-disable-next-line max-len
exports.resetRatings = functions.pubsub.schedule("0 0 * * SUN").timeZone("Europe/London").onRun(async (context) => {
  const videosRef = admin.database().ref("videos");
  const videosSnapshot = await videosRef.once("value");
  const updates = {};

  videosSnapshot.forEach((video) => {
    updates[`/${video.key}/ratings`] = {};
  });

  await videosRef.update(updates);
  console.log("Ratings have been reset.");
});


// eslint-disable-next-line max-len
exports.validateVideo = functions.region("europe-west1").storage.object().onFinalize(async (object) => {
  const filePath = object.name;


  // THIS LINE CAN BE ENABLED IF YOU WANT TO SEND STATUS TO DATABASE
  // eslint-disable-next-line max-len
  // const validationStatusRef = admin.database().ref(`validationStatus/${object.metadata.videoId}`);

  if (!object.contentType.startsWith("video/")) {
    console.log("Not a video, skipping validation.");
    return null;
  }

  const bucket = storage.bucket(object.bucket);
  const file = bucket.file(filePath);

  return new Promise((resolve, reject) => {
    ffprobe(file.createReadStream(), (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  })
      .then(async (metadata) => {
        const videoStream = metadata.streams.find(
            (stream) => stream.codec_type === "video",
        );
        const {width, height} = videoStream;

        console.log("Video metadata:", metadata);
        console.log("Width:", width);
        console.log("Height:", height);
        if (
          width >= 1280 &&
          height >= 720 &&
          width > height
        ) {
          console.log("Video meets the requirements");
          // THIS LINE SENDS A STATUS TO BE STORED IN DATABASE.
          // THIS IS NOT REQUIRED AS CLIENT SIDE CHECKS ARE ALSO IN PLACE
          // WITH IONTOAST MESSAGES
          // await validationStatusRef.set({status: "success"});
          return null;
        } else {
          console.log("Video does not meet the requirements, deleting");
          // THIS LINE SENDS A STATUS TO BE STORED IN DATABASE.
          // THIS IS NOT REQUIRED AS CLIENT SIDE CHECKS ARE ALSO IN PLACE
          // WITH IONTOAST MESSAGES
          // await validationStatusRef.set({status: "failed"});
          // eslint-disable-next-line max-len
          const videoDatabaseRef = admin.database().ref().child(`videos/${object.metadata.videoId}`);
          // Delete the video from Cloud Storage
          await videoDatabaseRef.remove();
        }
      })
      .catch((err) => {
        console.error("Error during video validation:", err);
        return null;
      });
});

