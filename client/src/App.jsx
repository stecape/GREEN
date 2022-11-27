import { FC } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./sections/Home/Home";
import Types from "./sections/Types/Types";
import Vars from "./sections/Vars/Vars";
import NoPage from "./sections/NoPage/NoPage";

import io from 'socket.io-client'


const App: FC = () => {
  const socket = io("ws://localhost:3001");
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
