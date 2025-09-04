import React from "react";
import classNames from "classnames";
import Select from "react-select";
import ErrorBoundary from "fogito-core-ui/build/components/error/ErrorBoundary";
import Lang from "fogito-core-ui/build/library/Lang";
import Popup from "fogito-core-ui/build/components/common/Popup";
import InputLazy from "fogito-core-ui/build/components/form/InputLazy";
import InputCheckbox from "fogito-core-ui/build/components/form/InputCheckbox";
import Loading from "fogito-core-ui/build/components/common/Loading";
import { servicesItems, dataItems } from "@actions";

export const Service = (props) => {
  const { onClose, params, setParams } = props;
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      data: [],
      selected: [],
      collapse: [],
      filter_key: "",
      filter_value: "",
    }
  );

  const updatedItems = [...params.items];
  const onAdd = () => {
    state.selected?.map((item) => {
      if (!item.children?.length) {
        updatedItems.push({
          type: "category",
          sub_id: item.id,
          active: false,
          title: item.title,
          quantity: 1,
          rate: (item.rate / params.new_exchange_rate).toFixed(2),
          discount: {
            type: "amount",
            value: "",
          },
          tax_rate: item.tax_rate,
          amount: (item.rate / params.new_exchange_rate).toFixed(2),
          account: item.account,
          discount_description: "",
        });
      }
    });
    onClose();
    getData(updatedItems);
  };

  const getData = async (items) => {
    let response = await dataItems({
      from: "sales",
      contact: params.user.value || "",
      items,
    });
    if (response) {
      if (response.status === "success") {
        items.map((item, index) => {
          if (item.type != "custom") {
            item.tax_rate = response.data.items[item.sub_id].tax_rate;
            item.account = response.data.items[item.sub_id].account;
            setParams({ items: updatedItems });
          }
        });
      }
    }
  };

  const loadData = async (queries) => {
    setState({ loading: true });
    let response = await servicesItems({
      from: "sales",
      warehouse: params.warehouse.value || "",
      status: 1,
      type: "service",
      // limit: data.limit,
      ...queries,
    });
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        setState({ data: response.data });
      }
    }
  };

  const [expandedRows, setExpandedRows] = React.useState([]);

  const toggleRow = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const isServiceSelected = (service) => {
    if (service.children?.length) {
      return service.children.every((child) =>
        state.selected.some((item) => item.id === child.id)
      );
    }
    return state.selected.some((item) => item.id === service.id);
  };

  const isChildSelected = (child) => {
    return state.selected.some((item) => item.id === child.id);
  };

  const onSelectService = (e, service) => {
    const isChecked = e.target.checked;
    let newSelected = [];

    if (isChecked) {
      newSelected = service.children?.length
        ? state.selected.concat(service.children).concat(service)
        : state.selected.concat([service]);
    } else {
      newSelected = service.children?.length
        ? state.selected.filter(
            (row) =>
              !service.children.find((child) => child.id === row.id) &&
              row.id !== service.id
          )
        : state.selected.filter((row) => row.id !== service.id);
    }

    setState({ selected: newSelected });
  };

  const onSelectChild = (e, child, service) => {
    const isChecked = e.target.checked;
    let newSelected = [];

    if (isChecked) {
      newSelected = state.selected.concat([child]);
      if (
        service.children.every((v) =>
          newSelected.some((item) => item.id === v.id)
        )
      ) {
        newSelected = newSelected.concat([service]);
      }
    } else {
      newSelected = state.selected.filter((row) => row.id !== child.id);
      if (
        service.children.every(
          (v) => !newSelected.some((item) => item.id === v.id)
        )
      ) {
        newSelected = newSelected.filter((row) => row.id !== service.id);
      }
    }

    setState({ selected: newSelected });
  };

  React.useEffect(() => {
    loadData();
  }, [params.warehouse]);

  return (
    <ErrorBoundary>
      <Popup.Body>
        {!!state.loading && <Loading />}
        <div className="row">
          <div className="col-md-12 mb-3">
            <InputLazy
              value={state.title}
              onChange={(e) => setState({ title: e.target.value })}
              action={(e) => loadData({ title: e.target.value })}
              placeholder={Lang.get("Title")}
              className="form-control"
            />
          </div>
          <div className="col-12">
            <table border="1" cellPadding="10" className="table table-bordered">
              <thead>
                <tr>
                  <th>{Lang.get("Service")}</th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((service) => (
                  <React.Fragment key={service.id}>
                    <tr>
                      <td className="d-flex align-items-center">
                        <InputCheckbox
                          label={service.title}
                          checked={isServiceSelected(service)}
                          onChange={(e) => onSelectService(e, service)}
                        />
                        {!!service.children?.length && (
                          <div
                            className="ml-1 d-flex align-items-center justify-content-center cursor-pointer"
                            onClick={() => toggleRow(service.id)}
                          >
                            {expandedRows.includes(service.id) ? (
                              <i className="feather feather-arrow-up fs-12 mr-1" />
                            ) : (
                              <i className="feather feather-arrow-down fs-12 mr-1" />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                    {expandedRows.includes(service.id) &&
                      service.children?.map((child) => (
                        <tr key={child.id}>
                          <td
                            className="d-flex"
                            style={{ paddingLeft: "30px" }}
                          >
                            <InputCheckbox
                              label={child.title}
                              style={{ marginRight: "5px" }}
                              checked={isChildSelected(child)}
                              onChange={(e) => onSelectChild(e, child, service)}
                            />
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Popup.Body>
      <Popup.Footer>
        <div className="row">
          <div className="col-6 pl-0">
            <button
              type="button"
              disabled={!state.selected?.length}
              className="btn btn-primary btn-block"
              onClick={() => onAdd()}
            >
              {Lang.get("Add")}
            </button>
          </div>
          <div className="col-6 pr-0">
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={onClose}
            >
              {Lang.get("Cancel")}
            </button>
          </div>
        </div>
      </Popup.Footer>
    </ErrorBoundary>
  );
};
