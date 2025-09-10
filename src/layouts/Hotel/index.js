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
  hotelList,
  hotelDelete,
} from "@actions";
import moment from "moment";
import { Filters, HeaderCustom, TableCustom, ViewRoutes } from "./components";
import { config } from "@config";

export const Hotel = ({ name, history, match: { path, url } }) => {
  const toast = useToast();
  const modal = useModal();
  const VIEW = "hotel";
  const { setProps } = React.useContext(AppContext);
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: false,
      loadingList: false,
      selectedIDs: [],
      data: [],
      count: 0,
      title: getFilterToLocal(name, "title") || "",
      limit: localStorage.getItem(`${VIEW}_tb_limit`) || "10",
      skip: 0,
      nextPageToken: null,
      hiddenColumns:
        JSON.parse(localStorage.getItem(`${VIEW}_columns_${config.appID}`)) ||
        [],
      paramsList: [],
      recipient: getFilterToLocal(name, "recipient") || null,
      showFilter: false,
      tourCode: "",
      filters: {
        country: "",
        room_type: getFilterToLocal(name, "room_type")
          ? { value: getFilterToLocal(name, "room_type"), label: "" }
          : null,
        status: getFilterToLocal(name, "status")
          ? {
              label: "",
              value: getFilterToLocal(name, "status"),
            }
          : null,
      },
    }
  );

  const loadData = async (params) => {
    setState({ loading: true, skip: params?.skip || 0 });
    let response = await hotelList({
      limit: state.limit || "",
      skip: params?.skip || 0,
      // sort: "created_at",
      title: state.title,
      country: state.filters.country,
      room_type: state.filters.room_type,
      status: state.filters.status,
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
              response = await hotelDelete({
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
      title: "",
      filters: {
        country: "",
        room_type: "",
        status: null,
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
  }, [state.recipient, state.limit, state.filters, state.title]);

  React.useEffect(() => {
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  const filters = {
    title: state.title,
    country: state.filters.country,
    room_type: state.filters.room_type,
    status: state.filters?.status,
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
