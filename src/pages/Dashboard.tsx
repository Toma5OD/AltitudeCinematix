import {
	IonContent,
	IonHeader,
	IonPage
} from "@ionic/react";
import React from "react";
import "./Dashboard.css";
import VideoCard from "../components/VideoCard";
import Toolbar from "../components/Toolbar";

const Dashboard: React.FC = () => {

	return (
		<IonPage>
		  <IonHeader>
			<Toolbar title='Dashboard' />
		  </IonHeader>
		  <IonContent>
			<div className="video-feed">
			  <div className="video-card">
				<VideoCard />
			  </div>
			</div>
		  </IonContent>
		</IonPage>
	);
};

export default Dashboard;
