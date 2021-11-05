import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Board from "components/Board";
import { GlobalDataProvider, useGlobalDataContext } from "hooks/useGlobalData";
import {
  GlobalStateProvider,
  useGlobalStateContext,
} from "hooks/useGlobalState";
import styles from "./App.module.scss";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import PrimarySearchAppBar from "utils/components/SearchBar";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

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
  const { isShowingKanban, setIsShowingKanban } = useGlobalStateContext();
  return (
    <AppBar position="static" className={styles.nav}>
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          2doos
        </Typography>
        <PrimarySearchAppBar />
        <IconButton
          color="inherit"
          onClick={() => {
            setIsShowingKanban(!isShowingKanban);
          }}
        >
          {isShowingKanban ? <TableChartOutlinedIcon /> : <TableChartIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
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
