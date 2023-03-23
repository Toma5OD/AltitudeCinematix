import React, { useState, useEffect } from "react";
import { getCurrentUser, uploadVideo } from "../firebaseConfig";
import firebase from "firebase/app";
import "./VideoUpload.css";
import { toast } from "../toast";

interface VideoUploadProps {
  onUploadComplete: (status: boolean) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [title, setTitle] = useState<string>("");
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
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
          toast("Video uploaded successfully"); // Update this line
          setUploadComplete(true);
        } else {
          toast("User not found"); // Update this line
        }
      } catch (error) {
        toast("Failed to upload video"); // Update this line
      }
    } else {
      toast("Please select a file and provide a title"); // Update this line
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
