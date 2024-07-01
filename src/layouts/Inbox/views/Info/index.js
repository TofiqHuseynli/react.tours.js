import React from "react";
import {ErrorBoundary, Loading} from "fogito-core-ui";
import { useParams } from "react-router-dom";
import { mailsInfo } from "@actions";
import {InfoCard} from "./components";

export const Info = ({ }) => {
  let urlParams = useParams();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      id: urlParams?.id,
      loading: true,
      skip: 0,
      data: [],
      params: {},
    }
  );

  const loadData = async () => {
    setState({ loading: true });
    let response = await mailsInfo({ id: state.id });
    if (response) {
      if (response.status === "success" && response.data) {
        setState({ data: response.data });
      }
      setState({ loading: false });
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  if (state.loading){
      return (<Loading/>);
  }
  return (
      <ErrorBoundary>
          <div className="p-3 mb-3 bg-white rounded d-flex card-bg ">
              <h3 className="mr-1">Subject: </h3>
              <p>{state.data[0].subject}</p>
          </div>

          {
              state.data.map((data, key) => (
                  <InfoCard
                      data={data}
                      key={key}
                  />
              ))
          }
      </ErrorBoundary>
  );
};
