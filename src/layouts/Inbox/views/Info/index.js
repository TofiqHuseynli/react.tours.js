import React from "react";
import { ErrorBoundary, Loading, useToast, Popup, Lang } from "fogito-core-ui";
import { useParams } from "react-router-dom";
import { mailsInfo } from "@actions";
import { InfoCard } from "./components";
import { Forward } from "../Forward";
import { Reply } from "../Reply";

export const Info = ({ inboxState, modal }) => {
  let urlParams = useParams();
  const toast = useToast();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      id: urlParams?.id,
      loading: true,
      forwardData: null,
      replyData: null,
      skip: 0,
      data: [],
      subject:"",
      params: {},
    }
  );

  const loadData = async () => {
    setState({ loading: true });
    let response = await mailsInfo({
      id: state.id,
      google_user_id: "114389651835405574925",
    });
    if (response) {
      if (response.status === "success" && response.data) {

        //format data. seperate message with /r/n
        const formattedConversation = response.data.conversation.map((msg) => ({
          ...msg,
          message: msg.body.split('\r\n\r\nOn ')[0].trim(),
          message_info: msg.body.split('\r\n\r\nOn ')[1],
        }));

        setState({
          data: formattedConversation,
          subject: response.data.conversation[0].subject,
          loading: false,
        });
      } else {
        toast.fire({
          title: response.message,
          icon: response.status,
        });
      }
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  if (state.loading) {
    return <Loading />;
  }
  return (
    <ErrorBoundary>
      <Popup
        title={Lang.get("Forward")}
        show={modal.modals.includes("forward")}
        onClose={() => modal.hide("forward")}
        size="xl"
      >
        <Forward
          onClose={() => modal.hide("forward")}
          reload={() => loadData()}
          infoState={state} 
        />
      </Popup>
      <Popup
        title={Lang.get("Reply")}
        show={modal.modals.includes("reply")}
        onClose={() => modal.hide("reply")}
        size="xl"
      >
        <Reply
          onClose={() => modal.hide("reply")}
          reload={() => loadData()}
          infoState={state} 
        />
      </Popup>
      <div className="p-3 mb-3 bg-white rounded d-flex card-bg ">
        <h3 className="mr-1">Subject: </h3>
        <p>{state.subject}</p>
      </div>
      {state.data.map((data, key) => (
        <InfoCard data={data} key={key} modal={modal} setState={setState}  />
      ))}
    </ErrorBoundary>
  );
};
