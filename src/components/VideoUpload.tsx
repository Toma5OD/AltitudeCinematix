import React, { useState, useEffect } from "react";
import { getCurrentUser, uploadVideo } from "../firebaseConfig";
import firebase from "firebase/app";
import './VideoUpload.css';

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

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
        } else {
          setToastMessage("User not found");
        }
      } catch (error) {
        setToastMessage("Failed to upload video");
      }
    } else {
      setToastMessage("Please select a file and provide a title");
    }
  };

  return (
    <div className="video-upload-container">
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
