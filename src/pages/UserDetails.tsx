import React, { useEffect, useState } from 'react';
import './UserDetails.css';
import { readUserData, updateUserData, getCurrentUser, updateEmail, updateUserPassword, reauthenticateUser } from '../firebaseConfig';
import {
  IonHeader,
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonInput,
  IonButton,
  IonCard,
} from '@ionic/react';
import Toolbar from '../components/Toolbar';

interface User {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const UserDetails: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userData = await readUserData(currentUser.uid);
        if (userData) {
          setUser(userData);
          setUid(currentUser.uid);
          setEmail(currentUser.email || '');
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setPhoneNumber(userData.phoneNumber);
        }
      }
    }
    fetchUser();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = async () => {
    setEditMode(false);
    const currentUser = await getCurrentUser();
    setEmail(currentUser?.email || '');
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setPhoneNumber(user?.phoneNumber || '');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword) {
      console.log("Current password is required for updating email or password.");
      return;
    }

    await reauthenticateUser(currentPassword);

    const updates = { email, firstName, lastName, phoneNumber };
    const updatedUser = await updateUserData(updates);

    if (email !== (await getCurrentUser())?.email) {
      await updateEmail(email);
    }

    if (newPassword) {
      await updateUserPassword(newPassword);
    }

    setUser(updatedUser);
    setEditMode(false);
    setNewPassword(''); // Clear the new password state after updating
    setCurrentPassword(''); // Clear the current password state after updating
  };

  return (
    <IonPage className="user-details-page">
      <IonHeader>
        <Toolbar title='User Details' />
      </IonHeader>
      <IonContent>
        <div className='main-page'>
          <IonCard className="user-details-container">
            <IonCard class="details-box">
              <div className="title-user">
                <h1>User Details</h1>
              </div>
              <IonList class="details-list">
                {user && !editMode ? (
                  <>
                    <IonItem class="details-item">
                      <IonLabel>
                        <strong>First Name:</strong> {user.firstName}
                      </IonLabel>
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel>
                        <strong>Last Name:</strong> {user.lastName}
                      </IonLabel>
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel>
                        <strong>Email:</strong> {email}
                      </IonLabel>
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel>
                        <strong>Password:</strong>
                      </IonLabel>
                      <IonText>
                        ••••••
                      </IonText>
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel>
                        <strong>Phone Number:</strong> {user.phoneNumber}
                      </IonLabel>
                    </IonItem>
                    <IonButton className="login-button" onClick={handleEditClick}>Edit</IonButton>
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <IonItem class="details-item">
                      <IonLabel position="stacked">
                        Email:
                      </IonLabel>
                      <IonInput
                        type="email"
                        value={email}
                        onIonChange={(event) => setEmail(event.detail.value!)}
                      />
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel position="stacked">
                        Current Password:
                      </IonLabel>
                      <IonInput
                        type="password"
                        value={currentPassword}
                        onIonChange={(event) => setCurrentPassword(event.detail.value!)}
                        placeholder="Enter current password"
                      />
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel position="stacked">
                        New Password:
                      </IonLabel>
                      <IonInput
                        type="password"
                        value={newPassword}
                        onIonChange={(event) => setNewPassword(event.detail.value!)}
                        placeholder="Enter new password"
                      />
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel position="stacked">
                        First Name:
                      </IonLabel>
                      <IonInput
                        type="text"
                        value={firstName}
                        onIonChange={(event) => setFirstName(event.detail.value!)}
                      />
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel position="stacked">
                        Last Name:
                      </IonLabel>
                      <IonInput
                        type="text"
                        value={lastName}
                        onIonChange={(event) => setLastName(event.detail.value!)}
                      />
                    </IonItem>
                    <IonItem class="details-item">
                      <IonLabel position="stacked">
                        Phone Number:
                      </IonLabel>
                      <IonInput
                        type="tel"
                        value={phoneNumber}
                        onIonChange={(event) => setPhoneNumber(event.detail.value!)}
                      />
                    </IonItem>
                    <div className="button-group">
                      <IonButton type="submit" className="login-button">Save</IonButton>
                      <IonButton onClick={handleCancelClick} className="login-button">Cancel</IonButton>
                    </div>
                  </form>
                )}
              </IonList>
            </IonCard>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default UserDetails;

