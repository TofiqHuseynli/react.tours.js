import React from "react";
import moment from "moment";
import classNames from "classnames";
import Tooltip from "antd/lib/tooltip";
import Skeleton from "antd/lib/skeleton";
import { useDropzone } from "react-dropzone";
import {
  AppContext,
  ErrorBoundary,
  Textarea,
  Avatar,
  Popup,
  Auth,
  Lang,
  App,
  useToast,
  useModal,
} from "fogito-core-ui";
import { Users } from "./Users";
import { VoiceRecorder } from "./VoiceRecorder";
import { taskCommentDelete, taskCommentEdit, taskCommentAdd } from "@actions";
import { Spinner } from "@components";

export const Comments = ({ userPermissions, params, setUpdated }) => {
  const defaultParams = {
    text: "",
    files: [],
    mention_users: [],
  };
  const toast = useToast();
  const modal = useModal();
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (files) => onUpload(files),
  });
  const {
    methods,
    props: { comment_attachments },
  } = React.useContext(AppContext);
  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      disabled: false,
      reply: false,
      data: [],
      selected: null,
      selectedItem: null,
      params: defaultParams,
      addLoading: false,
      editLoading: false,
      filesLength: 3,
      img: null,

      voice_id: "",
      voiceUrl: "",
      isRecording: false,
      commentsLoading: false,
    }
  );

  const onCreate = async (e) => {
    e.preventDefault();
    setState({ addLoading: true });
    if (state.voice_id) {
      setState({ commentsLoading: true });
    }
    if (!state.addLoading) {
      let response = await taskCommentAdd({
        ...state.params,
        from: "web",
        mention_users: state.params.mention_users.map((row) => row.id),
        files: state.params.files?.length
          ? state.params.files
              .filter((row) => row !== null)
              .map((row) => row.id)
          : [],
        card: params.id,
        voice: state.voice_id,
      });
      if (response) {
        if (response?.status === "success") {
          setState({
            data: [...[response.data], ...state.data],
            params: defaultParams,
            addLoading: false,
          });
          if (state.voice_id) {
            setState({
              voiceUrl: "",
              voice_id: "",
              commentsLoading: false,
            });
          }
          setUpdated(true);
        } else {
          toast.fire({ icon: "error", title: response?.description });
        }
      }
    }
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    setState({ editLoading: true });
    if (!state.editLoading) {
      let response = await taskCommentEdit({
        ...state.selected,
        from: "web",
        mention_users: state.selected.mention_users.map((row) => row.id),
        files: state.selected.files.map((row) => row.id),
        card: params.id,
        voice: state.selected?.voice?.id,
      });
      setState({ editLoading: false });
      if (response?.status === "success") {
        setState({
          data: state.data.map((item) => {
            if (item.id === state.selected?.id) {
              item = {
                ...item,
                ...state.selected,
                files: response.data?.files || [],
              };
            }
            return item;
          }),
          selected: null,
          filesLength: 3,
        });
        setUpdated(true);
      } else {
        toast.fire({ icon: "error", title: response?.description });
      }
    }
  };

  const onDelete = (id) =>
    toast
      .fire({
        position: "center",
        toast: false,
        timer: null,
        title: Lang.get("DeleteAlertTitle"),
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
          let response = await taskCommentDelete({ id });
          setState({ commentsLoading: true });
          if (response) {
            setState({ commentsLoading: false });
            if (response?.status === "success") {
              setState({ data: state.data.filter((item) => item.id !== id) });
              setUpdated(true);
            } else {
              toast.fire({ icon: "error", title: response?.description });
            }
          }
        }
      });

  const onUpload = async (files) => {
    setState({ disabled: true });
    let response = await methods.uploadFiles(files);
    if (response) {
      setState({ disabled: false });
      if (state.selected) {
        setState({
          selected: {
            ...state.selected,
            files: [...state.selected.files, ...response],
          },
        });
      } else {
        setState({
          params: {
            ...state.params,
            files: [...state.params.files, ...response],
          },
        });
      }
    }
  };

  const onPaste = (e) => {
    let cFiles = e.clipboardData.files;
    let content = e.clipboardData.getData("text/html");
    if (
      cFiles.length > 0 &&
      cFiles[0] &&
      (!content || content.replace(/(<([^>]+)>)/gi, "").length < 1)
    ) {
      let files = [];
      for (let i = 0; i < cFiles.length; i++) {
        files.push(e.clipboardData.files[i]);
      }
      onUpload(files);
    }
  };

  const modalContent = () => {
    let content;
    switch (state.img?.type) {
      case "video":
        content = (
          <video width="100%" style={{ maxHeight: "500px" }} controls>
            <source src={state.img.url} type="video/mp4" />
            <source src={state.img.url} type="video/mp3" />
            {Lang.get("YourBrowserDoesNotSupportTheVideoTag")}
          </video>
        );
        break;
      case "audio":
        content = (
          <div className="d-flex justify-content-center">
            <audio controls>
              <source src={state.img.url} type="audio/mp3" />
              <source src={state.img.url} type="audio/mpeg" />
              {Lang.get("YourBrowserDoesNotSupportTheAudioTag")}
            </audio>
          </div>
        );
        break;
      default:
        content = (
          <a
            target="_blank"
            href={state.img?.url}
            rel="noreferrer nofollow noopener"
          >
            <img
              className="rounded w-100"
              style={{ maxHeight: "500px", objectFit: "contain" }}
              src={state.img?.url}
              alt={state.img?.url}
            />
          </a>
        );
        break;
    }
    return content;
  };

  React.useEffect(() => {
    params.id && setState({ data: params.comments });
  }, [params.id]);

  return (
    <ErrorBoundary>
      {/* Modals */}
      <Popup
        show={modal.modals.includes("users")}
        title={Lang.get("MentionedUser")}
        onClose={() => modal.hide("users")}
      >
        <Users
          card={params.id}
          users={state.selected?.mention_users || state.params.mention_users}
          onToggle={(mention_users) =>
            state.selected
              ? setState({
                  selected: { ...state.selected, mention_users },
                })
              : setState({ params: { ...state.params, mention_users } })
          }
        />
      </Popup>
      <Popup
        show={modal.modals.includes("img")}
        onClose={() => modal.hide("img")}
        title="Img"
        size="xl"
      >
        {modalContent()}
      </Popup>
      {/* Content */}
      <div {...getRootProps()}>
        {userPermissions?.comment_modify && (
          <React.Fragment>
            <input {...getInputProps()} />
            <div className="comment d-flex align-items-start">
              <img
                width="50"
                height="50"
                src={Auth.get("photo")?.tiny}
                className="rounded-circle mr-3"
                alt=""
              />
              <form className="flex-grow-1" onSubmit={onCreate}>
                <div className="form-group mb-2">
                  {state.voiceUrl ? (
                    <audio controls>
                      <source src={state.voiceUrl} type="audio/mp3" />
                    </audio>
                  ) : (
                    <Textarea
                      rows="2"
                      id="area"
                      className="form-control"
                      value={state.params.text}
                      disabled={state.isRecording}
                      onChange={(e) =>
                        setState({
                          params: { ...state.params, text: e.target.value },
                        })
                      }
                      placeholder={Lang.get("WriteAComment")}
                      onPaste={onPaste}
                    />
                  )}
                </div>
                {!state.selected && (
                  <div className="d-flex align-items-center">
                    {userPermissions?.attachment_modify &&
                      !state.isRecording && (
                        <button
                          type="button"
                          className="btn btn-link text-underline text-muted p-1"
                          onClick={open}
                        >
                          {Lang.get("AddAttachment")}
                        </button>
                      )}
                    <button
                      type="button"
                      className="btn btn-link text-underline text-muted p-1"
                      onClick={() => modal.show("users")}
                    >
                      {`${Lang.get("MentionUser")} (${
                        state.params.mention_users.length
                      })`}
                    </button>
                    {state.params.files.length > 0 && (
                      <span className="text-muted p-1">{`${Lang.get(
                        "Attachments"
                      )} (${state.params.files.length})`}</span>
                    )}
                    {state.params.text?.length ? (
                      <button
                        className="btn btn-primary rounded-circle ml-auto d-flex align-items-center justify-content-center"
                        style={{ width: 45, height: 45 }}
                      >
                        {state.addLoading ? (
                          <Spinner color="#fff" style={{ width: 40 }} />
                        ) : (
                          <i className="feather feather-send" />
                        )}
                      </button>
                    ) : (
                      <VoiceRecorder
                        loading={state.addLoading}
                        isRecording={state.isRecording}
                        voiceUrl={state.voiceUrl}
                        setState={(type, value) => setState({ [type]: value })}
                      />
                    )}
                  </div>
                )}
              </form>
            </div>
          </React.Fragment>
        )}
        {state.data.map((item, key) => {
          const files_length = item.files?.length;

          return (
            <React.Fragment key={key}>
              <div className="d-flex align-items-start mt-3">
                <Avatar size="md" user={item.creator} className="mr-3" />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <p className="font-weight-bold mb-0">
                      {item.creator?.fullname}
                    </p>
                    <span className="text-muted ml-auto">
                      {moment(item.created_at * 1000).format("D")}{" "}
                      {Lang.get(
                        App.get("months_list")[
                          Number(moment(item.created_at * 1000).format("M")) - 1
                        ]
                      ).slice(0, 3)}
                      {`${
                        moment().format("YYYY") !==
                        moment(item.created_at * 1000).format("YYYY")
                          ? `, ${moment(item.created_at * 1000).format("YYYY")}`
                          : ""
                      }`}{" "}
                      - {moment(item.created_at * 1000).format("HH:mm")}
                    </span>
                  </div>
                  {state.selected?.id === item.id ? (
                    <form onSubmit={onUpdate}>
                      <div className="form-group mb-2">
                        {state.selected?.voice ? (
                          <audio controls>
                            <source
                              src={state.selected.voice?.url}
                              type="audio/mp3"
                            />
                          </audio>
                        ) : (
                          <Textarea
                            rows="2"
                            value={state.selected.text}
                            className="form-control"
                            placeholder={Lang.get("WriteAComment")}
                            onChange={(e) =>
                              setState({
                                selected: {
                                  ...state.selected,
                                  text: e.target.value,
                                },
                              })
                            }
                            onPaste={onPaste}
                          />
                        )}
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          disabled={state.disabled}
                          className="btn btn-primary px-5 py-2"
                        >
                          {state.editLoading ? (
                            <Spinner color="#fff" style={{ width: 30 }} />
                          ) : (
                            Lang.get("Save")
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary px-5 py-2"
                          onClick={() => setState({ selected: null })}
                        >
                          {Lang.get("Cancel")}
                        </button>
                        <div className="core-members">
                          {state.selected.mention_users
                            ?.slice(0, 2)
                            ?.map((user, key) => (
                              <Tooltip title={user.fullname} key={key}>
                                <div>
                                  <Avatar
                                    user={user}
                                    className={classNames("core-members-item", {
                                      "ml-auto": key === 0,
                                      "ml-1": key !== 0,
                                    })}
                                  />
                                </div>
                              </Tooltip>
                            ))}
                          {state.selected.mention_users?.length > 2 ? (
                            <div>
                              <button
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                }}
                                className="btn btn-members p-0"
                                onClick={() => modal.show("users")}
                                type="button"
                              >{`+${
                                state.selected.mention_users.length - 2
                              }`}</button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-members p-0"
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                              }}
                              onClick={() => modal.show("users")}
                              type="button"
                            >
                              <i className="feather feather-plus" />
                            </button>
                          )}
                        </div>
                        <div className="ml-auto">
                          {state.selected?.files.length > 0 && (
                            <span className="text-muted">{`${Lang.get(
                              "Attachments"
                            )} (${state.selected.files.length})`}</span>
                          )}
                        </div>
                        {userPermissions?.attachment_modify && (
                          <button
                            type="button"
                            className="btn btn-link text-underline text-muted p-1 ml-1"
                            onClick={open}
                          >
                            {Lang.get("AddAttachment")}
                          </button>
                        )}
                      </div>
                    </form>
                  ) : (
                    <React.Fragment>
                      <div
                        className="form-control d-inline-block w-auto h-auto mb-1"
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        <div className="d-flex flex-column">
                          {item.voice ? (
                            <React.Fragment>
                              {state.commentsLoading ? (
                                <Skeleton.Button
                                  active
                                  size={"default"}
                                  block={false}
                                  style={{
                                    height: 54,
                                    width: 300,
                                    borderRadius: "0.3rem",
                                  }}
                                />
                              ) : (
                                <audio controls>
                                  <source
                                    src={item.voice.url}
                                    type={item.voice.type}
                                  />
                                </audio>
                              )}
                            </React.Fragment>
                          ) : (
                            item.text
                          )}
                          {!!files_length && (
                            <div className="d-flex flex-wrap mt-2">
                              {item.files
                                ?.slice(0, state.filesLength)
                                ?.map((file, key) => (
                                  <img
                                    key={key}
                                    width="40"
                                    height="40"
                                    alt="avatar"
                                    src={file?.avatars?.small}
                                    style={{
                                      objectFit:
                                        item.type.split("/")[0] === "image"
                                          ? "cover"
                                          : "contain",
                                    }}
                                    className={classNames(
                                      "rounded cursor-pointer mr-2",
                                      { "mb-2": files_length > 11 }
                                    )}
                                    onClick={() => {
                                      let type = file.type.split("/")[0];
                                      switch (type) {
                                        case "image":
                                          return (
                                            modal.show("img") +
                                            setState({
                                              img: { ...file, type },
                                            })
                                          );
                                        case "video":
                                          return (
                                            modal.show("img") +
                                            setState({
                                              img: { ...file, type },
                                            })
                                          );
                                        case "audio":
                                          return (
                                            modal.show("img") +
                                            setState({
                                              img: { ...file, type },
                                            })
                                          );
                                        case "application":
                                          return window.open(file.url);
                                        default:
                                          return window.open(file.url);
                                      }
                                    }}
                                  />
                                ))}
                              {files_length <= 3 ||
                                (files_length !== state.filesLength ? (
                                  <div
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "0.375rem",
                                    }}
                                    onClick={() =>
                                      setState({
                                        filesLength: files_length,
                                      })
                                    }
                                    className="cursor-pointer bg-primary text-white d-flex align-items-center justify-content-center"
                                  >{`+${files_length - 3}`}</div>
                                ) : (
                                  <div
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "0.375rem",
                                    }}
                                    onClick={() =>
                                      setState({
                                        filesLength:
                                          state.filesLength -
                                          (files_length - 3),
                                      })
                                    }
                                    className="cursor-pointer bg-primary text-white d-flex align-items-center justify-content-center"
                                  >{`-${files_length - 3}`}</div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="core-members mt-2">
                          {item.mention_users?.slice(0, 5)?.map((user, key) => (
                            <Tooltip title={user.fullname} key={key}>
                              <div>
                                <Avatar
                                  user={user}
                                  className={classNames("core-members-item", {
                                    "ml-auto": key === 0,
                                    "ml-1": key !== 0,
                                  })}
                                  onAction={() => {
                                    if (!!item.editable) {
                                      setState({
                                        selected: {
                                          id: item.id,
                                          text: item.text,
                                          files: item.files,
                                          mention_users: item.mention_users,
                                        },
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </Tooltip>
                          ))}
                          {item.mention_users?.length > 5 && (
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                              }}
                              onClick={() => {
                                if (!!item.editable) {
                                  setState({
                                    selected: {
                                      id: item.id,
                                      text: item.text,
                                      files: item.files,
                                      mention_users: item.mention_users,
                                    },
                                  });
                                }
                              }}
                              className="btn btn-members p-0"
                            >{`${item.mention_users.length - 5}+`}</div>
                          )}
                        </div>
                        <div className="d-flex align-items-center">
                          {!!item.editable && (
                            <button
                              className="btn btn-link text-underline text-muted p-1"
                              onClick={() =>
                                setState({
                                  selected: {
                                    id: item.id,
                                    text: item.text,
                                    files: item.files,
                                    mention_users: item.mention_users,
                                    voice: item.voice,
                                  },
                                })
                              }
                            >
                              {Lang.get("Edit")}
                            </button>
                          )}
                          {!!item.editable && (
                            <button
                              className="btn btn-link text-underline text-muted p-1"
                              onClick={() => onDelete(item.id)}
                            >
                              {Lang.get("Delete")}
                            </button>
                          )}
                          {!!item.repliable && (
                            <button
                              onClick={() => {
                                document.getElementById("area")?.focus();
                                if (
                                  !state.params.mention_users.find(
                                    (x) => x.id == item.creator.id
                                  )
                                ) {
                                  setState({
                                    params: {
                                      ...state.params,
                                      mention_users: [
                                        ...state.params.mention_users,
                                        item.creator,
                                      ],
                                    },
                                  });
                                }
                              }}
                              className="btn btn-link text-underline text-muted p-1"
                            >
                              {Lang.get("Reply")}
                            </button>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </ErrorBoundary>
  );
};
