import {
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
		if (res && res.user) { // check that res is not null and that res.user is not null
		  console.log("login res", res);
		  dispatch(setUserState(res.user.email));
		  history.push("/dashboard");
		  toast("You have logged in");
		} else {
		  console.error("User not found.");
		}
		setBusy(false);
	  }	  
	  

	return (
		<IonPage>
			<div className="login-background">
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
