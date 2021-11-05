import { Redirect } from "react-router-dom";
import { useGlobalDataContext } from "hooks/useGlobalData";
import styles from "./Board.module.scss";
import ColOne, { ProjectInner } from "./components/ColOne";
import ColTwo, {
  TodoCellInner as TodoCellInnerColTwo,
} from "./components/ColTwo";
import ColThree, {
  SearchScreen,
  TodoCellInner as TodoCellInnerColThree,
} from "./components/ColThree";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
  rectIntersection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useGlobalStateContext } from "hooks/useGlobalState";
import { get } from "lodash";
import {
  ActiveDrag,
  DD_TYPES,
  getDragEventData,
  removePrefix,
  TG_ALL,
  TodoTypes,
} from "types";
import useCurrentTodo from "hooks/useCurrentTodo";
import { getAllLeafIds } from "utils/selectors";
import ColumnInner from "utils/components/ColumnInner";
import classNames from "classnames";

const Projects = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { todoId: currentTodoId } = useCurrentTodo();
  const { setActiveDrag, clearActiveDrag, activeDrag, isShowingKanban } =
    useGlobalStateContext();
  const {
    todoGroupsTree,
    reorderTodos,
    moveIntoFolder,
    editTodo,
    editTodos,
    reorderGroupTodos,
    todoDict,
  } = useGlobalDataContext();

  const moveTodoGroup = (todoId: string, groupId: string) => {
    const leafIds = getAllLeafIds(todoDict[todoId]);

    editTodos(leafIds, (todo, index) => {
      if (groupId !== TG_ALL && !todoGroupsTree[groupId]) {
        return todo;
      }
      return {
        timelineGroup: groupId === TG_ALL ? undefined : groupId,
        orderIndex: todoGroupsTree[groupId].length + index,
      };
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => {
        setActiveDrag(event.active);
      }}
      onDragOver={(event) => {
        const { active, over } = event;

        if (!over) {
          return;
        }

        const activeData = getDragEventData(active);
        const overData = getDragEventData(over);

        if (activeData.type === DD_TYPES.todoTimeline) {
          if (activeData.containerId === overData.containerId) {
            return;
          } else if (overData.containerId) {
            console.log("move ovr container inner", overData.containerId);
            moveTodoGroup(activeData.id, overData.containerId);
          } else if (activeData.containerId !== overData.id) {
            console.log("move ovr container", overData.id);
            moveTodoGroup(activeData.id, overData.id);
          }
        }
      }}
      onDragEnd={(event) => {
        const { active, over } = event;

        clearActiveDrag();

        if (!over) {
          return;
        }

        const activeData = getDragEventData(active);
        const overData = getDragEventData(over);

        if (activeData.type === DD_TYPES.project) {
          if (overData.type === DD_TYPES.project) {
            reorderTodos(activeData.id, overData.id);
          } else if (
            overData.type === DD_TYPES.todoTimelineGroup ||
            overData.type === DD_TYPES.todoTimeline
          ) {
            const groupId = overData.containerId || overData.id;
            moveTodoGroup(activeData.id, groupId);
          }
        } else if (activeData.type === DD_TYPES.todoProject) {
          if (overData.type === DD_TYPES.todoProject) {
            if (activeData.containerId === overData.containerId) {
              reorderTodos(activeData.id, overData.id);
            } else if (
              activeData.containerId?.startsWith(TodoTypes.todo) &&
              overData.containerId?.startsWith(TodoTypes.folder)
            ) {
              moveIntoFolder(activeData.id, overData.id);
            }
          } else if (overData.type === DD_TYPES.project) {
            moveIntoFolder(active.id, overData.id);
          } else if (
            overData.type === DD_TYPES.todoTimelineGroup ||
            overData.type === DD_TYPES.todoTimeline
          ) {
            const groupId = overData.containerId || overData.id;
            moveTodoGroup(activeData.id, groupId);
          }
        } else if (activeData.type === DD_TYPES.todoTimeline) {
          if (overData.type === DD_TYPES.todoTimeline && overData.containerId) {
            reorderGroupTodos(
              activeData.containerId!,
              activeData.id,
              overData.id
            );
          }
        }
      }}
    >
      {!isShowingKanban && <ColOne className={styles.row1} />}
      {!isShowingKanban && (
        <ColTwo className={styles.row2} key={currentTodoId} />
      )}
      <ColThree
        className={classNames(styles.row3, {
          [styles.isShowingKanban]: isShowingKanban,
        })}
      />
      <DragOverlay dropAnimation={null}>
        {activeDrag ? (
          activeDrag.type === DD_TYPES.project ? (
            <ProjectInner id={activeDrag.id} />
          ) : activeDrag.type === DD_TYPES.todoProject ? (
            <TodoCellInnerColTwo id={activeDrag.id} />
          ) : (
            <TodoCellInnerColThree isDragOverlay id={activeDrag.id} />
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const Board = () => {
  const { todoTree } = useCurrentTodo();
  const { activeSearch, isSearchFocused } = useGlobalStateContext();

  if (!todoTree) {
    return <Redirect to="/" />;
  }

  if (activeSearch || isSearchFocused) {
    return <SearchScreen search={activeSearch} />;
  }

  return (
    <div className={styles.container}>
      <Projects />
    </div>
  );
};

export default Board;
