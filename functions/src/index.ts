const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);

ffmpeg("input.mp4")
    .size("320x240")
    .save("output.mp4")
    .on("end", () => {
      console.log("Conversion complete");
    });
