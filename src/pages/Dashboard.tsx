import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonButton,
	IonLoading,
	IonRouterLink
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


	async function logout() {
		setBusy(true);
		await logoutUser();
		setBusy(false);
		history.replace("/");
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar style={{ height: '7.5vh' }}>
					<div className="toolbar-content">
						<div className="title-container">
							<IonTitle>Dashboard</IonTitle>
						</div>
						<div className="welcome-container">
							<h1 className="welcome-message">Welcome to your video feed, {username}</h1>
						</div>
					</div>
					<IonRouterLink routerLink="/userProfile">
						<div slot="end" className="profile-button-container">
							<IonButton>user profile</IonButton>
						</div>
					</IonRouterLink>
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
						<VideoCard />
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Dashboard;
