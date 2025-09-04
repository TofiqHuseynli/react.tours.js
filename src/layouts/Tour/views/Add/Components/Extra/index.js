import { ErrorBoundary, InputCheckbox, Lang } from "fogito-core-ui";
import React from "react";
export const Extra = ({ state, params, setState, setParams, onSubmit }) => {
  return (
    <ErrorBoundary>
      <div className="row justify-content-between">
        <div className="form-group col-xl-3  extra-srv-checkbox">
          <InputCheckbox
            label={Lang.get("Service1")}
            checked={params.extra_service.service1}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service1: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className="form-group col-xl-3  extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service2")}
            checked={params.extra_service.service2}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service2: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className=" form-group col-xl-3 extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service3")}
            checked={params.extra_service.service3}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service3: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className=" form-group col-xl-3 extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service4")}
            checked={params.extra_service.service4}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service4: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className=" form-group col-xl-3 extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service5")}
            checked={params.extra_service.service5}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service5: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className=" form-group col-xl-3 extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service6")}
            checked={params.extra_service.service6}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service6: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className=" form-group col-xl-3 extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service7")}
            checked={params.extra_service.service7}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service7: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className=" form-group col-xl-3 extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service8")}
            checked={params.extra_service.service8}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service8: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className=" form-group col-xl-3 extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service9")}
            checked={params.extra_service.service9}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service9: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>

        <div className=" form-group col-xl-3 extra-srv-checkbox ">
          <InputCheckbox
            label={Lang.get("Service10")}
            checked={params.extra_service.service10}
            onChange={(e) =>
              setParams({
                ...params,
                extra_service: {
                  ...(!!e.target.checked && !params.extra_service.sending
                    ? {
                        sending: { type: "complete" },
                        items: [],
                        append_date: 0,
                      }
                    : { ...params.invoice }),
                  service10: !!e.target.checked ? 1 : 0,
                },
              })
            }
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};
