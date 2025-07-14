import { CommonLayout } from './components/layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/dashboard';
import { IssuesPage } from './pages/issues';
import { EditIssuePage } from './pages/issues/edit';
import { WelcomePage } from './pages/welcome';
import { useIssues, useSpecs, useSheets } from './hooks';
import { SpecsPage } from './pages/specs';
import { EditSpecsPage } from './pages/specs/edit';
import { TableHookType, SpecType, IssueType } from './types';

const App = () => {
  const specs: TableHookType<SpecType> = useSpecs();
  const issues: TableHookType<IssueType> = useIssues();
  const sheets = useSheets({specs, issues})

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommonLayout {...sheets}/>}>
          <Route index element={<WelcomePage sheets={sheets} tables={[specs, issues]}/>} />
          <Route path="/dashboard">
            <Route index element={<DashboardPage {...issues}/>} />
          </Route>
          <Route path="/specs">
            <Route index element={<SpecsPage {...specs}/>} />
            <Route path="edit/:id" element={<EditSpecsPage {...specs}/>} />
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