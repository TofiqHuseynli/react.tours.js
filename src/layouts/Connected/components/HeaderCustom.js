import React from "react";
import { ErrorBoundary, Lang, Header, InputLazy, Api } from "fogito-core-ui";
import { Link } from "react-router-dom";
import { historyPushByName } from "@actions";
import { API_ROUTES } from "@config";

export const HeaderCustom = ({
  state,
  setState,
  loadData,
  onDelete,
  path,
  name,
}) => {
  return (
    <ErrorBoundary>
      <Header>
        <div className="row">
          {!!state.selectedIDs.length && (
            <div className="col-md-auto col-6 order-md-1 order-1">
              <button
                data-filter-count={state.selectedIDs?.length}
                className="btn btn-danger btn-block position-relative"
                onClick={() => onDelete(state.selectedIDs)}
              >
                <i className="feather feather-trash mr-0" />
              </button>
            </div>
          )}
          {!state.selectedIDs.length && (
            <div className="col-md-auto col-6 order-md-1 order-1">
              <button
                className="btn btn-block btn-white"
                onClick={() => loadData()}
              >
                <i className="feather feather-refresh-ccw text-primary" />
              </button>
            </div>
          )}
          <div className="col-md-4 col-12 mt-md-0 mt-3 order-md-2 order-3 mr-auto">
            <div className="input-group input-group-alternative d-flex align-items-center">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="feather feather-search" />
                </span>
              </div>
              <InputLazy
                value={state.mail}
                onChange={(e) => {
                  setState({ mail: e.target.value });
                  historyPushByName(
                    {
                      label: "E-mail",
                      value: e.target.value,
                    },
                    name
                  );
                }}
                action={() => { }}
                className="form-control form-control-alternative"
                placeholder={Lang.get("E-mail")}
              />
            </div>
          </div>
          <div className="col-md-auto col-12 order-md-5 order-5 m-md-0 mt-3">
            <a
              href={Api.convert(API_ROUTES.oauthConnect,true)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block"
            >
              <i className="feather feather-plus" />
            </a>

          </div>
        </div>
      </Header>
    </ErrorBoundary>
  );
};
