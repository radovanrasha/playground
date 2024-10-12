import "./App.css";
import { ThemeProvider } from "./ThemeContext";
import { SocketProvider } from "./SocketContext";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Home from "./pages/Home";
import Memory from "./pages/MemoryGame/Memory";
import Battleship from "./pages/BattleshipGame/Battleship";
import MemorySoloGame from "./pages/MemoryGame/MemorySoloGame";
import MemoryOnlineHome from "./pages/OnlineMemoryGame/Home";
import SingleRoom from "./pages/OnlineMemoryGame/SingleRoomGame";
import BattleshipOnlineHome from "./pages/BattleshipGame/BattleshipOnlineHome";
import SingleRoomBattleship from "./pages/BattleshipGame/SingleRoomGame";

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
                path="/battleship"
                element={<Battleship></Battleship>}
              ></Route>
              <Route
                path="/battleship-multiplayer"
                element={<BattleshipOnlineHome></BattleshipOnlineHome>}
              ></Route>
              <Route
                path="/battleship-multiplayer/:id"
                element={<SingleRoomBattleship></SingleRoomBattleship>}
              ></Route>
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
