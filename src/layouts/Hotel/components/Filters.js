import React from "react";
import FilterBar from "fogito-core-ui/build/components/common/FilterBar";
import Select from "react-select";
import { Lang } from "fogito-core-ui";
import {
  getFilterToLocal,
  historyPushByName,
  onFilterStorageBySection,
  roomTypeMinList,
} from "@actions";
import AsyncSelect from "react-select/async";

export const Filters = ({ show, name, filters, setState }) => {
  const defaultModel = {
    subject: null,
    range: { start_date: null, end_date: null },
  };

  const options = [
    { value: true, label: "Active" },
    { value: false, label: "InActive" },
  ];

  const optionsd = [];

  const loadRoomType = async (query = "") => {
    let response = await roomTypeMinList({
      skip: 0,
      limit: 20,
      query,
      selected_id: getFilterToLocal(name, "room_type") || "",
    });
    if (response?.status === "success") {
      if (response.selected) {
        setParams({ room_type: response.selected });
      }
      return response.data?.map((item) => ({
        value: item.value,
        label: item.label,
      }));
    }
  };

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
        <div className="form-group col-xl-12 mb-2">
          <label className="text-muted mb-1">{Lang.get("Country")}</label>
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
            // value={params.status ?? null}
            // options={options}
            // onChange={(data) => {
            //   setParams({ status: data });
            //   historyPushByName(
            //     {
            //       label: "status",
            //       value: data ? data?.value : "",
            //     },
            //     name
            //   );
            // }}
            placeholder={Lang.get("All")}
            name="value"
            className="form-control form-control-alternative"
          />
        </div>

        <div className="form-group col-xl-12 mb-2">
          <label>{Lang.get("RoomType")}</label>
          <AsyncSelect
            isClearable
            cacheOptions
            defaultOptions
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
            value={params.room_type}
            loadOptions={loadRoomType}
            placeholder={Lang.get("RoomType")}
            onChange={(room_type) => {
              setParams({ room_type });
              historyPushByName(
                {
                  label: "room_type",
                  value: room_type?.value || "",
                },
                name
              );
            }}
            className="form-control form-control-alternative"
          />
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
