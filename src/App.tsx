import React from 'react';
import { DatePicker } from 'antd';
import { CommonLayout } from './components/layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/dashboard';
import { IssuesPage } from './pages/issues';
import { EditIssuePage } from './pages/issues/edit';
import { CreateIssuePage } from './pages/issues/create';
import { WelcomePage } from './pages/welcome';
import { useIssues } from './hooks';

const App = () => {
  const [issues, {addIssue, editIssue, deleteIssue, loadIssues, saveIssues}] = useIssues();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommonLayout issues={issues} loadIssues={loadIssues} saveIssues={saveIssues}/>}>
          <Route index element={<WelcomePage loadIssues={loadIssues}/>} />
          <Route path="/dashboard">
            <Route index element={<DashboardPage issues={issues}/>} />
          </Route>
          <Route path="/issues">
            <Route index element={<IssuesPage issues={issues} deleteIssue={deleteIssue}/>} />
            <Route path="edit/:id" element={<EditIssuePage issues={issues} editIssue={editIssue}/>} />
            <Route path="create" element={<CreateIssuePage issues={issues} addIssue={addIssue}/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;