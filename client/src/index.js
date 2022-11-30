import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import { Configuration } from "@react-md/layout"
import { BrowserRouter } from "react-router-dom"
import {SocketContext, socket} from './Helpers/socket'
import './styles/index.scss'

import Layout from "./Layout"

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Configuration>
          <Layout />
        </Configuration>
      </BrowserRouter>
    </SocketContext.Provider>
  </StrictMode>,
)