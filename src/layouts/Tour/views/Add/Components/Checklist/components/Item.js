import React from "react";
import uuid from "react-uuid";
import Tooltip from "antd/lib/tooltip";
import { Draggable } from "react-beautiful-dnd";
import {
  ErrorBoundary,
  InputCheckbox,
  Textarea,
  Lang,
  useModal,
} from "fogito-core-ui";
import { useOutsideAlerter } from "./useOutsideAlerter";

export const Item = React.memo(
  ({ row, index, params, setParams, addItemsToggle, closeAddItemsToggle }) => {
    const modal = useModal();
    const contentRef = React.useRef();
    const itemAddRef = React.useRef();
    const itemAddInputRef = React.useRef();
    const [state, setState] = React.useReducer(
      (prevState, newState) => ({ ...prevState, ...newState }),
      {
        editItemsTitle: false,
        addItemsTitle: false,
        selectedItem: "",
        title: "",
        itemToggleVisible: false,
        editTitle: "",
      }
    );

    const onChangeCompleted = async (value, item, key) => {
      setParams({
        ...params,
        checklist: params.checklist.map((x, i) => {
          if (i == index) {
            return {
              ...x,
              items: x.items.map((c, d) => {
                if (d == key) {
                  return { ...c, completed: !value ? 0 : 1 };
                }
                return c;
              }),
            };
          }
          return x;
        }),
      });
    };

    const onAddChecklistItem = async (e, row, index) => {
      e.preventDefault();
      let array = state.title?.split("\n");
      let newData = [];
      for (const title of array) {
        if (title.trim() !== "") {
          itemAddInputRef.current?.querySelector("textarea")?.focus();
          newData.push({
            id: uuid(),
            title: title,
            completed: 0,
            due_date: false,
            user: false,
          });
          setParams({
            ...params,
            checklist: params.checklist.map((x, i) => {
              if (i == index) {
                return {
                  ...x,
                  items: x.items.concat([...newData]),
                };
              }
              return { ...x };
            }),
          });
        }
      }
      setState({ title: "" });
    };

    const onDeleteChecklistItem = (key) => {
      let arr = params.checklist;
      arr[index].items.splice(key, 1);
      setParams({ ...params, checklist: arr });
      setState({ itemToggleVisible: false });
    };

    const onEdit = async (e, key, item) => {
      e.preventDefault();
      if (state.editTitle.trim() !== "") {
        setParams({
          ...params,
          checklist: params.checklist.map((x, i) => {
            if (i == index) {
              return {
                ...x,
                items: x.items.map((c, d) => {
                  if (d == key) {
                    return {
                      ...c,
                      title: state.editTitle,
                      completed: item.completed,
                    };
                  }
                  return c;
                }),
              };
            }
            return x;
          }),
        });
        setState({ editItemsTitle: false });
      }
    };

    useOutsideAlerter(contentRef, function () {
      setState({ editItemsTitle: false });
    });

    useOutsideAlerter(itemAddRef, function () {
      closeAddItemsToggle();
    });

    const escButton = (event) => {
      if (event.keyCode === 27) {
        setState({
          editItemsTitle: false,
          addItemsTitle: false,
          title: "",
        });
        modal.hide("convert");
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
        {row.items.map((item, key) => (
          <Draggable draggableId={item.id} index={key} key={item.id}>
            {(provided, snapshot) => {
              if (snapshot.isDragging) {
                provided.draggableProps.style.left =
                  provided.draggableProps.style.offsetLeft;
                provided.draggableProps.style.top =
                  provided.draggableProps.style.offsetTop;
              }
              return (
                <div className="position-relative" key={key}>
                  <div {...provided.draggableProps} ref={provided.innerRef}>
                    <div className="checklist-line">
                      <div className="form-check w-100">
                        <div className="d-flex align-items-center">
                          <img
                            {...provided.dragHandleProps}
                            src={`${process.env.publicPath}/assets/icons/grid.svg`}
                            alt=""
                            style={{ width: 13 }}
                            className="mr-2"
                          />
                          <InputCheckbox
                            onChange={(e) =>
                              e.stopPropagation() +
                              onChangeCompleted(e.target.checked, item, key)
                            }
                            checked={item.completed}
                          />
                        </div>
                        {state.editItemsTitle === key ? (
                          <form
                            ref={contentRef}
                            onSubmit={(e) => onEdit(e, key, item)}
                            style={{ width: "90%" }}
                            className="ml-2"
                          >
                            <div className="form-group mb-2">
                              <Textarea
                                rows="1"
                                maxLength="300"
                                defaultValue={item.title}
                                onChange={(e) =>
                                  setState({ editTitle: e.target.value })
                                }
                                placeholder={Lang.get("Title")}
                                className="form-control"
                                autoFocus
                                onFocus={(e) => {
                                  let length = e.target.value.length;
                                  e.target.setSelectionRange(length, length);
                                }}
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    e.preventDefault();
                                    onEdit(e, key, item);
                                  }
                                }}
                              />
                            </div>
                            <div className="d-flex">
                              <button
                                className="btn btn-primary px-5"
                                type="submit"
                              >
                                {Lang.get("Save")}
                              </button>
                              <button
                                className="btn btn-secondary px-5"
                                type="button"
                                onClick={() => {
                                  setState({
                                    editItemsTitle: false,
                                    title: "",
                                  });
                                  setParams({
                                    ...params,
                                    checklist: params.checklist.map((x, i) => {
                                      if (i == index) {
                                        return {
                                          ...x,
                                          items: x.items.map((c, d) => {
                                            if (d == key) {
                                              return {
                                                ...c,
                                                title: item.title,
                                              };
                                            }
                                            return c;
                                          }),
                                        };
                                      }
                                      return x;
                                    }),
                                  });
                                }}
                              >
                                {Lang.get("Cancel")}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => {
                              setState({
                                editItemsTitle: key,
                                editTitle: item.title,
                              });
                              closeAddItemsToggle();
                            }}
                            className="btn btn-block shadow-none bg-transparent p-0 ml-2"
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-all",
                              textAlign: "left",
                            }}
                          >
                            {item.title}
                          </button>
                        )}
                      </div>
                      {state.editItemsTitle !== key && (
                        <div className="d-flex">
                          <Tooltip
                            trigger="click"
                            open={state.itemToggleVisible === key}
                            onOpenChange={(visible) =>
                              setState({ itemToggleVisible: visible })
                            }
                            title={
                              <div className="d-flex px-3 py-3">
                                <button
                                  className="btn btn-primary px-4 py-0"
                                  onClick={() => onDeleteChecklistItem(key)}
                                >
                                  {Lang.get("Yes")}
                                </button>
                                <button
                                  className="btn btn-danger px-4 py-0"
                                  onClick={() =>
                                    setState({ itemToggleVisible: false })
                                  }
                                >
                                  {Lang.get("No")}
                                </button>
                              </div>
                            }
                          />
                          <button
                            className="btn shadow-none bg-transparent feather feather-x text-danger fs-18 p-0 close"
                            onClick={(e) => {
                              e.stopPropagation();
                              setState({ itemToggleVisible: key });
                            }}
                            type="button"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          </Draggable>
        ))}
        {addItemsToggle === index && (
          <form
            onSubmit={(e) => onAddChecklistItem(e, row, index)}
            style={{ marginLeft: "2.6rem" }}
            ref={itemAddRef}
          >
            <div className="form-group mb-1" ref={itemAddInputRef}>
              <Textarea
                className="form-control mr-2 mt-2"
                autoFocus
                value={state.title}
                placeholder={Lang.get("Title")}
                onChange={(e) => setState({ title: e.target.value })}
                rows="1"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    e.preventDefault();
                    onAddChecklistItem(e, row, index);
                  }
                }}
              />
            </div>
            <div className="d-flex mt-2">
              <button className="btn btn-primary px-5 py-2">
                {Lang.get("Save")}
              </button>
              <button
                className="btn btn-secondary px-5 py-2"
                onClick={closeAddItemsToggle}
                type="button"
              >
                {Lang.get("Cancel")}
              </button>
            </div>
          </form>
        )}
      </ErrorBoundary>
    );
  }
);
