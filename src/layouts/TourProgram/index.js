import React from "react";
import {
  AppContext,
  ErrorBoundary,
  Lang,
  useToast,
  Actions,
} from "fogito-core-ui";
import { connectedList, connectedDelete } from "@actions";

import { HeaderCustom, TableCustom, ViewRoutes } from "./components";
import { config } from "@config";

export const TourProgram = ({ name, history, match: { path, url } }) => {
  const toast = useToast();
  const VIEW = "tourProgram";

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
      title: "",
      mail: "",
      showFilter: false,
      hiddenColumns:
        JSON.parse(localStorage.getItem(`${VIEW}_columns_${config.appID}`)) ||
        [],
      paramsList: [],
    }
  );

  const loadData = async (params) => {
    setState({ loading: true, skip: params?.skip || 0 });
    let response = await connectedList({
      limit: state.limit || "",
      // user_id: mailId,
      skip: params?.skip || 0,
      mail: state.mail,
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
        // loadMailList();
        if (res?.value) {
          if (state.selectedIDs?.length === 1) {
            setState({ setLoading: true });
            let response = null;
            response = await connectedDelete({ data: { id: ids[0] } });
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
          } else {
            setState({ progressVisible: true });
            Actions.multiAction({
              ids,
              limit: state.limit,
              skip: state.skip,
              dataLength: state.data?.length,
              url: "connectedDelete",
              reload: (skip) => loadData({ skip }),
              getData: ({
                total,
                TotalItems,
                successPercent,
                errorPercent,
              }) => {
                // loadMailList();
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

  React.useEffect(() => {
    loadData();
  }, [state.limit, state.mail]);

  React.useEffect(() => {
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  return (
    <ErrorBoundary>
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
        path={path}
        VIEW={VIEW}
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
