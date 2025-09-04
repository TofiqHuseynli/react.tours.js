import React from "react";
import {
  ErrorBoundary,
  Lang,
  useToast,
  Popup,
  Loading,
  Picker,
  Auth,
  Textarea,
  InputCheckbox,
} from "fogito-core-ui";
import { MembersTwo, Spinner } from "@components";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { MultiForm, Totals, WYSIWYGEditor } from "@components";
import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import {
  coreTimezonesList,
  currencyminList,
  InvoiceSettings,
  offersAdd,
  offersInfo,
  offersUserSearch,
  templatesminList,
  termsminList,
} from "@actions";

export const Add = ({ onClose, reload }) => {
  const toast = useToast();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      defaultVat: 0,
      currency_list: [],
      terms_list: [],
      currencies: [],
      timezones: [],
      branches: {
        data: [
          {
            ...Auth.get("company"),
            id: Auth.get("company")?.id,
            avatar: Auth.get("company")?.avatar?.medium,
            fullname: Auth.get("company")?.title,
          },
        ],
        count: 0,
      },
      template: null,
      updateLoading: false,
      defaultRate: null,
      description: "",
      start_date: "",
      start_time: "",
      expires_date: "",
      expires_time: "",
      owner: {
        label: Auth.get("fullname"),
        value: Auth.get("id"),
        company: {
          ...Auth.get("company"),
          id: Auth.get("company")?.id,
          avatar: Auth.get("company")?.avatar?.medium,
          title: Auth.get("company")?.title,
        },
      },
      branch: null,
    }
  );

  const [params, setParams] = React.useState({
    description: "",
    active:0,
    items: [],
    fines: [],
    user_id: "",
    comment: "",
    date: null,
    template_id: null,
    currency_id: null,
    timezone_id: Auth.get("timezone")
      ? {
          label: Auth.get("timezone")?.title,
          value: Auth.get("timezone")?.id,
        }
      : null,
    expires_date: "",
    payment: "",
    currency: "",
    timezone: "",
    terms: null,
    vat_inclusive: 0,
    vat_included: 0,
    total_excluded_vat: 0,
    total_vat_amount: 0,
    total_included_vat: 0,
    total_to_pay: 0,
  });

  const loadTemplate = async (data) => {
    setParams({ ...params, template_id: data?.value });
    if (data !== null) {
      setState({ loading: true });
      let response = await offersInfo({ data: { id: data?.value } });
      if (response.status === "success") {
        setState({ loading: false });
        setParams((prevParams) => ({
          ...prevParams,
          comment: response.data?.comment,
          items: response.data?.items_list,
          fines: response.data?.fines_list,
          description: response.data?.description,
          template_id: response.data?.id,
          currency_id: response.data?.currency_data || null,
          timezone_id: response.data?.time_zone_data,
          payment: response.data?.payment || null,
          timezone: response.data?.time_zone_data || null,
          terms: response.data?.terms_conditions_id || null,
          vat_inclusive: response.data?.vat_inclusive,
          vat_included: response.data?.vat_included,
        }));
        setState({
          description: response.data?.description,
          defaultVat: response.data.payment?.vat || 0,
          branches: response.data.branches || { data: [], count: 0 },
          branch: null,
        });
      } else {
        setState({
          loading: false,
          description: "",
          branches: response.data.branches || { data: [], count: 0 },
          branch: null,
        });
        setParams({
          items: [],
          fines: [],
          user_id: "",
          comment: "",
          date: "",
          description: "",
          template_id: null,
          currency_id: null,
          timezone_id: null,
          terms: null,
          expires_date: "",
          payment: "",
          currency: "",
          timezone: "",
          offer_number: null,
          vat_inclusive: 0,
          vat_included: 0,
        });
        toast.fire({
          title: Lang.get(response.description),
          icon: "error",
        });
      }
    } else {
      setState({ description: "" });
      setParams({
        ...params,
        items: [],
        fines: [],
        comment: "",
        date: "",
        description: "",
        template_id: null,
        currency_id: null,
        timezone_id: null,
        terms: null,
        expires_date: "",
        payment: "",
        currency: "",
        timezone: "",
        offer_number: null,
        vat_inclusive: 0,
        vat_included: 0,
      });
    }
  };

  const onChangeCurrency = async (currency_id) => {
    let items = [];
    let fines = [];
    const newArrByItems = params.items.map((item) => {
      return {
        ...item,
        total_count: item.total,
        percentage: 0,
      };
    });
    const newArrByFines = params.fines.map((fine) => {
      return {
        ...fine,
        total_count: fine.total,
        percentage: 0,
      };
    });
    for (let item of newArrByItems) {
      if (item.discount_type?.value === "currency") {
        item.discount_type = {
          label: currency_id?.label,
          value: "currency",
          sign: currency_id?.sign,
        };
      }
      items.push(item);
    }
    for (let item of newArrByFines) {
      if (item.discount_type?.value === "currency") {
        item.discount_type = {
          label: currency_id?.label,
          value: "currency",
          sign: currency_id?.sign,
        };
      }
      fines.push(item);
    }
    setParams({ ...params, items, fines, currency_id });
  };

  const loadTemplates = async (query) => {
    let response = await templatesminList({ query });
    if (response) {
      if (response?.status === "success") {
        return response.templates?.map((item) => ({
          value: item.id,
          label: item.title,
        }));
      }
    }
  };

  const formatOptionLabelUser = (data) => (
    <div className="d-flex flex-column lh-14">
      <div>{data.label}</div>
      {data.company && <span className="fs-12">@ {data.company.title}</span>}
    </div>
  );

  const loadCurrency = async (query = "") => {
    let response = await currencyminList({
      skip: 0,
      limit: 20,
      query,
      names: ["currencies"],
    });
    if (response?.status === "success") {
      setState({
        currency_list: response.currency.currencies,
        currencies: response.currency.currencies,
      });
    }
  };

  const loadSettings = async () => {
    setState({ loading: true });
    let response = await InvoiceSettings();
    if (response) {
      setState({ loading: false });
      if (response.status === "success") {
        setParams({
          ...params,
          currency_id: response.data?.default_currency
            ? {
                label: response.data?.default_currency?.title,
                value: response.data?.default_currency?.id,
                sign: response.data?.default_currency?.sign,
                rate: response.data?.default_currency?.rate,
              }
            : null,
        });
        setState({ defaultRate: response.data?.default_tax });
      }
    }
  };

  const loadTimezones = async (query = "") => {
    let response = await coreTimezonesList({ my_timezones: true, query });
    if (response) {
      if (response.status === "success") {
        return response.data.map((row) => ({
          label: row.title,
          value: row.id,
        }));
      }
    }
  };

  const loadCustomers = async (query) => {
    let response = await offersUserSearch({
      skip: 0,
      limit: 20,
      query,
      type: "user",
      list_type: "offers",
    });
    if (response?.status === "success") {
      return response.data?.map((item) => ({
        value: item.id,
        label: item.fullname,
        company: item.company,
      }));
    }
  };

  const loadUsers = async (query) => {
    let response = await offersUserSearch({
      skip: 0,
      limit: 20,
      query,
      type: "employee",
      list_type: "offers",
      permission_list_type: "create",
    });
    if (response?.status === "success") {
      return response.data?.map((item) => ({
        value: item.id,
        label: item.fullname,
        company: item.company,
      }));
    }
  };

  const loadTerms = async (query) => {
    let response = await termsminList({ skip: 0, limit: 20, query });
    if (response?.status === "success") {
      setState({ terms_list: response.terms });
      return response.terms?.map((item) => ({
        value: item.id,
        label: item.title,
      }));
    }
  };

  const onAsyncChange = async (value, type) => {
    if (value !== null) {
      setParams({ ...params, [type]: value?.id || value?.value });
    } else {
      setParams({ ...params, [type]: null });
    }
  };

  const checkCompany = async (obj) => {
    const lastUser = obj;
    const branches = state.branches.data.map((row) => row.id);
    if (lastUser.company && !branches.includes(lastUser.company.id)) {
      setState({
        branches: {
          data: state.branches.data.concat([
            {
              id: lastUser.company.id,
              avatar: lastUser.company?.avatar,
              fullname: lastUser.company.title,
              avatar_custom: lastUser.company.avatar_custom,
            },
          ]),
          count: state.branches.data.count + 1,
        },
      });
    }
  };

  let symbol = params.currency_id || "";

  React.useEffect(() => {
    loadSettings();
    loadCurrency();
  }, []);

  const st = { label: { width: "165px", textAlign: "end" } };
  const { control } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading) {
      response = await offersAdd({
        data: {
          ...params,
          branches: state.branches.data.map((row) => row.id) || [],
          owner_id: state.owner?.value || "",
          date: `${state.start_date} ${state.start_time}`,
          expires_date: `${state.expires_date} ${state.expires_time}`,
          payment: params.payment?.value || "",
          description: state.description || "",
          currency_id: params.currency_id?.value || "",
          timezone_id: params.timezone_id?.value || "",
          terms_id: params.terms?.value || "",
          template: params.template?.value || "",
        },
      });

      if (response) {
        setState({ updateLoading: false });
        if (response?.status === "success") {
          onClose();
          await reload();
          toast.fire({
            title: Lang.get(response?.description),
            icon: "success",
          });
        } else {
          toast.fire({
            title: Lang.get(response?.description || "TitleIsEmpty"),
            icon: "error",
          });
        }
      }
    }
  };

  const renderModalHeader = () => <div>{Lang.get("Add")}</div>;

  return (
    <ErrorBoundary>
      <Popup show size="xl" onClose={onClose} header={renderModalHeader()}>
        <Popup.Body>
          <div className="form-group">
            <div className="row">
              <div className="col-xl-8">
                <label>{Lang.get("Hotel")}</label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  defaultOptions
                  // value={params.board}
                  // loadOptions={loadBoards}
                  placeholder={Lang.get("Select")}
                  onChange={(board) => setParams({ ...params, board })}
                  className="form-control"
                />
              </div>
              <div className="form-group col-xl-4">
                <label>{Lang.get("Country")}</label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  defaultOptions
                  // value={params.board}
                  // loadOptions={loadBoards}
                  placeholder={Lang.get("Select")}
                  onChange={(board) => setParams({ ...params, board })}
                  className="form-control"
                />
              </div>
              <div className="form-group col-xl-12">
                <label>{Lang.get("RoomType")}</label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  defaultOptions
                  // value={params.board}
                  // loadOptions={loadBoards}
                  placeholder={Lang.get("Select")}
                  onChange={(board) => setParams({ ...params, board })}
                  className="form-control"
                />
              </div>
              <div className="col-xl-12 form-group">
                <label>{Lang.get("Description")}</label>
                <Textarea
                  rows="3"
                  maxLength="1500"
                  value={params.description}
                  onChange={(e) =>
                    setParams({ ...params, description: e.target.value })
                  }
                  placeholder={Lang.get("Description")}
                  className="form-control"
                />
                <span className="text-muted fs-12 mt-1">
                  {Lang.get("MaxLength").replace(
                    "{length}",
                    1500 - params.description?.length
                  )}
                </span>
              </div>
              <div className=" form-group col-xl-3">
                <InputCheckbox
                  label={Lang.get("Active")}
                  checked={params.active}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      active: !!e.target.checked ? 1 : 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Popup.Body>
        <Popup.Footer>
          <div className="d-flex">
            <button onClick={onSubmit} className="btn btn-primary w-100">
              {state.saveLoading ? (
                <Spinner color="#fff" style={{ width: 30 }} />
              ) : (
                Lang.get("Add")
              )}
            </button>
            <button onClick={() => onClose()} className="btn btn-danger w-100">
              {Lang.get("Close")}
            </button>
          </div>
        </Popup.Footer>
      </Popup>
    </ErrorBoundary>
  );
};
