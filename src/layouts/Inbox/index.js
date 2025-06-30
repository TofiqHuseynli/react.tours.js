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
  mailsList,
  mailsDelete,
} from "@actions";
import moment from "moment";
import { Filters, HeaderCustom, TableCustom, ViewRoutes } from "./components";
import { config } from "@config";
import { Create, Forward } from "./views";

export const Inbox = ({ name, mailId, history, match: { path, url } }) => {
  const toast = useToast();
  const modal = useModal();
  const VIEW = "inbox";
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
      googleUserId: "",
      nextPageToken: null,
      hiddenColumns:
        JSON.parse(localStorage.getItem(`${VIEW}_columns_${config.appID}`)) ||
        [],
      paramsList: [],
      recipient: getFilterToLocal(name, "recipient") || null,
      showFilter: false,
      filters: {
        subject: "",
        range: {
          start_date: getFilterToLocal(name, "date")
            ? moment
                .unix(getFilterToLocal(name, "date")?.split("T")[0] || "")
                .format("YYYY-MM-DD")
            : null,
          end_date: getFilterToLocal(name, "date")
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
    let response = await mailsList({
      limit: state.limit || "",
      user_id: mailId,
      skip: params?.skip || 0,
      sort: "created_at",
      recipient: state.recipient || "",
      subject: state.filters.subject,
      start_date: state.filters.range.start_date
        ? moment(`${state.filters.range.start_date} 00:00:00`).unix()
        : "",
      end_date: state.filters.range.end_date
        ? moment(`${state.filters.range.end_date} 23:59:59`).unix()
        : "",
      ...params,
    });
    if (response) {
      setState({ loading: false, progressVisible: false });
      if (response.status === "success") {
        setState({
          data: response.data,
          count: response.count,
          googleUserId: response.google_user_id,
        });
      } else if (response.code === "NO_ACCESS_TOKEN") {
        console.log("Isledi");
        modal.show("add");
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
          if (state.selectedIDs?.length === 1) {
            setState({ setLoading: true });
            let response = null;
            response = await mailsDelete({ data: { id: ids[0] } });
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
      recipient: null,
      filters: {
        subject: "",
        range: { start_date: null, end_date: null },
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
  }, [state.recipient, state.limit, state.filters]);

  React.useEffect(() => {
    setProps({ activeRoute: { name, path } });
    return () => {
      setProps({ activeRoute: { name: null, path: null } });
    };
  }, []);

  const filters = {
    recipient: state.recipient === "" ? null : state.recipient,
    subject: state.filters.subject === "" ? null : state.filters.subject,
    range:
      state.filters.range?.start_date === null &&
      state.filters.range?.end_date === null
        ? null
        : state.filters.range,
  };
  return (
    <ErrorBoundary>
      <Popup
        title={Lang.get("Add")}
        show={modal.modals.includes("add")}
        onClose={() => modal.hide("add")}
      >
        <Create onClose={() => modal.hide("add")} reload={() => loadData()} />
      </Popup>
      <Popup
        title={Lang.get("Forward")}
        show={modal.modals.includes("forward")}
        onClose={() => modal.hide("forward")}
        size="xl"
      >
        <Forward
          onClose={() => modal.hide("forward")}
          reload={() => loadData()}
        />
      </Popup>
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
        inboxState={state.googleUserId}
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
