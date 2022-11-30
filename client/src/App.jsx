import { Route, Routes } from "react-router-dom"
import Home from "./sections/Home/Home"
import Types from "./sections/Types/Types"
import Vars from "./sections/Vars/Vars"
import NoPage from "./sections/NoPage/NoPage"

function App () {
  return (
  <>
    <Routes>
          <Route index element={<Home />} />
          <Route path="types" element={<Types/>} />
          <Route path="vars" element={<Vars/>} />
          <Route path="*" element={<NoPage />} />
    </Routes>
  </>
)}
export default App
