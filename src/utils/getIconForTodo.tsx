import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { TodoTree } from "types";
import {
  todoTreeIsBoard,
  todoTreeIsFolder,
  todoTreeIsProject,
} from "./selectors";

const getIconForTodo = (todoTree: TodoTree) => {
  if (todoTreeIsBoard(todoTree)) {
    return DashboardIcon;
  }
  if (todoTreeIsProject(todoTree)) {
    return FolderOpenIcon;
  }

  if (todoTreeIsFolder(todoTree)) {
    return ListIcon;
  }

  return CheckBoxIcon;
};

export default getIconForTodo;
