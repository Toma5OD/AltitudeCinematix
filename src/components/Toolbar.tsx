import {
    IonToolbar,
    IonButton,
    IonRouterLink,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { logoutUser } from "../firebaseConfig";
import "./Toolbar.css";
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
        <IonToolbar style={{ height: "20vh" }}>
            <div className="custom-toolbar1">
                <div slot="end">
                    <IonRouterLink routerLink="/myvideos">
                        <IonButton class="toolbar-button">My Videos</IonButton>
                    </IonRouterLink>
                </div>
                <div slot="end">
                    <IonRouterLink routerLink="/playlists">
                        <IonButton class="toolbar-button">Playlists</IonButton>
                    </IonRouterLink>
                </div>
                <div slot="end">
                    <IonRouterLink routerLink="/weeklychart">
                        <IonButton class="toolbar-button">Weekly Chart</IonButton>
                    </IonRouterLink>
                </div>
                <div slot="end">
                    <IonRouterLink routerLink="/upload">
                        <IonButton class="toolbar-button">Upload</IonButton>
                    </IonRouterLink>
                </div>
                <div slot="end">
                    <IonRouterLink routerLink="/dashboard">
                        <IonButton class="toolbar-button">Dashboard</IonButton>
                    </IonRouterLink>
                </div>
                <div slot="end">
                    <IonRouterLink routerLink="/userProfile">
                        <IonButton class="toolbar-button">
                            <MdPerson />
                        </IonButton>
                    </IonRouterLink>
                </div>
                <div slot="end">
                    <IonButton onClick={logout} class="toolbar-button">Logout</IonButton>
                </div>
            </div>
        </IonToolbar>
    );
};

export default Toolbar;
