import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { IonContent, IonHeader, IonPage } from '@ionic/react';
import Toolbar from '../components/Toolbar2';
import { getVideoById, readUserData } from '../firebaseConfig';
import './SingleVideo.css';

const SingleVideo: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const screen = useFullScreenHandle();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [video, setVideo] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const videoData = await getVideoById(videoId);
      const userData = await readUserData(videoData.userId);
      setVideo(videoData);
      setUserData(userData);
    };

    fetchVideo();
  }, [videoId]);

  const handleFullscreenClick = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      screen.enter();
    } else {
      screen.exit();
    }
  };

  if (!video || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <Toolbar title="Single Video" />
      </IonHeader>
      <div className="custom-ion-content22">
        <IonContent fullscreen>
          <div className="single-video-container">
            <FullScreen handle={screen}>
              <video
                className="video-player-1"
                src={video.url}
                controls
                onClick={handleFullscreenClick}
              ></video>
            </FullScreen>
            <div className="video-info">
              <h2 className="video-title-1">{video.title}</h2>
              <p className="video-author-1">By: {userData.firstName} {userData.lastName}</p>
            </div>
          </div>
        </IonContent>
      </div>
    </IonPage>
  );
};

export default SingleVideo;
