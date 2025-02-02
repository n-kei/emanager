import React from 'react';
import { DatePicker } from 'antd';
import { CommonLayout } from './components/layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/dashboard';
import { IncidentsPage } from './pages/incidents';
import { EditIncidentPage } from './pages/incidents/edit';
import { CreateIncidentPage } from './pages/incidents/create';
import { FormatErrorPage } from './pages/format_error';
import { VersionsPage } from './pages/versions';
import { useIncidents } from './hooks';

const App = () => {
  const [incidents, {addIncident, editIncident, deleteIncident}] = useIncidents();

  return (
    <Router>
      <Routes>
        <Route path="/format_error" element={<FormatErrorPage/>} />
        <Route path="/" element={<CommonLayout incidents={incidents}/>}>
          <Route index element={<DashboardPage incidents={incidents}/>} />
          <Route path="/incidents">
            <Route index element={<IncidentsPage incidents={incidents} deleteIncident={deleteIncident}/>} />
            <Route path="edit/:id" element={<EditIncidentPage incidents={incidents} editIncident={editIncident}/>} />
            <Route path="create" element={<CreateIncidentPage incidents={incidents} addIncident={addIncident}/>} />
          </Route>
          <Route path="/versions" element={<VersionsPage/>} />
            <Route index element={<VersionsPage/>} />
          </Route>
      </Routes>
    </Router>
  );
};

export default App;