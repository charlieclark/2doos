import { Redirect } from "react-router-dom";
import { useGlobalDataContext } from "hooks/useGlobalData";
import styles from "./Board.module.scss";
import ColOne, { ProjectInner } from "./components/ColOne";
import ColTwo, { TodoCellInner } from "./components/ColTwo";
import ColThree from "./components/ColThree";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useGlobalStateContext } from "hooks/useGlobalState";
import { get } from "lodash";
import { TodoTypes } from "types";
import useCurrentTodo from "hooks/useCurrentTodo";

const Projects = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { todoId: currentTodoId } = useCurrentTodo();
  const { setActiveDragTodoId, activeDragTodoId } = useGlobalStateContext();
  const { reorderTodos, moveIntoFolder } = useGlobalDataContext();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        console.log("start", event.active.id);
        setActiveDragTodoId(event.active.id);
      }}
      onDragOver={(event) => {
        const { active, over } = event;

        if (!over) {
          return;
        }

        return;
      }}
      onDragEnd={(event) => {
        const { active, over } = event;

        console.log("drag end");

        setActiveDragTodoId(undefined);

        if (!over) {
          return;
        }

        const containerPath = "data.current.sortable.containerId";
        const folderPath = "data.current.folderId";

        if (active.id.startsWith("project")) {
          if (over.id.startsWith("project")) {
            reorderTodos(
              active.id.replace("project-", ""),
              over.id.replace("project-", "")
            );
          }
        } else if (get(active, containerPath) === get(over, containerPath)) {
          reorderTodos(active.id, over.id);
        } else if (
          get(active, containerPath, "").startsWith(TodoTypes.todo) &&
          get(over, containerPath, "").startsWith(TodoTypes.folder)
        ) {
          console.log("move into folder");
          moveIntoFolder(active.id, over.id);
        } else if (get(over, folderPath)) {
          moveIntoFolder(active.id, get(over, folderPath));
        }
      }}
    >
      <div className={styles.row1}>
        <ColOne />
      </div>
      <div className={styles.row2}>
        <ColTwo key={currentTodoId} />
      </div>
      <DragOverlay>
        {activeDragTodoId ? (
          activeDragTodoId.startsWith("project") ? (
            <ProjectInner id={activeDragTodoId} />
          ) : (
            <TodoCellInner id={activeDragTodoId} />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const Board = () => {
  const { todoTree } = useCurrentTodo();
  if (!todoTree) {
    return <Redirect to="/" />;
  }
  return (
    <div className={styles.container}>
      <Projects />
      <div className={styles.row3}>
        <ColThree />
      </div>
    </div>
  );
};

export default Board;
