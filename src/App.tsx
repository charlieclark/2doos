import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Board from "components/Board";
import { GlobalDataProvider, useGlobalDataContext } from "hooks/useGlobalData";
import { GlobalStateProvider } from "hooks/useGlobalState";

const EmptyState = () => {
  const { todoTreeArray, addTodo } = useGlobalDataContext();
  return (
    <>
      {todoTreeArray.length ? (
        <Redirect to={`/${todoTreeArray[0].id}`} />
      ) : (
        <div
          onClick={() => {
            addTodo(undefined, { name: "My First Project" });
          }}
        >
          Create first project
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <GlobalStateProvider>
        <GlobalDataProvider>
          <Switch>
            <Route path="/:todo">
              <Board />
            </Route>
            <Route path="/">
              <EmptyState />
            </Route>
          </Switch>
        </GlobalDataProvider>
      </GlobalStateProvider>
    </Router>
  );
};

export default App;
