import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Board from "components/Board";
import { GlobalDataProvider, useGlobalDataContext } from "hooks/useGlobalData";
import { GlobalStateProvider } from "hooks/useGlobalState";
import styles from "./App.module.scss";

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

const Nav = () => {
  return (
    <div className={styles.nav}>
      <div className={styles.logo}>Logo</div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <GlobalStateProvider>
        <GlobalDataProvider>
          <Nav />
          <div className={styles.app}>
            <Switch>
              <Route path="/:todo">
                <Board />
              </Route>
              <Route path="/">
                <EmptyState />
              </Route>
            </Switch>
          </div>
        </GlobalDataProvider>
      </GlobalStateProvider>
    </Router>
  );
};

export default App;
