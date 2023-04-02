import React from "react";
import "./Logo.css";
import {
    IonRouterLink,
} from "@ionic/react";

const Logo: React.FC = () => {
    return (
        <IonRouterLink routerLink="/dashboard">
            <div className="logo-container">
                <img className="logo" src={process.env.PUBLIC_URL + "/ACxLogoTrans1.png"} alt="ACLogo" />
            </div>
        </IonRouterLink>
    );
};

export default Logo;
