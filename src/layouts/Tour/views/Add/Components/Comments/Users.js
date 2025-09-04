import React from "react";
import Empty from "antd/lib/empty";
import classNames from "classnames";
import { ErrorBoundary, Avatar, InputLazy, Lang } from "fogito-core-ui";
import { UsersSkeleton } from "@components";
import { userList } from "@actions";

export const Users = ({ users, onToggle, card }) => {
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    { loading: false, data: [], query: "" }
  );

  const loadData = async (params) => {
    setState({ loading: true });
    let response = await userList({ ...params, limit: 40, card });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        setState({ data: response.data });
      } else {
        setState({ data: [] });
      }
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <ErrorBoundary>
      <div
        ref={(el) => {
          if (el) {
            el.parentElement.style.padding = "1rem 0";
          }
        }}
        className="px-3"
      >
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="feather feather-search" />
            </span>
          </div>
          <InputLazy
            autoFocus
            value={state.query}
            onChange={(e) => setState({ query: e.target.value })}
            action={(e) => loadData({ query: e.target.value })}
            placeholder={Lang.get("Search")}
            className="form-control"
          />
        </div>
      </div>
      <div className="mt-3" style={{ maxHeight: "70vh", overflow: "auto" }}>
        <div
          className="core-user-list"
          style={{
            maxHeight: "55vh",
            minHeight: "55vh",
            overflowY: "auto",
          }}
        >
          {!state.loading && state.data?.length === 0 && (
            <div className="mt-5">
              <Empty description={Lang.get("NoData")} />
            </div>
          )}
          {/* {state.loading ? (
            <div className="px-3 mt-2">
              <UsersSkeleton />
            </div>
          ) : ( */}
            <React.Fragment>
              {state.data.map((item) => {
                let newFullname = item.fullname.replace(
                  new RegExp(state.query, "gi"),
                  (match) =>
                    `<span class="text-danger text-truncate font-weight-bold mb-0 lh-20">${match}</span>`
                );
                let selected = users?.map((row) => row.id).includes(item.id);
                return (
                  item.selected && (
                    <div
                      className={classNames("item py-2 px-3", { selected })}
                      onClick={() =>
                        onToggle(
                          selected
                            ? users?.filter((row) => row.id !== item.id)
                            : users?.concat([item])
                        )
                      }
                      key={item.id}
                    >
                      <div className="d-flex align-items-center">
                        <Avatar user={item} size="md" className="mr-2" />
                        <div className="ml-2">
                          <div
                            className="text-primary text-truncate font-weight-bold mb-0 lh-20"
                            dangerouslySetInnerHTML={{ __html: newFullname }}
                          />
                          <p className="text-muted fs-14 mb-0 lh-22">
                            {item.position}
                          </p>
                        </div>
                      </div>
                      {selected ? (
                        <i className="feather feather-x text-danger ml-auto fs-20 " />
                      ) : (
                        <i className="feather feather-plus text-primary ml-auto fs-20" />
                      )}
                    </div>
                  )
                );
              })}
            </React.Fragment>
          {/* )} */}
        </div>
      </div>
    </ErrorBoundary>
  );
};
