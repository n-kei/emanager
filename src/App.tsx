import { CommonLayout } from './components/layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/dashboard';
import { IssuesPage } from './pages/issues';
import { EditIssuePage } from './pages/issues/edit';
import { WelcomePage } from './pages/welcome';
import { useIssues } from './hooks';

const App = () => {
  const issues = useIssues();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommonLayout {...issues}/>}>
          <Route index element={<WelcomePage {...issues}/>} />
          <Route path="/dashboard">
            <Route index element={<DashboardPage {...issues}/>} />
          </Route>
          <Route path="/issues">
            <Route index element={<IssuesPage {...issues}/>} />
            <Route path="edit/:id" element={<EditIssuePage {...issues}/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;