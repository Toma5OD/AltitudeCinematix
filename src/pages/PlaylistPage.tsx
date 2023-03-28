import React, { useState, useEffect } from "react";
import {
    IonPage,
    IonCol,
    IonRow,
    IonHeader,
    IonContent,
    IonGrid,
    IonTitle,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonModal,
    IonInput,
    IonTextarea,
    IonCheckbox,
} from "@ionic/react";
import Toolbar from "../components/Toolbar";
import { createPlaylist, getUserPlaylists, getRecentVideos } from "../firebaseConfig";
import VideoCard from "../components/VideoVisualizerSmall";

const PlaylistPage: React.FC = () => {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [recentVideos, setRecentVideos] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchPlaylists = async () => {
            const userPlaylists = await getUserPlaylists();
            setPlaylists(userPlaylists);
        };

        const fetchRecentVideos = async () => {
            const videos = await getRecentVideos();
            setRecentVideos(videos);
        };

        fetchPlaylists();
        fetchRecentVideos();
    }, []);

    const handleCreatePlaylist = async () => {
        if (playlistName !== "" && playlistDescription !== "") {
            await createPlaylist(playlistName, playlistDescription, Array.from(selectedVideos));
            const updatedPlaylists = await getUserPlaylists();
            setPlaylists(updatedPlaylists);
            setShowModal(false);
            setPlaylistName("");
            setPlaylistDescription("");
            setSelectedVideos(new Set());
        }
    };

    const toggleVideoSelection = (videoId: string) => {
        const updatedSelectedVideos = new Set(selectedVideos);
        if (selectedVideos.has(videoId)) {
            updatedSelectedVideos.delete(videoId);
        } else {
            updatedSelectedVideos.add(videoId);
        }
        setSelectedVideos(updatedSelectedVideos);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonHeader>
                    <Toolbar title="Playlists" />
                </IonHeader>
            </IonHeader>
            <IonContent style={{
                '--padding-start': '8px',
                '--padding-end': '8px',
                '--padding-top': '8px',
                '--padding-bottom': '8px',
                '--background': 'white',
                '--color': 'black',
                '--border-radius': '8px',
            }}>
                <IonButton style={{
                    '--height': '50px',
                    '--width': '200px',
                    '--background': 'red',
                    '--color': 'white',
                    '--border-radius': '8px',
                    'position': 'fixed',
                    'bottom': '20px',
                    'left': '50%',
                    'transform': 'translate(-50%, 0)',
                }} onClick={() => setShowModal(true)}>Create Playlist</IonButton>
                <IonModal
                    isOpen={showModal}
                    style={{
                        margin: "none",
                        padding: "none",
                        '--width': '70%',
                        '--height': '90%',
                        '--background': 'white',
                        '--border-radius': '16px',
                    }}
                >
                    <IonContent
                        className="recent-videos-scroll-container"
                        scrollY={true}
                        style={{ padding: "none", margin: "none", '--background': 'white' }}
                    >
                        <IonGrid style={{ margin: "none", padding: "none", backgroundColor: "white" }}>
                            <IonRow style={{ padding: "3%", margin: "4%", backgroundColor: "white", borderRadius: "15px", color: "black", border: "4px solid black" }}>
                                <IonCol style={{ backgroundColor: "white" }}>
                                    <IonTitle style={{ color: "black", paddingBottom: "40px", fontSize: "2.7em" }} class="ion-text-center ion-text-uppercase">Create your playlist</IonTitle>
                                    <IonRow style={{ padding: "1%", borderRadius: "15px", backgroundColor: "black" }}>
                                        <IonCol style={{ padding: "1%", borderRadius: "8px", width: "50%", backgroundColor: "black" }} size="7">
                                            <IonRow style={{ color: "black", border: "4px solid white", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}>
                                                <IonCol style={{ padding: "3%", textAlign: "center", backgroundColor: "white", color: "white", border: "4px solid white" }} size="4">
                                                    <IonLabel style={{ backgroundColor: "white", color: "black" }}>Playlist Name</IonLabel>
                                                </IonCol>
                                                <IonCol style={{ padding: "2%", backgroundColor: "white", color: "white", border: "4px solid white" }} >
                                                    <IonInput
                                                        placeholder="Type your playlist name here"
                                                        value={playlistName}
                                                        onIonChange={(e) => setPlaylistName(e.detail.value!)}
                                                        style={{
                                                            "--background": "white",
                                                            "--color": "black",
                                                            alignText: "center",
                                                        }}
                                                    />
                                                </IonCol>
                                            </IonRow>
                                            <IonRow style={{ color: "black", borderTop: "none", border: "4px solid white", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}>
                                                <IonCol style={{ padding: "3%", textAlign: "center", backgroundColor: "white", color: "white", border: "4px solid white", borderTop: "none" }} size="4">
                                                    <IonLabel style={{ color: "black" }}>Description</IonLabel>
                                                </IonCol>
                                                <IonCol style={{ padding: "1%", backgroundColor: "white", color: "white", border: "4px solid white", borderTop: "none" }} >
                                                    <IonTextarea
                                                        placeholder="Type your playlist description here"
                                                        value={playlistDescription}
                                                        onIonChange={(e) => setPlaylistDescription(e.detail.value!)}
                                                        style={{
                                                            "--background": "white",
                                                            "--color": "black",
                                                            alignText: "center",
                                                        }}
                                                    />
                                                </IonCol>
                                            </IonRow>
                                        </IonCol>
                                        <IonCol style={{ alignItems: "center", padding: "1%", backgroundColor: "black", display: "flex", justifyContent: "center" }}>
                                            <IonRow style={{ alignItems: "center", padding: "2%", backgroundColor: "black", color: "black", border: "4px solid black", borderRadius: "15px", display: "flex", justifyContent: "center", gap: "30px" }}>
                                                <IonButton size="large" color="success" onClick={handleCreatePlaylist}>Create Playlist</IonButton>
                                                <IonButton size="large" color="danger" onClick={() => setShowModal(false)}>Cancel</IonButton>
                                            </IonRow>
                                        </IonCol>
                                    </IonRow>
                                </IonCol>
                                <IonRow style={{ width: "100%" }}>
                                    <IonCol style={{ width: "100%", paddingTop: "20px" }}>
                                        <IonRow
                                            style={{
                                                width: "100%",
                                                paddingTop: "20px",
                                                paddingBottom: "20px",
                                                textAlign: "center",
                                                backgroundColor: "white",
                                                color: "black",
                                                borderTop: "2px solid black",
                                                borderBottom: "2px solid black",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <IonLabel
                                                style={{
                                                    textAlign: "center",
                                                    backgroundColor: "white",
                                                    color: "black",
                                                }}
                                            >
                                                Add Recently Uploaded Videos
                                            </IonLabel>
                                        </IonRow>
                                        <IonGrid>
                                            <IonRow>
                                                {recentVideos.map((video, index) => (
                                                    <IonCol
                                                        size="6"
                                                        key={video.id}
                                                        className="video-card-col"
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            padding: "15px",
                                                            backgroundColor: "white",
                                                        }}
                                                    >
                                                        <VideoCard video={video}>
                                                            <IonCheckbox
                                                                onIonChange={() => toggleVideoSelection(video.id)}
                                                                style={{
                                                                    width: "30px",
                                                                    height: "30px",
                                                                    '--min-height': '60px', 
                                                                    '--min-width': '60px', 
                                                                }}
                                                            />
                                                        </VideoCard>
                                                    </IonCol>
                                                ))}
                                            </IonRow>
                                        </IonGrid>
                                    </IonCol>
                                </IonRow>

                            </IonRow>
                        </IonGrid>
                    </IonContent>
                </IonModal>
                <IonList>
                    {playlists.map((playlist, index) => (
                        <IonItem key={index}>
                            <IonLabel>{playlist.name}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};
export default PlaylistPage;