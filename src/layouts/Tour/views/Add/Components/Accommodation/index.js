import { MultiForm } from "@components";
import { ErrorBoundary } from "fogito-core-ui";
import React from "react";
export const Accommodation = ({ state, setState, params, setParams }) => {
  return (
    <ErrorBoundary>
      <MultiForm state={state} params={params} setParams={setParams} setState={setState} />
    </ErrorBoundary>
  );
};
