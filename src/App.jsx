import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import FlowAIndex from './flows/flow-a/FlowAIndex'
import FlowARooms from './flows/flow-a/Rooms'
import FlowAServices from './flows/flow-a/Services'
import FlowAConfirmation from './flows/flow-a/Confirmation'

import FlowBIndex from './flows/flow-b/FlowBIndex'
import FlowBRooms from './flows/flow-b/Rooms'
import FlowBServices from './flows/flow-b/Services'
import FlowBConfirmation from './flows/flow-b/Confirmation'

import FlowCIndex from './flows/flow-c/FlowCIndex'
import FlowCRooms from './flows/flow-c/Rooms'
import FlowCServices from './flows/flow-c/Services'
import FlowCConfirmation from './flows/flow-c/Confirmation'

import FlowDIndex from './flows/flow-d/FlowDIndex'
import FlowDChat from './flows/flow-d/Chat'
import FlowDRecommendation from './flows/flow-d/Recommendation'
import FlowDConfirmation from './flows/flow-d/Confirmation'

import Home from './Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/flow-a" element={<FlowAIndex />}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<FlowARooms />} />
          <Route path="services" element={<FlowAServices />} />
          <Route path="confirmation" element={<FlowAConfirmation />} />
        </Route>

        <Route path="/flow-b" element={<FlowBIndex priced={false} />}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<FlowBRooms priced={false} />} />
          <Route path="services" element={<FlowBServices />} />
          <Route path="confirmation" element={<FlowBConfirmation />} />
        </Route>

        <Route path="/flow-b-priced" element={<FlowBIndex priced={true} />}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<FlowBRooms priced={true} />} />
          <Route path="services" element={<FlowBServices />} />
          <Route path="confirmation" element={<FlowBConfirmation />} />
        </Route>

        <Route path="/flow-c" element={<FlowCIndex />}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<FlowCRooms />} />
          <Route path="services" element={<FlowCServices />} />
          <Route path="confirmation" element={<FlowCConfirmation />} />
        </Route>

        <Route path="/flow-d" element={<FlowDIndex />}>
          <Route index element={<Navigate to="chat" replace />} />
          <Route path="chat" element={<FlowDChat />} />
          <Route path="recommendation" element={<FlowDRecommendation />} />
          <Route path="confirmation" element={<FlowDConfirmation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
