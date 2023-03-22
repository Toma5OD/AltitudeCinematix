/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as ffmpeg from "@ffmpeg-installer/ffmpeg";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import {promisify} from "util";
import {exec as execChildProcess} from "child_process";

const exec = promisify(execChildProcess);

admin.initializeApp();

exports.generateThumbnail = functions.database
  .ref("videos/{videoId}")
  .onCreate(async (snapshot, context) => {
    const videoData = snapshot.val();

    if (!videoData || !videoData.url) {
      console.log("Video data or URL is missing");
      return;
    }

    const videoUrl = videoData.url;
    const videoId = context.params.videoId;

    const tempLocalFile = path.join(os.tmpdir(), videoId);
    const tempLocalThumbFile = path.join(os.tmpdir(), `${videoId}_thumb.jpg`);

    console.log(
      `Processing video: URL=${videoUrl}, ID=${videoId}`
    );
    console.log(
      `Temporary files: Video=${tempLocalFile}, Thumbnail=${tempLocalThumbFile}`
    );

    const bucket = admin.storage().bucket();

    try {
      console.log("Downloading video...");
      await downloadFile(bucket, videoUrl, tempLocalFile);

      console.log("Generating thumbnail...");
      await generateThumbnail(tempLocalFile, tempLocalThumbFile);

      console.log("Uploading thumbnail...");
      const thumbnailUploadUrl = await uploadThumbnail(
        bucket,
        tempLocalThumbFile,
        videoId
      );

      console.log("Updating thumbnail URL in the Realtime Database...");
      await updateThumbnail(snapshot.ref, thumbnailUploadUrl);
    } catch (error) {
      console.error("Error generating thumbnail:");
    } finally {
      fs.unlinkSync(tempLocalFile);
      fs.unlinkSync(tempLocalThumbFile);
    }
  });

// eslint-disable-next-line require-jsdoc
async function downloadFile(bucket: any, videoUrl: string, localFile: string) {
  const videoFile = bucket.file(
    videoUrl.replace("gs://altitudecinematix.appspot.com/", "")
  );
  await videoFile.download({destination: localFile});
}

// eslint-disable-next-line require-jsdoc
async function generateThumbnail(inputFile: string, outputFile: string) {
  const command = `${ffmpeg.path} -i ${inputFile} -ss 00:00:01.000 -vframes 1 ${outputFile}`;
  await exec(command);
}

// eslint-disable-next-line require-jsdoc
async function uploadThumbnail(bucket: any, thumbFile: string, videoId: string) {
  const thumbUploadFile = bucket.file(`thumbnails/${videoId}.jpg`);
  await bucket.upload(thumbFile, {
    destination: thumbUploadFile.name,
    metadata: {
      contentType: "image/jpeg",
      cacheControl: "public,max-age=3600",
    },
  });

  const config = {
    action: "read",
    expires: "03-01-2500",
  };

  const url = await thumbUploadFile.getSignedUrl(config);
  return url[0];
}

// eslint-disable-next-line require-jsdoc
async function updateThumbnail(
  videoRef: admin.database.Reference,
  thumbnailUrl: string
) {
  await videoRef.update({thumbnail: thumbnailUrl});
}
