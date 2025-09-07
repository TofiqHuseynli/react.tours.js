import React from "react";
import FilterBar from "fogito-core-ui/build/components/common/FilterBar";
import { Lang } from "fogito-core-ui";
import { historyPushByName, onFilterStorageBySection } from "@actions";
import AsyncSelect from "react-select/async";
import Select from "react-select";

export const Filters = ({ show, name, filters, setState }) => {
  const defaultModel = {
    note: null,
  };

  const options = [
    { value: true, label: "Active" },
    { value: false, label: "InActive" },
  ];

  const [params, setParams] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    filters
  );

  const onSearch = () => {
    if (JSON.stringify(params) !== JSON.stringify(filters)) {
      setState("filters", params);
    }
    setState("showFilter", false);
  };

  React.useEffect(() => {
    setParams(filters);
  }, [filters]);

  return (
    <FilterBar
      show={show}
      onClose={onSearch}
      onSearch={onSearch}
      onClear={() => {
        setParams(defaultModel);
        setState("filters", defaultModel);
        setState("showFilter", false);
        onFilterStorageBySection(name);
      }}
    >
      <div className="row">
        <div className="col-12 mb-2">
          <label className="text-muted mb-1">{Lang.get("Note")}</label>
          <div className="input-group input-group-alternative">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="feather feather-search" />
              </span>
            </div>
            <input
              defaultValue={params.note}
              onChange={(e) => {
                setParams({ note: e.target.value });
              }}
              className="form-control form-control-alternative"
              placeholder={Lang.get("Note")}
            />
          </div>
        </div>

        <div className="form-group col-xl-12 mb-2">
          <label className="text-muted mb-1">{Lang.get("Status")}</label>
          <Select
            isClearable
            components={{
              Control: ({ innerProps, children, innerRef }) => {
                return (
                  <div
                    className="input-group-prepend m-1"
                    {...innerProps}
                    ref={innerRef}
                  >
                    {children}
                  </div>
                );
              },
            }}
            value={params.status ?? null}
            options={options}
            onChange={(data) => {
              setParams({ status: data });
              historyPushByName(
                {
                  label: "status",
                  value: data ? data?.value : "",
                },
                name
              );
            }}
            placeholder={Lang.get("All")}
            name="value"
            className="form-control form-control-alternative"
          />
        </div>
      </div>
    </FilterBar>
  );
};
