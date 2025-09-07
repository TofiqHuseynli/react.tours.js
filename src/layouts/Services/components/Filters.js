import React from "react";
import FilterBar from "fogito-core-ui/build/components/common/FilterBar";
import { Lang } from "fogito-core-ui";
import Select from "react-select";

import { historyPushByName, onFilterStorageBySection } from "@actions";

export const Filters = ({ show, name, filters, setState }) => {
  const defaultModel = {
    subject: null,
    range: { start_date: null, end_date: null },
  };

  const [params, setParams] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    filters
  );

  const options = [
    { value: true, label: "Active" },
    { value: false, label: "InActive" },
  ];

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
