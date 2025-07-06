import React, { useEffect, useRef } from "react";
import { ErrorBoundary, Lang, useToast, Popup, Loading } from "fogito-core-ui";
import { Spinner, WYSIWYGEditor } from "@components";
import { useForm, Controller } from "react-hook-form";
import { mailMessage, mailsAdd, mailsInfo } from "@actions";
import { useParams } from "react-router-dom";

export const Reply = ({ onClose, reload, infoState }) => {
  const inputRef = useRef();
  const inputccRef = useRef();
  const inputbccRef = useRef();
  const toast = useToast();
  let urlParams = useParams();
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    { 
      loading: false,
      showCc: false,
      showBcc: false,
      subject: infoState.forwardData.subject,
      to: "",
      emails: [],
      carbon_copy: "",
      ccEmails: [],
      black_carbon_copy: "",
      bccEmails: [],
      message: infoState.forwardData.snippet,
    }
  );
  

  const loadData = async () => {
    setState({ loading: true });
    let response = await mailMessage({
      message_id: state.id,
      google_user_id: "114389651835405574925",
    });
    if (response) {
      if (response.status === "success" && response.data) {
        setState({
          data: response.data.conversation,
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

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ updateLoading: true });
    let response = null;
    if (!state.updateLoading && state.emails.length > 0) {
      response = await mailsAdd({
        data: {
          subject: state.subject,
          to: state.emails,
          carbon_copy: state.ccEmails,
          black_carbon_copy: state.bccEmails,
          message: state.message,
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
    } else {
      setState({ updateLoading: false });
      toast.fire({
        title: Lang.get("Enter valid email address"),
        icon: "error",
      });
    }
  };

  const onClickOutsideTo = () => {
    if (isEmail(state.to) && state.to.length < 40) {
      const newEmails = state.to.split(",").map((email) => email.trim());
      setState({
        emails: [...state.emails, ...newEmails.filter((email) => email !== "")],
      });
      setState({ to: "" });
    }
  };

  const onClickOutsideCc = () => {
    if (isEmail(state.carbon_copy) && state.carbon_copy.length < 40) {
      const newEmails = state.carbon_copy
        .split(",")
        .map((email) => email.trim());
      setState({
        ccEmails: [
          ...state.ccEmails,
          ...newEmails.filter((email) => email !== ""),
        ],
      });
      setState({ carbon_copy: "" });
    }
  };

  const onClickOutsideBcc = () => {
    if (
      isEmail(state.black_carbon_copy) &&
      state.black_carbon_copy.length < 40
    ) {
      const newEmails = state.black_carbon_copy
        .split(",")
        .map((email) => email.trim());
      setState({
        bccEmails: [
          ...state.bccEmails,
          ...newEmails.filter((email) => email !== ""),
        ],
      });
      setState({ black_carbon_copy: "" });
    }
  };

  // React.useEffect(() => {
  //   loadData();
  // }, []);

  useEffect(() => {
    const handleClickOutsideTo = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        onClickOutsideTo();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideTo);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideTo);
    };
  }, [onClickOutsideTo]);

  useEffect(() => {
    const handleClickOutsideCc = (event) => {
      if (inputccRef.current && !inputccRef.current.contains(event.target)) {
        onClickOutsideCc();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideCc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCc);
    };
  }, [onClickOutsideCc]);

  useEffect(() => {
    const handleClickOutsideBcc = (event) => {
      if (inputccRef.current && !inputccRef.current.contains(event.target)) {
        onClickOutsideBcc();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideBcc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideBcc);
    };
  }, [onClickOutsideBcc]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (isEmail(state.to) && state.to.length < 40) {
        const newEmails = state.to.split(",").map((email) => email.trim());
        setState({
          emails: [
            ...state.emails,
            ...newEmails.filter((email) => email !== ""),
          ],
        });
        setState({ to: "" });
      } else {
        toast.fire({
          title: Lang.get("Enter valid email address"),
          icon: "error",
        });
      }
    }
  };

  const handleccKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (isEmail(state.carbon_copy) && state.carbon_copy.length < 40) {
        const newEmails = state.carbon_copy
          .split(",")
          .map((email) => email.trim());
        setState({
          ccEmails: [
            ...state.ccEmails,
            ...newEmails.filter((email) => email !== ""),
          ],
        });
        setState({ carbon_copy: "" });
      } else {
        toast.fire({
          title: Lang.get("Enter valid email address"),
          icon: "error",
        });
      }
    }
  };

  const handlebccKeyDown = (e) => {
    if (
      e.key === "Enter" ||
      (e.key === "," && state.black_carbon_copy.langth < 50)
    ) {
      e.preventDefault();
      if (
        isEmail(state.black_carbon_copy) &&
        state.black_carbon_copy.length < 40
      ) {
        const newEmails = state.black_carbon_copy
          .split(",")
          .map((email) => email.trim());
        setState({
          bccEmails: [
            ...state.bccEmails,
            ...newEmails.filter((email) => email !== ""),
          ],
        });
        setState({ black_carbon_copy: "" });
      } else {
        toast.fire({
          title: Lang.get("Enter valid email address"),
          icon: "error",
        });
      }
    }
  };

  const removeEmail = (index) => {
    setState({
      emails: state.emails.filter((_, i) => i !== index),
    });
  };

  const removeccEmail = (index) => {
    setState({
      ccEmails: state.ccEmails.filter((_, i) => i !== index),
    });
  };

  const removebccEmail = (index) => {
    setState({
      bccEmails: state.bccEmails.filter((_, i) => i !== index),
    });
  };

  const inputFocus = () => {
    inputRef.current.focus();
  };

  const inputccFocus = () => {
    inputccRef.current.focus();
  };

  const inputbccFocus = () => {
    inputbccRef.current.focus();
  };

  const { control } = useForm({
    mode: "onChange",
  });

  const handleCcOnclick = () => {
    setState({ showCc: true });
  };

  const handleBccOnclick = () => {
    setState({ showBcc: true });
  };
  return (
    <ErrorBoundary>
      <Popup.Body>
        {state.loading && <Loading />}
        <div className="form-group col-md-12">
          <div className="form-group col-md-12">
            <label className="form-control-label">{Lang.get("Subject")}</label>
            <input
              className="form-control subject-input"
              placeholder={Lang.get("Subject")}
              value={state.subject}
              onChange={(e) => setState({ subject: e.target.value })}
            />
          </div>
          <div className="form-group col-md-12">
            <label className="form-control-label">{Lang.get("To")}</label>
            <div className="position-relative">
              <div
                className={
                  !state.showCc && !state.showBcc
                    ? "tag-container d-flex align-items-center"
                    : "tag-container-free d-flex align-items-center"
                }
                onClick={inputFocus}
              >
                {state.emails.map((email, index) => (
                  <div key={index} className="tag">
                    <span>{email}</span>
                    <i
                      className="feather feather-x"
                      onClick={() => removeEmail(index)}
                    ></i>
                  </div>
                ))}
                <input
                  ref={inputRef}
                  type="email"
                  className={
                    !state.showCc && !state.showBcc
                      ? "custom-input-fill  "
                      : "custom-input-fillCc  "
                  }
                  value={state.to}
                  onChange={(e) => setState({ to: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="custom-btn-input d-flex justify-content-center  ">
                {!state.showCc && !state.showBcc && (
                  <button onClick={handleCcOnclick}>Cc</button>
                )}
                {!state.showCc && !state.showBcc && (
                  <button onClick={handleBccOnclick}>Bcc</button>
                )}
              </div>
            </div>
          </div>
          {state.showCc && (
            <div className="form-group col-md-12">
              <label className="form-control-label mx-1">
                {Lang.get("Cc")}
              </label>
              <div className="position-relative">
                <div
                  className={
                    !state.showBcc
                      ? "tag-container-carbon d-flex align-items-center"
                      : "tag-container-free d-flex align-items-center"
                  }
                  onClick={inputccFocus}
                >
                  {state.ccEmails.map((email, index) => (
                    <div key={index} className="tag">
                      <span>{email}</span>
                      <i
                        className="feather feather-x"
                        onClick={() => removeccEmail(index)}
                      ></i>
                    </div>
                  ))}
                  <input
                    ref={inputccRef}
                    type="email"
                    className={
                      !state.showCc && !state.showBcc
                        ? "custom-input-fill  "
                        : "custom-input-fillCc  "
                    }
                    value={state.carbon_copy}
                    onChange={(e) => setState({ carbon_copy: e.target.value })}
                    onKeyDown={handleccKeyDown}
                  />
                </div>
                <div className="custom-btn-input d-flex justify-content-center  ">
                  {!state.showBcc && (
                    <button onClick={handleBccOnclick}>Bcc</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {state.showBcc && (
            <div className="form-group col-md-12">
              <label className="form-control-label mx-1">
                {Lang.get("Bcc")}
              </label>
              <div className="position-relative">
                <div
                  className={
                    !state.showCc
                      ? "tag-container-carbon d-flex align-items-center"
                      : "tag-container-free d-flex align-items-center"
                  }
                  onClick={inputbccFocus}
                >
                  {state.bccEmails.map((email, index) => (
                    <div key={index} className="tag">
                      <span>{email}</span>
                      <i
                        className="feather feather-x"
                        onClick={() => removebccEmail(index)}
                      ></i>
                    </div>
                  ))}
                  <input
                    ref={inputbccRef}
                    type="email"
                    className={
                      !state.showCc && !state.showBcc
                        ? "custom-input-fill  "
                        : "custom-input-fillCc  "
                    }
                    value={state.black_carbon_copy}
                    onChange={(e) =>
                      setState({ black_carbon_copy: e.target.value })
                    }
                    onKeyDown={handlebccKeyDown}
                  />
                </div>
                <div className="custom-btn-input d-flex justify-content-center  ">
                  {!state.showCc && state.showBcc && (
                    <button onClick={handleCcOnclick}>Cc</button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="form-group col-12">
            <label className="form-control-label">{Lang.get("Message")}</label>
            <Controller
              as={<WYSIWYGEditor defaultValue={state.message} />}
              name="editor_content"
              control={control}
              placeholder="mdfdfffffes"
              onChange={(data) => setState({ message: data[0] })}
            />
          </div>
        </div>
      </Popup.Body>
      <Popup.Footer>
        <div className="d-flex">
          <button onClick={onSubmit} className="btn btn-primary w-100">
            {state.saveLoading ? (
              <Spinner color="#fff" style={{ width: 30 }} />
            ) : (
              Lang.get("Send")
            )}
          </button>
          <button onClick={() => onClose()} className="btn btn-danger w-100">
            {Lang.get("Cancel")}
          </button>
        </div>
      </Popup.Footer>
    </ErrorBoundary>
  );
};
