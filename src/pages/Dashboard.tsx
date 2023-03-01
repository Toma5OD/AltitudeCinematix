import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonButton,
	IonLoading,
} from "@ionic/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logoutUser } from "../firebaseConfig";
import "./Dashboard.css";
import VideoCard from "../components/VideoCard";

const Dashboard: React.FC = () => {
	const [busy, setBusy] = useState(false);
	const username = useSelector((state: any) => state.user.username);
	const history = useHistory();
	const toolbarHeight = 56; // set the height of the toolbar here

	async function logout() {
		setBusy(true);
		await logoutUser();
		setBusy(false);
		history.replace("/");
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<div className="toolbar-content">
						<IonTitle>Dashboard</IonTitle>
						<h1 className="welcome-message">Welcome to your video feed, {username}</h1>
					</div>
					<div slot="end" className="logout-button-container">
						<IonButton onClick={logout}>Logout</IonButton>
					</div>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonLoading
					message="Logging out.."
					duration={0}
					isOpen={busy}
				/>

				<div className="video-feed">
					<div className="video-card">
						<VideoCard toolbarHeight={toolbarHeight} />
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Dashboard;
