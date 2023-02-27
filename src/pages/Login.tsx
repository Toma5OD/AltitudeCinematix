import {
	IonContent,
	IonPage,
	IonInput,
	IonButton,
	IonItem,
	IonText,
	IonLabel,
	IonCard,
	IonCardContent,
	IonLoading
} from "@ionic/react";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { loginUser } from "../firebaseConfig";
import { toast } from "../toast";
import { setUserState } from "../redux/actions";
import { useDispatch } from "react-redux";
import "./Login.css";

const Login: React.FC = () => {
	const [busy, setBusy] = useState<boolean>(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	async function login() {
		setBusy(true);
		const res: any = await loginUser(username, password);
		if (res) {
			console.log("login res", res);
			dispatch(setUserState(res.user.email));
			history.replace("/dashboard");
			toast("You have logged in");
		}
		setBusy(false);
	}

	return (
		<IonPage className="background">
			<IonContent className="login-page">
				<div className="login-container">
					<IonText className="login-title">Login</IonText>
					<IonLoading message="Please wait.." duration={0} isOpen={busy} />
					<IonCard>
						<IonCardContent>
							<IonItem class="custom">
								<IonLabel position="floating">Email</IonLabel>
								<IonInput
									type="email"
									placeholder="Enter your email"
									onIonChange={(e: any) => setUsername(e.target.value)}
									clearInput
									color="dark"
								/>
							</IonItem>
							<IonItem class="custom">
								<IonLabel position="floating">Password</IonLabel>
								<IonInput
									type="password"
									placeholder="Enter your password"
									onIonChange={(e: any) => setPassword(e.target.value)}
									clearOnEdit
									color="dark"
								/>
							</IonItem>
							<div className="login-button-container">
								<IonButton onClick={login} expand="block" color="primary">Login</IonButton>
							</div>
							<p className="register-link">
								New here? <Link to="/register">Register</Link>
							</p>
						</IonCardContent>
					</IonCard>
				</div>
			</IonContent>
		</IonPage>

	);
};

export default Login;
