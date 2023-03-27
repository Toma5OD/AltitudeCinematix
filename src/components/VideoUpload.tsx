import {
  IonToast,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { getCurrentUser, uploadVideo } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import type { User } from "firebase/auth";
import "./VideoUpload.css";

interface VideoUploadProps {
  onUploadComplete: (status: boolean) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState<string>("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      setUser(currentUser);
    };

    fetchUser();
  }, []);


  useEffect(() => {
    if (onUploadComplete) {
      onUploadComplete(uploadComplete);
    }
  }, [uploadComplete, onUploadComplete]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024 * 1024) {
        setToastMessage("Selected file is too large. Please select a file smaller than 5 GB.");
      } else {
        setFile(selectedFile);
        setFileName(selectedFile.name);
      }
    }
  };

  const handleSubmit = async () => {
    if (file && title) {
      try {
        const user = await getCurrentUser();
        if (user) {
          await uploadVideo(file, title, user, (progress) => setProgress(progress));
          setToastMessage("Video uploaded successfully");
          setShowToast(true);
          setUploadComplete(true);
        } else {
          setToastMessage("User not found");
          setShowToast(true);
        }
      } catch (error) {
        setToastMessage("Failed to upload video");
        setShowToast(true);
      }
    } else {
      setToastMessage("Please select a file and provide a title");
      setShowToast(true);
    }
  };

  useEffect(() => {
    if (uploadComplete) {
      // Reset the states
      setFile(null);
      setFileName(null);
      setTitle("");
      setProgress(0);
    }
  }, [uploadComplete]);

  return (
    <div className="video-upload-container">
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="top"
      />
      <label htmlFor="video-upload-input" className="custom-file-input">
        <i className="fa fa-upload"></i>
        {file ? " Change file" : " Choose file"}
      </label>
      <input
        type="file"
        id="video-upload-input"
        className="video-upload-input"
        onChange={handleFileSelect}
      />
      <input
        type="text"
        className="video-title-input"
        placeholder="Enter video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {fileName && <div className="file-name-display">Selected file: {fileName}</div>}
      <button className="video-upload-button" onClick={handleSubmit}>
        Upload
      </button>
      <div className="video-upload-progress">
        <div className="video-upload-progress-bar" style={{ width: `${progress}%` }}>
          <div className="drone"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
