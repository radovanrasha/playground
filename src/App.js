import "./App.css";
import { ThemeProvider } from "./ThemeContext";
import { SocketProvider } from "./SocketContext";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Home from "./pages/Home";
import Memory from "./pages/MemoryGame/Memory";
import MemorySoloGame from "./pages/MemoryGame/MemorySoloGame";
import MemoryOnlineHome from "./pages/OnlineMemoryGame/Home";
import SingleRoom from "./pages/OnlineMemoryGame/SingleRoomGame";

function App() {
  return (
    <>
      <SocketProvider>
        <ThemeProvider>
          <NavBar></NavBar>
          <div>
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route path="/memory" element={<Memory></Memory>}></Route>
              <Route
                path="/memory-sologame"
                element={<MemorySoloGame></MemorySoloGame>}
              ></Route>
              <Route
                path="/memory-multiplayer"
                element={<MemoryOnlineHome></MemoryOnlineHome>}
              ></Route>
              <Route
                path="/memory-multiplayer/:id"
                element={<SingleRoom></SingleRoom>}
              ></Route>
              <Route path="/about" element={<About></About>}></Route>
              <Route path="/*" element={<Home></Home>}></Route>
            </Routes>
            <Footer></Footer>
          </div>
        </ThemeProvider>
      </SocketProvider>
    </>
  );
}

export default App;
