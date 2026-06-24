import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { ChatView } from "./components/ChatView";
import { RoadmapView } from "./components/RoadmapView";
import { GLOBAL_CSS } from "./data/constants";
import { useAppContext } from "./context/AppContext";

export default function App() {
    const { user } = useAuth();
    const { userProfile } = useAppContext();

    // Determine current screen state based on data presence
    let screen = "login";
    if (user) {
        if (!userProfile.preferredCareer) {
            screen = "chat";
        } else {
            screen = "roadmap";
        }
    }

    return (
        <>
            <style>{GLOBAL_CSS}</style>

            {screen === "login" && <LoginPage />}

            {screen === "chat" && (
                <ChatView userName={user.username} />
            )}

            {screen === "roadmap" && (
                <RoadmapView
                    userName={user.username}
                    profile={userProfile}
                    initialCareer={userProfile.preferredCareer}
                />
            )}
        </>
    );
}