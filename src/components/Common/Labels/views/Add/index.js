import React from "react";
import { ErrorBoundary, Lang, Popup, useModal, useToast } from "fogito-core-ui";
import { List } from "./components";

export const Add = React.memo(({ params, setParams }) => {
  const toast = useToast();
  const modal = useModal();
  const onDelete = async (row) => {
    setParams({
      ...params,
      labels: params.labels.filter((x) => x.id !== row.id),
    });
    if (response) {
      toast.fire({ icon: "success", title: response.description });
    }
  };

  return (
    <ErrorBoundary>
      <Popup
        show={modal.modals.includes("edit")}
        title={Lang.get("Labels")}
        onClose={() => modal.hide("edit")}
        size="md"
      >
        <List params={params} setParams={setParams} />
      </Popup>
      <div className="form-group">
        <label className="mb-0">{Lang.get("Labels")}</label>
        <div className="label-row">
          {!!params.labels.length &&
            params.labels.map((row, key) => (
              <div className="item" key={key}>
                <button
                  className="btn rounded-circle"
                  style={{ backgroundColor: row.color }}
                  onClick={() => onDelete(row)}
                >
                  <i className="feather feather-x" />
                </button>
                <button
                  key={key}
                  className="btn no-transform d-flex align-items-center justify-content-center text-white mt-2 px-2"
                  onClick={() => modal.show("edit")}
                  style={{
                    minWidth: 60,
                    height: 33,
                    backgroundColor: row.color,
                    marginRight: 12,
                  }}
                >
                  {row.title.slice(0, 20)}
                  {row.title.length > 20 && "..."}
                </button>
              </div>
            ))}
          <button
            className="btn btn-primary mt-2 d-flex align-items-center"
            onClick={() => modal.show("edit")}
          >
            <i className="feather feather-plus fs-18" />
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
});
