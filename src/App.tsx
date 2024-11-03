/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
import React from 'react';
import { DatePicker } from 'antd';
import { CommonLayout } from './components/layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/dashboard';
import { IncidentsPage } from './pages/incidents';
import { EditIncidentPage } from './pages/incidents/edit';
import { CreateIncidentPage } from './pages/incidents/create/create';
import { FormatErrorPage } from './pages/format_error';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/format_error" element={<FormatErrorPage/>} />
        <Route path="/" element={<CommonLayout/>}>
          <Route index element={<DashboardPage/>} />
          <Route path="/incidents">
            <Route index element={<IncidentsPage/>} />
            <Route path="edit/:id" element={<EditIncidentPage/>} />
            <Route path="create" element={<CreateIncidentPage/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;