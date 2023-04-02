import {
    IonToolbar,
    IonButton,
    IonRouterLink,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { logoutUser } from "../firebaseConfig";
import "./Toolbar2.css";
import { MdPerson } from "react-icons/md";


interface ToolbarProps {
    title: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ title }) => {
    const history = useHistory();

    async function logout() {
        await logoutUser();
        history.push("/");
    }

    return (
        <IonToolbar style={{ height: "10vh" }}>
            <div className="toolbar-content">
                <div className="title-container3">
                    <IonRouterLink routerLink="/dashboard">
                        <img className="title-container4" src={process.env.PUBLIC_URL + "/ACxLogoTrans1.png"} alt="ACLogo" />
                    </IonRouterLink>
                </div>
            </div>
            <div slot="end" className="button-container2">
                <IonRouterLink routerLink="/myvideos">
                    <IonButton class="button5">My Videos</IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="button-container2">
                <IonRouterLink routerLink="/playlists">
                    <IonButton class="button5">Playlists</IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="button-container2">
                <IonRouterLink routerLink="/weeklychart">
                    <IonButton class="button5">Weekly Chart</IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="button-container2">
                <IonRouterLink routerLink="/upload">
                    <IonButton class="button5">Upload</IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="button-container2">
                <IonRouterLink routerLink="/dashboard">
                    <IonButton class="button5">Dashboard</IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="button-container2">
                <IonRouterLink routerLink="/userProfile">
                    <IonButton class="button5">
                        <MdPerson />
                    </IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="button-container2">
                <IonButton onClick={logout} class="button5">Logout</IonButton>
            </div>
        </IonToolbar>
    );
};

export default Toolbar;
