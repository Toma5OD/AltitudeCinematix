import {
	IonContent,
	IonHeader,
	IonPage,
	useIonViewDidEnter
  } from "@ionic/react";
  import React, { useState } from "react";
  import "./Dashboard.css";
  import VideoCard from "../components/VideoCard";
  import Toolbar from "../components/Toolbar";
  
  const Dashboard: React.FC = () => {
	const [refreshKey, setRefreshKey] = useState(0);
  
	useIonViewDidEnter(() => {
	  setRefreshKey((prev) => prev + 1);
	});
  
	return (
	  <IonPage>
		<IonHeader>
		  <Toolbar title='Dashboard' />
		</IonHeader>
		<IonContent>
		  <div className="video-feed">
			<div className="video-card">
			  <VideoCard refreshKey={refreshKey} />
			</div>
		  </div>
		</IonContent>
	  </IonPage>
	);
  };
  
  export default Dashboard;
  