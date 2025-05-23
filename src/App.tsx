import React from 'react';
import { DatePicker } from 'antd';
import { CommonLayout } from './components/layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/dashboard';
import { IssuesPage } from './pages/issues';
import { EditIssuePage } from './pages/issues/edit';
import { WelcomePage } from './pages/welcome';
import { useIssues } from './hooks';

const App = () => {
  const [issues, {addIssue, addEmptyIssue, editIssue, deleteIssue, newIssues, loadIssues, saveIssues}] = useIssues();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommonLayout issues={issues} loadIssues={loadIssues} saveIssues={saveIssues}/>}>
          <Route index element={<WelcomePage loadIssues={loadIssues} newIssues={newIssues}/>} />
          <Route path="/dashboard">
            <Route index element={<DashboardPage issues={issues}/>} />
          </Route>
          <Route path="/issues">
            <Route index element={<IssuesPage issues={issues} addEmptyIssue={addEmptyIssue} deleteIssue={deleteIssue} editIssue={editIssue}/>} />
            <Route path="edit/:id" element={<EditIssuePage issues={issues} editIssue={editIssue}/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;