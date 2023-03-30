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
    IonLoading,
    IonCard,
} from "@ionic/react";
import Toolbar from "../components/Toolbar";
import { createPlaylist, getUserPlaylists, getRecentVideos, getVideosByIds, deletePlaylist, getCurrentUser } from "../firebaseConfig";
import VideoVisualizerSmall3 from "../components/VideoVisualizerSmall3";
import VideoVisualizerSmall2 from "../components/VideoVisualizerSmall2";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import "./PlaylistPage.css";
type Video = {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    userId: string;
};

type Playlist = {
    id: string;
    name: string;
    description: string;
    videos: Video[];
};

SwiperCore.use([Navigation]);

const PlaylistPage: React.FC = () => {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [recentVideos, setRecentVideos] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            setIsLoading(true);
            const userPlaylists = await getUserPlaylists();

            const updatedPlaylists = await Promise.all(userPlaylists.map(async (playlist) => {
                const videos = await getVideosByIds(playlist.videos.map((video) => video.id));
                return { ...playlist, videos };
            }));
            setPlaylists(updatedPlaylists);
        };


        const fetchRecentVideos = async () => {
            setIsLoading(true);
            const videos = await getRecentVideos();
            setRecentVideos(videos);
        };

        const fetchCurrentUser = async () => {
            setIsLoading(true);
            const user = await getCurrentUser();
            if (user) {
                setCurrentUserId(user.uid);
            }
        };

        fetchCurrentUser();
        fetchPlaylists();
        fetchRecentVideos();
        setIsLoading(false);
    }, []);

    const handleCreatePlaylist = async () => {
        if (playlistName !== "" && playlistDescription !== "") {
            await createPlaylist(playlistName, playlistDescription, Array.from(selectedVideos));

            const userPlaylists = await getUserPlaylists();

            const updatedPlaylists = await Promise.all(userPlaylists.map(async (playlist) => {
                const videos = await getVideosByIds(playlist.videos.map((video) => video.id));
                return { ...playlist, videos };
            }));

            console.log("Fetched playlists with video data:", updatedPlaylists);
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
        <IonPage style={{
            width: "100vw",
            height: "100vh"
        }}>
            <div className="playlist-video-view">
                <IonHeader>
                    <IonHeader>
                        <Toolbar title="Playlists" />
                    </IonHeader>
                </IonHeader>

                <IonContent style={{ '--background': 'black' }}>
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
                            {/* This is the pop when button is clicked */}
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
                                                            <VideoVisualizerSmall3 video={video}>
                                                                <IonCheckbox
                                                                    onIonChange={() => toggleVideoSelection(video.id)}
                                                                    style={{
                                                                        width: "30px",
                                                                        height: "30px",
                                                                        '--min-height': '60px',
                                                                        '--min-width': '60px',
                                                                    }}
                                                                />
                                                            </VideoVisualizerSmall3>
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
                    <IonLoading isOpen={isLoading} message={"Loading..."} />
                    {/* This is the rest of the page  */}
                    <IonList>
                        {playlists.map((playlist: Playlist, index: number) => (
                            <IonItem key={index}>
                                <div
                                    style={{
                                        width: "100%",
                                        backgroundColor: 'white',
                                        margin: '20px 0',
                                        borderTopLeftRadius: '8px',
                                        borderTopRightRadius: '8px',
                                        borderBottomLeftRadius: '8px',
                                        borderBottomRightRadius: '8px',
                                        padding: '10px',
                                    }}
                                >
                                    <IonLabel>
                                        <div className="playlist-title">
                                            {playlist.name}
                                        </div>
                                        <br />
                                        <div className="playlist-description">
                                            {playlist.description}
                                        </div>
                                        <br />
                                        <div>
                                            <div className="swiper4">
                                                <Swiper
                                                    spaceBetween={20}
                                                    slidesPerView={1}
                                                    loop
                                                    loopedSlides={playlist.videos.length}
                                                    navigation={true}
                                                    mousewheel={true}
                                                    direction={"horizontal"}
                                                >
                                                    {playlist.videos.map((video) => (
                                                        <SwiperSlide key={video.id}
                                                            style={{
                                                                minWidth: '30%', // Set the minimum width
                                                            }}>
                                                            <div className="swiper4">
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: "center",
                                                                    }}
                                                                ><div className="video-feed-4">
                                                                        <VideoVisualizerSmall2 video={video} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        </div>
                                        <IonButton
                                            onClick={async () => {
                                                if (currentUserId) {
                                                    await deletePlaylist(playlist.id, currentUserId);
                                                }
                                                // Refresh the playlists after deletion
                                                const updatedPlaylists = await getUserPlaylists();
                                                setPlaylists(updatedPlaylists);
                                            }}
                                            color="danger"
                                            slot="end"
                                        >
                                            Delete Playlist
                                        </IonButton>
                                    </IonLabel>
                                </div>
                            </IonItem>
                        ))}
                    </IonList>
                    {playlists.length === 0 && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                padding: '20px',
                            }}
                        >
                            <IonLabel
                                style={{
                                    textAlign: 'center',
                                    fontSize: '1.2em',
                                    color: 'grey',
                                }}
                            >
                                No playlists found. Click the button below to create one.
                            </IonLabel>
                        </div>
                    )}
                    <br />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            padding: '20px',
                        }}
                    >
                        <IonButton
                            style={{
                                '--background': 'green',
                                '--color': 'white',
                                '--border-radius': '8px',
                                width: '50%', // Adjust the width to your preference
                                height: '50px', // Adjust the height to your preference
                                padding: '0 20px', // Adjust the padding to your preference
                            }}
                            onClick={() => setShowModal(true)}
                        >
                            Create A New Playlist
                        </IonButton>
                    </div>
                    <br />
                </IonContent>
            </div>
        </IonPage >
    );
};
export default PlaylistPage;