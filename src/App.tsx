import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import DefaultLayout from "./components/layouts/DefaultLayout";
import PrivateLayout from "./components/layouts/PrivateLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { AuthProvider } from "./provider/AuthProvider";
import ChatLayout from "./components/layouts/ChatLayout";
import ChatChannelPage from "./pages/chat/ChatChannelPage";
import ChatHomePage from "./pages/chat/ChatHomePage";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route element={<DefaultLayout />}>
              <Route index element={<HomePage />} />
              <Route element={<PrivateLayout />}>
                <Route path="dashboard" element={<DashboardPage />}></Route>
                <Route path="chat" element={<ChatLayout />}>
                  <Route index element={<ChatHomePage />} />
                  <Route
                    path=":channelId"
                    element={<ChatChannelPage />}
                  ></Route>
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
