import React, { useEffect, useState } from 'react';
import { database } from '../firebaseConfig';
import { IonToast } from '@ionic/react';
import { DataSnapshot } from '@firebase/database-types'; // Import this to fix DataSnapshot type issue

interface VideoValidationToastProps {
  videoId: string;
}

const VideoValidationToast: React.FC<VideoValidationToastProps> = ({ videoId }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const validationStatusRef = database().ref(`validationStatus/${videoId}`); // Use database() instead of just database
    const listener = (snapshot: DataSnapshot) => { // Add DataSnapshot type here
      const status = snapshot.val()?.status;
      if (status === 'success') {
        setToastMessage('Video meets the requirements');
      } else if (status === 'failed') {
        setToastMessage('Video does not meet the requirements');
      }
      setShowToast(true);
    };

    validationStatusRef.on('value', listener);

    return () => {
      validationStatusRef.off('value', listener);
    };
  }, [videoId]);

  return (
    <IonToast
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      message={toastMessage}
      duration={3000}
    />
  );
};

export default VideoValidationToast;
