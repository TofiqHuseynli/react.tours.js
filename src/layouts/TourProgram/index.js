import React from "react";
import {
  AppContext,
  ErrorBoundary,
  Lang,
  useToast,
  Actions,
} from "fogito-core-ui";
import {
  connectedList,
  connectedDelete,
  tourProgramList,
  getFilterToLocal,
  tourProgramDelete,
} from "@actions";

import { Filters, HeaderCustom, TableCustom, ViewRoutes } from "./components";
import { config } from "@config";

export const TourProgram = ({ name, history, match: { path, url } }) => {
  const toast = useToast();
  const VIEW = "tour_programmes";

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
      title: getFilterToLocal(name, "title") || "",
      filters: {
        note: "",
        status: getFilterToLocal(name, "status")
          ? {
              label: "",
              value: getFilterToLocal(name, "status"),
            }
          : null,
      },
      showFilter: false,
      hiddenColumns:
        JSON.parse(localStorage.getItem(`${VIEW}_columns_${config.appID}`)) ||
        [],
      paramsList: [],
    }
  );

  const loadData = async (params) => {
    setState({ loading: true, skip: params?.skip || 0 });
    let response = await tourProgramList({
      limit: state.limit || "",
      skip: params?.skip || 0,
      title: state.title,
      note: state.filters.note,
      status: state.filters.status?.value,
      ...params,
    });
    if (response) {
      setState({ loading: false, progressVisible: false });
      if (response.status === "success") {
        setState({ data: response.data, count: response.count });
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
                response = await tourProgramDelete({
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

  const onClose = () => {
    history.push(url);
  };

  const goBack = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      history.push("/mailconnections");
    }
  };

  const onClearFilters = () => {
    setState({
      title: "",
      filters: {
        note: "",
        status: null,
      },
    });
    onFilterStorageBySection(name);
  };

  React.useEffect(() => {
    loadData();
  }, [state.limit, state.title, state.filters]);

  React.useEffect(() => {
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  const filters = {
    ...state.filters,
    title: state.title,
    note: state.filters.note === "" ? null : state.filters.note,
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
      />
      <HeaderCustom
        state={state}
        setState={setState}
        onDelete={onDelete}
        loadData={loadData}
        onClearFilters={onClearFilters}
        filters={filters}
        path={path}
        VIEW={VIEW}
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
          // loadMailList={loadMailList}
        />
      </section>
    </ErrorBoundary>
  );
};
