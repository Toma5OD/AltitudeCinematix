import {
	IonContent,
	IonPage,
	IonButton,
	IonText,
} from "@ionic/react";

import React, { useState, useEffect } from "react";
import "./Home.css";

const Home: React.FC = () => {
	const [input] = useState<string>("");

	useEffect(() => {
		console.log(input);
	}, [input]);

	return (
		<IonPage className="home-background">
			<IonContent>
				<div className="home-container">
					<IonText className="title">AltitudeCinematix</IonText>
					<img src={process.env.PUBLIC_URL + "/ACxLogoTrans.png"} alt="Logo" className="home-logo" />
					<div className="home-buttons-container">
						<IonButton routerLink="/login" className="home-button">
							Login
						</IonButton>
						<IonButton
							routerLink="/register"
							className="home-button2"
						>
							Register
						</IonButton>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Home;
