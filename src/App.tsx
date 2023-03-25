import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { setupIonicReact, IonApp, IonRouterOutlet, IonSpinner } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/UserDetails";
import Upload from "./pages/Upload";
import MyVideos from "./pages/UserVideo";
import SingleVideo from './pages/SingleVideo';
import OtherUserProfile from "./pages/OtherUserProfile";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { getCurrentUser } from "./firebaseConfig";
import firebase from "firebase";

import { useDispatch } from "react-redux";
import { setUserState } from "./redux/actions";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from './components/PrivateRoute';

const RoutingSystem: React.FC = () => {
	const auth = firebase.auth();

	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route path="/" component={Home} exact />
					<Route path="/login" component={Login} exact />
					<Route path="/register" component={Register} exact />
					<PrivateRoute path="/dashboard" component={Dashboard} exact />
					<PrivateRoute path="/userProfile" component={User} exact />
					<PrivateRoute path="/upload" component={Upload} exact />
					<PrivateRoute path="/myvideos" component={MyVideos} exact />
					<PrivateRoute path="/single-video/:videoId" component={SingleVideo} exact />
					<PrivateRoute path="/other-user-profile/:userId" component={OtherUserProfile} />
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
};

// create React Function Component
const App: React.FC = () => {
	const [busy, setBusy] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		getCurrentUser().then((user: any) => {
			if (user) {
				// logged in. Dispatch action from redux store in actions.ts file
				dispatch(setUserState(user.email));
				console.log(firebase.auth().currentUser?.email);
			} else {
				window.history.replaceState({}, "", "/");
			}
			setBusy(false);
		});
	}, [dispatch]);

	return <IonApp>{busy ? <IonSpinner /> : <RoutingSystem />}</IonApp>;
};
setupIonicReact({
	mode: 'md'
});

export default App;