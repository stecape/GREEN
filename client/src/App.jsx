import { Route, Routes } from "react-router-dom"
import { MessageQueue } from "@react-md/alert"
import { NestedDialogContextProvider } from "@react-md/dialog"
import Home from "./sections/Home/Home"
import Types from "./sections/Types/Types"
import Um from "./sections/Um/Um"
import LogicState from "./sections/LogicState/LogicState"
import Vars from "./sections/Vars/Vars"
import Tags from "./sections/Tags/Tags"
import NoPage from "./sections/NoPage/NoPage"
import {CtxProvider} from "./Helpers/CtxProvider"

function App () {
  return (
  <>
    <NestedDialogContextProvider>
    <MessageQueue id="notify"  duplicates="allow">
    <CtxProvider>
    <Routes>
          <Route index element={<Home />} />
          <Route path="types" element={<Types/>} />
          <Route path="um" element={<Um/>} />
          <Route path="logicState" element={<LogicState/>} />
          <Route path="vars" element={<Vars/>} />
          <Route path="tags" element={<Tags/>} />
          <Route path="*" element={<NoPage />} />
    </Routes>
    </CtxProvider>
    </MessageQueue>
    </NestedDialogContextProvider>
  </>
)}
export default App
