import React from "react";
import {
  AppContext,
  ErrorBoundary,
  Lang,
  useToast,
  Actions,
  useModal,
  Popup,
} from "fogito-core-ui";
import {
  getFilterToLocal,
  onFilterStorageBySection,
  mailsDelete,
  tourList,
  tourDelete,
} from "@actions";
import moment from "moment";
import { Filters, HeaderCustom, TableCustom, ViewRoutes } from "./components";
import { config } from "@config";

export const Tour = ({ name, history, match: { path, url } }) => {
  const toast = useToast();
  const modal = useModal();
  const VIEW = "tour";
  const { setProps } = React.useContext(AppContext);
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      loadingList: false,
      selectedIDs: [],
      data: [],
      count: 0,
      limit: localStorage.getItem(`${VIEW}_tb_limit`) || "10",
      skip: 0,
      nextPageToken: null,
      hiddenColumns:
        JSON.parse(localStorage.getItem(`${VIEW}_columns_${config.appID}`)) ||
        [],
      paramsList: [],
      recipient: getFilterToLocal(name, "recipient") || null,
      showFilter: false,
      tour_code: getFilterToLocal(name, "tour_code") || "",
      filters: {
        status: getFilterToLocal(name, "status")
          ? {
              label: "",
              value: getFilterToLocal(name, "status"),
            }
          : null,
        range: {
          arrival_date: getFilterToLocal(name, "date")
            ? moment
                .unix(getFilterToLocal(name, "date")?.split("T")[0] || "")
                .format("YYYY-MM-DD")
            : null,
          departure_date: getFilterToLocal(name, "date")
            ? moment
                .unix(getFilterToLocal(name, "date")?.split("T")[1] || "")
                .format("YYYY-MM-DD")
            : null,
        },
      },
    }
  );

  const loadData = async (params) => {
    setState({ loading: true, skip: params?.skip || 0 });
    let response = await tourList({
      limit: state.limit || "",
      skip: params?.skip || 0,
      // sort: "created_at",
      tour_code: state.tour_code,
      status: state.filters.status,
      arrival_date: state.filters.range.arrival_date
        ? moment(`${state.filters.range.arrival_date} 00:00:00`).unix()
        : "",
      departure_date: state.filters.range.departure_date
        ? moment(`${state.filters.range.departure_date} 23:59:59`).unix()
        : "",
      ...params,
    });
    if (response) {
      setState({ loading: false, progressVisible: false });
      if (response.status === "success") {
        setState({
          data: response.data,
          count: response.count,
        });
      } else {
        setState({ data: [], count: 0 });
      }
    }
  };

    const onDelete = (ids) =>
      toast
        .fire({
          position: "center",
          toast: false,
          timer: null,
          text: Lang.get("DeleteAlertDescription"),
          buttonsStyling: false,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonClass: "btn btn-success",
          cancelButtonClass: "btn btn-secondary",
          confirmButtonText: Lang.get("Confirm"),
          cancelButtonText: Lang.get("Cancel"),
        })
        .then(async (res) => {
          if (res?.value) {
            if (ids?.length === 1) {
              ids.map(async (selectedId) => {
                setState({ setLoading: true });
                let response = null;
                response = await tourDelete({
                  id: selectedId,
                  google_user_id: state.googleUserId,
                });
                if (response) {
                  setState({ loading: false, selectedIDs: [] });
                  toast.fire({
                    icon: response.status,
                  });
                  if (response?.status === "success") {
                    const skip =
                      state.data?.length === 1 && state.skip >= state.limit
                        ? state.skip - state.limit
                        : state.skip;
                    loadData({ skip });
                  }
                }
              });
            } else {
              setState({ progressVisible: true });
              Actions.multiAction({
                ids,
                limit: state.limit,
                skip: state.skip,
                dataLength: state.data?.length,
                url: "mailsDelete",
                reload: (skip) => loadData({ skip }),
                getData: ({
                  total,
                  TotalItems,
                  successPercent,
                  errorPercent,
                }) => {
                  setState({
                    total,
                    TotalItems,
                    successPercent,
                    errorPercent,
                  });
                },
              });
            }
          }
        });
  

  const onClearFilters = () => {
    setState({
      tour_code: "",
      filters: {
        status: null,
        range: { arrival_date: null, departure_date: null },
      },
    });
    onFilterStorageBySection(name);
  };

  const onClose = () => {
    history.push(url);
  };

  const goBack = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      history.push("/mails");
    }
  };

  React.useEffect(() => {
    loadData();
  }, [state.recipient, state.limit, state.filters, state.tour_code]);

  React.useEffect(() => {
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  const filters = {
    tour_code: state.tour_code,
    status: state.filters.status === "" ? null : state.filters.status,
    range:
      state.filters.range?.arrival_date === null &&
      state.filters.range?.departure_date === null
        ? null
        : state.filters.range,
  };
  return (
    <ErrorBoundary>
      <Filters
        show={state.showFilter}
        name={name}
        paramsList={state.paramsList}
        filters={state.filters}
        state={state}
        setState={(key, value) => setState({ [key]: value })}
      />
      <ViewRoutes
        onClose={goBack}
        loadData={loadData}
        history={history}
        path={path}
        url={url}
        modal={modal}
      />
      <HeaderCustom
        state={state}
        setState={setState}
        onDelete={onDelete}
        loadData={loadData}
        onClearFilters={onClearFilters}
        path={path}
        VIEW={VIEW}
        filters={filters}
        name={name}
      />
      <section className="container-fluid">
        <TableCustom
          state={state}
          setState={setState}
          path={path}
          loadData={loadData}
          VIEW={VIEW}
          onDelete={onDelete}
        />
      </section>
    </ErrorBoundary>
  );
};
