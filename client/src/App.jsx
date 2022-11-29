import { Route, Routes } from "react-router-dom";

import Home from "./sections/Home/Home";
import Types from "./sections/Types/Types";
import Vars from "./sections/Vars/Vars";
import NoPage from "./sections/NoPage/NoPage";

import io from 'socket.io-client'


function App () {
  const socket = io("ws://localhost:3001",{transports: ['websocket'], upgrade: false});
  return (
  <>
    <Routes>
          <Route index element={<Home />} />
          <Route path="types" element={<Types socket={socket}/>} />
          <Route path="vars" element={<Vars socket={socket}/>} />
          <Route path="*" element={<NoPage />} />
    </Routes>
  </>
)};
export default App;
