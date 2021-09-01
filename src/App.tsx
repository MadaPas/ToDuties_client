import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Dashboard from './components/Home/Home';
import CreateDuty from './components/Forms/AddDuty';
import AddSubtask from './components/Forms/AddTask';
import EditTask from './components/Forms/EditDuty';
import DutyPage from './components/Duties/DutyPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          
          <Route exact path="/">
            <Dashboard />
          </Route>

          <Route path="/new-todo">
            <CreateDuty />
          </Route>

          <Route path="/task/:taskId">
            <DutyPage />
          </Route>

          <Route path="/edit-task/:taskId">
            <EditTask />
          </Route>

          <Route path="/add-subtask/:parentId">
            <AddSubtask />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
