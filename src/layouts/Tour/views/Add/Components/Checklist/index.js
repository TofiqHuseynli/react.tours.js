import React from "react";
import uuid from "react-uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ErrorBoundary, Lang, Textarea, useToast } from "fogito-core-ui";
import { AddChecklist, Item, useOutsideAlerter } from "./components";

export const Checklist = ({ params, setParams }) => {
  const toast = useToast();
  const contentRef = React.useRef();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      title: "Checklist",
      add: false,
      addItems: false,
      editTitle: false,
      editItemsTitle: false,
    }
  );

  const onAddChecklist = async (e) => {
    e.preventDefault();
    if (state.title.trim() !== "") {
      let obj = {
        id: uuid(),
        title: state.title,
        items: [],
      };
      setParams({
        ...params,
        checklist: params.checklist.concat([obj]),
      });
      setState({
        editTitle: false,
        title: "",
        add: false,
      });
      setTimeout(() => {
        setState({
          addItems: params.checklist.length,
        });
      }, 20);
    }
  };

  const onDeleteChecklist = (index) => {
    toast
      .fire({
        position: "center",
        toast: false,
        timer: null,
        title: Lang.get("DeleteAlertTitle"),
        text: Lang.get("DeleteAlertDescription"),
        buttonsStyling: false,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonClass: "btn btn-success",
        cancelButtonClass: "btn btn-secondary",
        confirmButtonText: Lang.get("Confirm"),
        cancelButtonText: Lang.get("Cancel"),
      })
      .then(async (res) => {
        if (res?.value) {
          setParams({
            ...params,
            checklist: params.checklist.filter((row, key) => key != index),
          });
        }
      });
  };

  const onEdit = async (e, row, key) => {
    e.preventDefault();
    if (state.title.trim() !== "") {
      setParams({
        ...params,
        checklist: params.checklist.map((x, i) => {
          if (i == key) {
            return { ...x, title: state.title };
          }
          return x;
        }),
      });
      setState({
        editTitle: false,
        title: "",
      });
    }
  };

  const onReorder = async ({ type, source, destination }) => {
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "task") {
      let columnFrom = params.checklist.find(
        (item, key) => item.id === source.droppableId
      );
      let columnTo = params.checklist.find(
        (item, key) => item.id === destination.droppableId
      );

      if (columnFrom === columnTo) {
        let sorted = Array.from(columnFrom.items);
        let [card] = sorted.splice(source.index, 1);
        sorted.splice(destination.index, 0, card);
        setParams({
          ...params,
          checklist: params.checklist.map((item) => {
            if (item.id === columnFrom.id) {
              item.items = sorted;
            }
            return item;
          }),
        });
      } else {
        let sortedFrom = Array.from(columnFrom.items);
        let sortedTo = Array.from(columnTo.items);
        let [card] = sortedFrom.splice(source.index, 1);
        card.items = columnTo.id;
        sortedTo.splice(destination.index, 0, card);
        setParams({
          ...params,
          checklist: params.checklist.map((item) => {
            if (item.id === columnFrom.id) {
              item.items = sortedFrom;
            }
            if (item.id === columnTo.id) {
              item.items = sortedTo;
            }
            return item;
          }),
        });
      }
    } else {
      let sorted = Array.from(params.checklist);
      let [column] = sorted.splice(source.index, 1);
      sorted.splice(destination.index, 0, column);
      setParams({ ...params, checklist: sorted });
    }
  };

  useOutsideAlerter(contentRef, function () {
    setState({
      add: false,
      editItemsTitle: false,
      editTitle: false,
    });
  });

  const escButton = (event) => {
    if (event.keyCode === 27) {
      setState({
        add: false,
        editItemsTitle: false,
        editTitle: false,
        addItems: false,
        title: "",
      });
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", (e) => escButton(e), false);
    return () => {
      document.addEventListener("keydown", (e) => escButton(e), false);
    };
  }, []);

  return (
    <ErrorBoundary>
      <AddChecklist
        state={state}
        setState={setState}
        contentRef={contentRef}
        onAddChecklist={onAddChecklist}
      />
      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId="columns" direction="vertical" type="column">
          {(provided) => (
            <div
              className="d-flex flex-column"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {params.checklist?.map((row, key) => {
                let itemsLength = row.items.length;
                let itemsCompleted = row.items.filter(
                  (x) => !!x.completed
                ).length;
                let percent =
                  itemsLength > 0 ? (itemsCompleted / itemsLength) * 100 : 0;
                return (
                  <div className="position-relative" key={key}>
                    <Draggable draggableId={row.id} index={key} key={row.id}>
                      {(provided, snapshot) => {
                        if (snapshot.isDragging) {
                          provided.draggableProps.style.left =
                            provided.draggableProps.style.offsetLeft;
                          provided.draggableProps.style.top =
                            provided.draggableProps.style.offsetTop;
                        }
                        return (
                          <div
                            className="checklist"
                            key={key}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <button
                              className="btn rounded-circle feather feather-x checklist-delete-icon"
                              onClick={() => onDeleteChecklist(key)}
                            />
                            {state.editTitle === key ? (
                              <form
                                style={{ marginLeft: "2.6rem" }}
                                ref={contentRef}
                                onSubmit={(e) => onEdit(e, row, key)}
                              >
                                <div className="form-group mb-2">
                                  <Textarea
                                    rows="1"
                                    maxLength="300"
                                    defaultValue={row.title}
                                    onChange={(e) =>
                                      setState({ title: e.target.value })
                                    }
                                    placeholder={Lang.get("Title")}
                                    className="form-control"
                                    autoFocus
                                    onFocus={(e) => {
                                      let length = e.target.value.length;
                                      e.target.setSelectionRange(
                                        length,
                                        length
                                      );
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.keyCode === 13) {
                                        e.preventDefault();
                                        onEdit(e, row, key);
                                      }
                                    }}
                                  />
                                </div>
                                <div className="d-flex">
                                  <button className="btn btn-primary px-5">
                                    {Lang.get("Save")}
                                  </button>
                                  <button
                                    className="btn btn-secondary px-5"
                                    onClick={() =>
                                      setState({
                                        editTitle: false,
                                        title: row.title,
                                      })
                                    }
                                    type="button"
                                  >
                                    {Lang.get("Cancel")}
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="checklist-title">
                                <i className="feather feather-check-circle fs-20 " />
                                <button
                                  className="btn shadow-none bg-transparent p-0 mb-0 ml-2 cursor-pointer"
                                  onClick={() => setState({ editTitle: key })}
                                  type="button"
                                >
                                  {Lang.get(row.title)}
                                </button>
                              </div>
                            )}

                            <div className="d-flex align-items-center mt-1">
                              <span
                                className="fw-500 text-nowrap"
                                style={{ minWidth: "2.2rem" }}
                              >
                                {parseInt(percent)}%
                              </span>
                              <div className="checklist-progress ml-2">
                                <div
                                  className="percent"
                                  style={{
                                    width: `${percent}%`,
                                    backgroundColor:
                                      parseInt(percent) == 100
                                        ? "#2dce89"
                                        : "#6CB2E7",
                                  }}
                                />
                              </div>
                            </div>

                            <Droppable droppableId={row.id} type="task">
                              {(provided) => (
                                <div
                                  className="body p-3"
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  <Item
                                    row={row}
                                    index={key}
                                    params={params}
                                    setParams={setParams}
                                    addItemsToggle={state.addItems}
                                    closeAddItemsToggle={() =>
                                      setState({ addItems: false })
                                    }
                                  />
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>

                            <div
                              className="d-flex justify-content-between"
                              style={{ padding: ".5rem", marginLeft: "2.2rem" }}
                            >
                              {state.addItems === key ? (
                                <div />
                              ) : (
                                <button
                                  className="btn btn-secondary px-4 py-2"
                                  type="button"
                                  onClick={() => setState({ addItems: key })}
                                >
                                  {Lang.get("AddAnItem")}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }}
                    </Draggable>
                  </div>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ErrorBoundary>
  );
};
