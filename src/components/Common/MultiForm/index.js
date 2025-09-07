import React from "react";
// import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { TableHead, TableBody } from "./components";
import { Product, Service } from "./views";
import { ErrorBoundary, Lang, Popup, useModal, useToast } from "fogito-core-ui";
import uuid from "react-uuid";

export const MultiForm = ({ state, params, setParams, setState }) => {
  const modal = useModal();
  const toast = useToast();

  const [isEditingInput, setIsEditingInput] = React.useState(false);

  const onAddItem = (type) => {
    const updatedItems = [...params?.accommodations];
    if (updatedItems?.length) {
      updatedItems.map((item, index) => (updatedItems[index].active = false));
    }
    updatedItems.push({
      type,
      sub_id: uuid(),
      id: uuid(),
      active: true,
      description: "",
      room_type: params.accommodations.room_type,
      unit: "",
    });
    setParams({
      ...params,
      accommodations: updatedItems,
    });
    
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedRows = Array.from(params.accommodations);
    const [movedRow] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, movedRow);
    // setParams({ items: reorderedRows });
    setParams({
      ...params,
      accommodations: reorderedRows,
    });
  };

  return (
    <ErrorBoundary>
      {/* <Popup
        show={modal.modals.includes("product")}
        title={Lang.get("Product")}
        size="lg"
        onClose={() => modal.hide("product")}
      >
        <Product
          onClose={() => modal.hide("product")}
          product_filters={state.options?.product_filters}
          params={params}
          setParams={setParams}
        />
      </Popup>
      <Popup
        show={modal.modals.includes("service")}
        title={Lang.get("Service")}
        size="md"
        onClose={() => modal.hide("service")}
      >
        <Service
          onClose={() => modal.hide("service")}
          params={params}
          setParams={setParams}
        />
      </Popup> */}

      <div className="d-flex flex-column draggable-inputs-container">
        <div className="draggable-table">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="table" direction="vertical">
              {(provided) => (
                <div
                  className="t-main"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <TableHead params={params} />
                  <TableBody
                    state={state}
                    params={params}
                    setParams={setParams}
                    provided={provided}
                    setState={setState}
                  />
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <div className="d-flex justify-content-between my-4">
        <div>
          <button
            type="button"
            className="btn btn-secondary py-0"
            onClick={() => onAddItem("add")}
          >
            + {Lang.get("Add")}
          </button>
          {/* {!!params.user && (
            <>
              <button
                type="button"
                className="btn btn-secondary py-0"
                onClick={() => modal.show("product")}
              >
                + {Lang.get("Product")}
              </button>
              <button
                type="button"
                className="btn btn-secondary py-0"
                onClick={() => modal.show("service")}
              >
                + {Lang.get("Service")}
              </button>
            </>
          )} */}
        </div>
      </div>
      {/* RESULT */}
    </ErrorBoundary>
  );
};
