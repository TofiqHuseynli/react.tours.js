import React from "react";
import Select from "react-select";
import ErrorBoundary from "fogito-core-ui/build/components/error/ErrorBoundary";
import Lang from "fogito-core-ui/build/library/Lang";
import Popup from "fogito-core-ui/build/components/common/Popup";
import InputLazy from "fogito-core-ui/build/components/form/InputLazy";
import InputCheckbox from "fogito-core-ui/build/components/form/InputCheckbox";
import Loading from "fogito-core-ui/build/components/common/Loading";
import { productsItems, dataItems } from "@actions";

export const Product = (props) => {
  const { onClose, product_filters, params, setParams } = props;
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
      if (!item.variant_is_exists) {
        updatedItems.push({
          type: "product",
          sub_id: item.id,
          active: false,
          title: item.title,
          quantity: item.quantity,
          rate: (item.rate / params.new_exchange_rate).toFixed(2),
          discount: {
            type: "amount",
            value: "",
          },
          tax_rate: item.tax_rate,
          amount:
            item.quantity * (item.rate / params.new_exchange_rate).toFixed(2),
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
  const loadData = async () => {
    setState({ loading: true });
    let response = await productsItems({
      from: "sales",
      warehouse: params.warehouse.value || "",
      filter_key: state.filter_key?.value || "",
      filter_value: state.filter_value,
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

  const isProductSelected = (product) => {
    if (product.variants?.length) {
      return product.variants.every((variant) =>
        state.selected.some((item) => item.id === variant.id)
      );
    }
    return state.selected.some((item) => item.id === product.id);
  };

  const isVariantSelected = (variant) => {
    return state.selected.some((item) => item.id === variant.id);
  };

  const onSelectProduct = (e, product) => {
    const isChecked = e.target.checked;
    let newSelected = [];

    if (isChecked) {
      newSelected = product.variants?.length
        ? state.selected.concat(product.variants).concat(product)
        : state.selected.concat([product]);
    } else {
      newSelected = product.variants?.length
        ? state.selected.filter(
            (row) =>
              !product.variants.find((variant) => variant.id === row.id) &&
              row.id !== product.id
          )
        : state.selected.filter((row) => row.id !== product.id);
    }

    setState({ selected: newSelected });
  };

  const onSelectVariant = (e, variant, product) => {
    const isChecked = e.target.checked;
    let newSelected = [];

    if (isChecked) {
      newSelected = state.selected.concat([variant]);
      if (
        product.variants.every((v) =>
          newSelected.some((item) => item.id === v.id)
        )
      ) {
        newSelected = newSelected.concat([product]);
      }
    } else {
      newSelected = state.selected.filter((row) => row.id !== variant.id);
      if (
        product.variants.every(
          (v) => !newSelected.some((item) => item.id === v.id)
        )
      ) {
        newSelected = newSelected.filter((row) => row.id !== product.id);
      }
    }

    setState({ selected: newSelected });
  };

  React.useEffect(() => {
    loadData();
    setState({
      filter_key: product_filters.find(
        (product_filter) => product_filter.default
      ),
    });
  }, [params.warehouse, state.filter_key]);

  return (
    <ErrorBoundary>
      <Popup.Body>
        {!!state.loading && <Loading />}
        <div className="row">
          <div className="col-md-8 mb-3">
            <InputLazy
              value={state.filter_value}
              onChange={(e) => setState({ filter_value: e.target.value })}
              action={(e) => loadData({ filter_value: e.target.value })}
              placeholder={Lang.get("FilterValue")}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <Select
              styles={{
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
              menuPortalTarget={document.body}
              value={state.filter_key}
              placeholder={Lang.get("FilterKey")}
              options={product_filters}
              onChange={(filter_key) => setState({ filter_key })}
              className="form-control"
            />
          </div>
          <div className="col-12">
            <table border="1" cellPadding="10" className="table table-bordered">
              <thead>
                <tr>
                  <th>{Lang.get("Product")}</th>
                  <th>{Lang.get("Price")}</th>
                  <th>{Lang.get("OnHand")}</th>
                  <th>{Lang.get("Committed")}</th>
                  <th>{Lang.get("Available")}</th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((product) => (
                  <React.Fragment key={product.id}>
                    <tr>
                      <td className="d-flex align-items-center">
                        <InputCheckbox
                          label={product.title}
                          checked={isProductSelected(product)}
                          onChange={(e) => onSelectProduct(e, product)}
                        />
                        {!!product.variants?.length && (
                          <div
                            className="ml-1 d-flex align-items-center justify-content-center cursor-pointer"
                            onClick={() => toggleRow(product.id)}
                          >
                            {expandedRows.includes(product.id) ? (
                              <i className="feather feather-arrow-up fs-12 mr-1" />
                            ) : (
                              <i className="feather feather-arrow-down fs-12 mr-1" />
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {product.rate || null}{" "}
                        {product.rate
                          ? params.accounting_settings.bcy?.label
                          : null}
                      </td>
                      <td>{product.on_hand}</td>
                      <td>{product.committed}</td>
                      <td>{product.available}</td>
                    </tr>
                    {expandedRows.includes(product.id) &&
                      product.variants?.map((variant) => (
                        <tr key={variant.id}>
                          <td
                            className="d-flex"
                            style={{ paddingLeft: "30px" }}
                          >
                            <InputCheckbox
                              label={variant.title}
                              style={{ marginRight: "5px" }}
                              checked={isVariantSelected(variant)}
                              onChange={(e) =>
                                onSelectVariant(e, variant, product)
                              }
                            />
                          </td>
                          <td>
                            {variant.rate}{" "}
                            {params.accounting_settings.bcy?.label}
                          </td>
                          <td>{variant.on_hand}</td>
                          <td>{variant.committed}</td>
                          <td>{variant.available}</td>
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
