import {
	IonToast,
	IonContent,
	IonPage,
	IonInput,
	IonButton,
	IonItem,
	IonText,
	IonCard,
	IonCardContent,
	IonLoading
} from "@ionic/react";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { loginUser, loginWithGoogle, addUserToDatabase } from "../firebaseConfig";
import { setUserState } from "../redux/actions";
import { useDispatch } from "react-redux";
import "./Login.css";

const Login: React.FC = () => {
	const [busy, setBusy] = useState<boolean>(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	async function login() {
		setBusy(true);
		const user: any = await loginUser(username, password);
		if (user) {
			console.log("login user", user);
			dispatch(setUserState(user.email));
			history.push("/dashboard");
			window.location.reload();
			setToastMessage("You have logged in");
			setShowToast(true);
		} else {
			console.error("Password or User is incorrect.");
			setToastMessage("User not found.");
			setShowToast(true);
		}
		setBusy(false);
	}
	
	async function loginWithGoogleAccount() {
		setBusy(true);
		const user: any = await loginWithGoogle();
		if (user) {
			console.log("login user", user);
			await addUserToDatabase(user);
			dispatch(setUserState(user.email));
			history.push("/dashboard");
			window.location.reload();
			setToastMessage("You have logged in with Google");
			setShowToast(true);
		} else {
			console.error("User not found.");
			setToastMessage("Password or User is incorrect.");
			setShowToast(true);
		}
		setBusy(false);
	}	

	return (
		<IonPage>
			<div className="login-background">
				<IonToast
					isOpen={showToast}
					onDidDismiss={() => setShowToast(false)}
					message={toastMessage}
					duration={2000}
					position="top"
				/>
				<IonContent className="centre-column">
					<div className="login-box">
						<IonText className="login-title text-center">Login</IonText>
						<IonLoading message="Please wait.." duration={0} isOpen={busy} />
						<IonCard>
							<div className="custom">
								<IonCardContent>
									<IonItem class="login-item">
										<IonInput
											placeholder="Enter your email"
											onIonChange={(e: any) => setUsername(e.target.value)}
											clearInput
											class="custom"
										/>
									</IonItem>
									<IonItem class="login-item">
										<IonInput
											placeholder="Enter your password"
											onIonChange={(e: any) => setPassword(e.target.value)}
											clearOnEdit
											class="custom"
										/>
									</IonItem>
									<div>
										<IonButton className="login-button" onClick={login} expand="block">Login</IonButton>
									</div>
									<IonButton className="login-button" onClick={loginWithGoogleAccount} expand="block" color="danger">
										Login with Google
									</IonButton>
									<p className="register-link">
										New here? <Link to="/register">Register</Link>
									</p>
								</IonCardContent>
							</div>
						</IonCard>
					</div>
				</IonContent>
			</div>
		</IonPage>
	);
};

export default Login;
