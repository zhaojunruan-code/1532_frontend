/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Enterprises from "./pages/Enterprises"
import GenerateReport from "./pages/GenerateReport"
import ReportTypes from "./pages/ReportTypes"
import Permissions from "./pages/Permissions"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="enterprises" element={<Enterprises />} />
          <Route path="enterprises/generate/:id" element={<GenerateReport />} />
          <Route path="report-types" element={<ReportTypes />} />
          <Route path="permissions" element={<Permissions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
