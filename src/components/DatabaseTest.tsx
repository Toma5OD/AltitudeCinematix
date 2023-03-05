import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

function DatabaseTest() {
    const [data, setData] = useState(null);
  
    useEffect(() => {
        const fetchData = async () => {
          const snapshot = await firebase.database().ref('test/name').once('value');
          setData(snapshot.val());
        };
      
        fetchData();
      }, []);
      
  
    return (
        <div>
          <h1>Name: {data}</h1>
        </div>
      );
  }

export default DatabaseTest;
