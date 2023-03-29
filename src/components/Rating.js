// Rating.js
import React, { useState } from 'react';
import firebase from 'firebase/app';

const Rating = ({ videoId, userId }) => {
  const [rating, setRating] = useState(0);

  const handleRating = async (newRating) => {
    setRating(newRating);
    const videoRef = firebase.database().ref(`videos/${videoId}/ratings`);
    await videoRef.update({ [userId]: newRating });
  };

  return (
    "temp rubbish to stop error"
  );
};

export default Rating;
