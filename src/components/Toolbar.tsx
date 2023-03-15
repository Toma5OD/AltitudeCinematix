import {
    IonToolbar,
    IonTitle,
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
        <IonToolbar style={{ height: "7.5vh" }}>
            <div className="toolbar-content">
                <div className="title-container">
                    <IonTitle className="title-toolbar">{title}</IonTitle>
                </div>
            </div>
            <div slot="end" className="dashboard-button-container">
                <IonRouterLink routerLink="/upload">
                    <IonButton className="button">Upload</IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="dashboard-button-container">
                <IonRouterLink routerLink="/dashboard">
                    <IonButton className="button">Dashboard</IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="user-details-button-container">
                <IonRouterLink routerLink="/userProfile">
                    <IonButton className="button">
                        <MdPerson />
                    </IonButton>
                </IonRouterLink>
            </div>
            <div slot="end" className="logout-button-container">
                <IonRouterLink routerLink="/">
                    <IonButton className="button" onClick={logout}>Logout</IonButton>
                </IonRouterLink>
            </div>
        </IonToolbar>
    );
};

export default Toolbar;
