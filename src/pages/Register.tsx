import {
	IonContent,
	IonPage,
	IonInput,
	IonButton,
	IonLoading,
	IonText,
	IonCard,
	IonCardContent,
	IonItem,
	IonLabel,
} from "@ionic/react";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { registerUser } from "../firebaseConfig";
import { toast } from "../toast";
import "./Register.css";

const Register: React.FC = () => {
	const [busy, setBusy] = useState<boolean>(false);
	const history = useHistory();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [cpassword, setCPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	async function register() {
		setBusy(true);
		if (password !== cpassword) {
			return toast("Passwords do not match");
		}

		if (username.trim() === "" || password.trim() === "" || firstName.trim() === "" || lastName.trim() === "" || phoneNumber.trim() === "") {
			return toast("All fields are required");
		}

		const res: any = await registerUser(username, password, firstName, lastName, phoneNumber);
		if (res) {
			console.log("registration successful");
			history.replace("/dashboard");
			window.location.reload();
			toast("Registration successful");
		}
		setBusy(false);
	}

	return (
		<IonPage className="background">
			<IonContent className="register-page">
				<div className="register-container">
					<IonText className="register-title">Register</IonText>
					<IonLoading message="Registering..." duration={0} isOpen={busy} />
					<IonCard class="register-box">
						<IonCardContent class="login-item">
							<div className="register-input">
								<IonItem class="login-item">
									<IonInput
										type="email"
										placeholder="Enter your email"
										onIonChange={(e: any) => setUsername(e.target.value)}
										clearInput
										class="custom22"
									/>
								</IonItem>
								<IonItem class="login-item">
									<IonInput
										type="password"
										placeholder="Enter your password"
										onIonChange={(e: any) => setPassword(e.target.value)}
										clearOnEdit
										class="custom22"
									/>
								</IonItem>
								<IonItem class="login-item">
									<IonInput
										type="password"
										placeholder="Confirm your password"
										onIonChange={(e: any) => setCPassword(e.target.value)}
										clearOnEdit
										class="custom22"
									/>
								</IonItem>
								<IonItem class="login-item">
									<IonInput
										type="text"
										placeholder="Enter your first name"
										onIonChange={(e: any) => setFirstName(e.target.value)}
										clearOnEdit
										class="custom22"
									/>
								</IonItem>
								<IonItem class="login-item">
									<IonInput
										type="text"
										placeholder="Enter your last name"
										onIonChange={(e: any) => setLastName(e.target.value)}
										clearOnEdit
										class="custom22"
									/>
								</IonItem>
								<IonItem class="login-item">
									<IonInput
										type="text"
										placeholder="Enter your phone number"
										onIonChange={(e: any) => setPhoneNumber(e.target.value)}
										clearOnEdit
										class="custom22"
									/>
								</IonItem>
							</div>
							<div className="register-button-container">
								<IonButton onClick={register} expand="block" color="primary">
									Register
								</IonButton>
							</div>
							<p className="login-link">
								Already have an account? <Link to="/login">Login</Link>
							</p>
						</IonCardContent>
					</IonCard>
				</div>
			</IonContent>
		</IonPage>
	);
};

export default Register;
