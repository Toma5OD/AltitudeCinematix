const {getDatabase, set, ref, remove} = require("firebase-admin/database");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {setFfmpegPath, ffprobe} = require("fluent-ffmpeg");
const {path: ffmpegPath} = require("@ffmpeg-installer/ffmpeg");

setFfmpegPath(ffmpegPath);
admin.initializeApp();

const storage = admin.storage();

// eslint-disable-next-line max-len
exports.validateVideo = functions.region("europe-west1").storage.object().onFinalize(async (object) => {
  const filePath = object.name;

  // eslint-disable-next-line max-len
  const validationStatusRef = ref(getDatabase(), `validationStatus/${object.metadata.videoId}`);

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
        const aspectRatio = height / width;

        console.log("Video metadata:", metadata);
        console.log("Width:", width);
        console.log("Height:", height);
        console.log("Aspect Ratio:", aspectRatio);
        const targetAspectRatio = 16 / 9;
        const aspectRatioTolerance = 0.03;
        if (
          width >= 1280 &&
          height >= 720 &&
          width > height &&
          Math.abs(aspectRatio - targetAspectRatio) <= aspectRatioTolerance
        ) {
          console.log("Video meets the requirements");
          await set(validationStatusRef, {status: "success"});
          return null;
        } else {
          console.log("Video does not meet the requirements, deleting");
          await set(validationStatusRef, {status: "failed"});
          // eslint-disable-next-line max-len
          const videoDatabaseRef = ref(getDatabase(), `videos/${object.metadata.videoId}`);
          await remove(videoDatabaseRef);
        }
      })
      .catch((err) => {
        console.error("Error during video validation:", err);
        return null;
      });
});

