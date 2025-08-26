import React from "react";
import Progress from "antd/lib/progress";
import Tooltip from "antd/lib/tooltip";
import { useDropzone } from "react-dropzone";
import {
  AppContext,
  ErrorBoundary,
  Popup,
  Lang,
  Api,
  useToast,
  useModal,
} from "fogito-core-ui";

let xhr = [];
export const Attachments = ({ setParams, params }) => {
  const modal = useModal();
  const toast = useToast();
  const { setProps } = React.useContext(AppContext);
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (files) => onUpload(files),
  });
  const { setMethods } = React.useContext(AppContext);
  const [data, setData] = React.useState([]);
  const [img, setImg] = React.useState("");

  const onUpload = React.useCallback(
    async (files) => {
      return Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const rdm = `id_${Math.random().toString(32).substr(2, 9)}`;
              let key = `${file.lastModified}_${rdm}`;
              setData((prevData) => {
                prevData.unshift({
                  key,
                  percent: 0,
                  loading: true,
                });
                return prevData;
              });
              setProps({ check_attachments_finish: "loading" });

              let formData = new FormData();
              formData.append("for", "user");
              formData.append("file", file);

              xhr[key] = new XMLHttpRequest();
              xhr[key].upload.addEventListener("progress", (e) => {
                var percent = Math.round((e.loaded / e.total) * 100);
                setData((prevData) =>
                  prevData.map((item) => {
                    if (item.key === key) {
                      item.percent = percent;
                    }
                    return item;
                  })
                );
              });

              xhr[key].addEventListener("load", (e) => {
                let response = JSON.parse(e.target.responseText);
                if (response.status === "success") {
                  resolve(response.data);
                } else {
                  resolve(null);
                  onDelete({ key });
                  toast.fire({
                    icon: "error",
                    title: response.description,
                  });
                }
              });

              xhr[key].open("POST", Api.convert(Api.routes?.filesUpload));
              xhr[key].withCredentials = true;
              xhr[key].send(formData);
            })
        )
      ).then((response) => {
        let accepted = response.filter((row) => row);
        if (accepted.length) {
          let arr = [];
          arr.push(accepted);
          setData((prevData) => [
            ...arr[0],
            ...prevData.filter((item) => item.percent !== 100),
          ]);
          setProps({ check_attachments_finish: "ready" });
        }
      });
    },
    [data]
  );

  const onDelete = ({ id, key }) => {
    if (key) {
      setData((prevData) => prevData.filter((item) => item.key !== key));
      if (xhr[key]) {
        xhr[key].abort();
      }
    } else {
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
            setData((prevData) => prevData.filter((item) => item.id !== id));
          }
        });
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
    switch (img.type) {
      case "video":
        content = (
          <video width="100%" style={{ maxHeight: "500px" }} controls>
            <source src={img.file} type="video/mp4" />
            <source src={img.file} type="video/ogg" />
            {Lang.get("YourBrowserDoesNotSupportTheVideoTag")}
          </video>
        );
        break;
      case "audio":
        content = (
          <div className="d-flex justify-content-center">
            <audio controls>
              <source src={img.file} type="audio/ogg" />
              <source src={img.file} type="audio/mpeg" />
              {Lang.get("YourBrowserDoesNotSupportTheAudioTag")}
            </audio>
          </div>
        );
        break;
      default:
        content = (
          <a
            onClick={() => parent.window.open(img?.url)}
            rel="noreferrer nofollow noopener"
          >
            <img
              className="rounded w-100"
              style={{ maxHeight: "500px", objectFit: "contain" }}
              src={img?.file}
              alt={img?.file}
            />
          </a>
        );
        break;
    }
    return content;
  };

  React.useEffect(() => {
    setMethods({
      uploadFiles: (files) => onUpload(files),
    });
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("paste", onPaste);
    };
  }, [onUpload]);

  React.useEffect(() => {
    setParams({ ...params, file_ids: data });
  }, [data]);

  return (
    <ErrorBoundary>
      <Popup
        show={modal.modals.includes("img")}
        onClose={() => modal.hide("img")}
        title={`${img.filename?.slice(0, 50)}${
          img.filename?.length > 50 ? "..." : ""
        }.${img.type}`}
        size="xl"
      >
        {modalContent()}
      </Popup>
      <label>{Lang.get("CheckList")}</label>
      <div className="attachments row">
        {data.map((item, key) => (
          <div
            className="attachment-item rounded col-3"
            id="attachments"
            key={key}
          >
            {!item.loading && (
              <React.Fragment>
                <button
                  className="btn btn-danger feather feather-x attachment-icon p-0"
                  onClick={() => onDelete({ id: item.id })}
                />
                <a
                  onClick={() => parent.window.open(item.url)}
                  className="btn btn-primary attachment-icon attachment-download-icon p-0"
                  download
                >
                  <svg
                    width="512"
                    height="512"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 13, height: 13 }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M87.155 1.53369C46.248 8.92469 13.981 38.7147 2.75 79.4597L0.179755 88.7845C0.0604617 89.2173 0 89.6642 0 90.1132V255.937V421.76C0 422.209 0.0604619 422.656 0.179755 423.089L2.75 432.414C13.14 470.108 41.329 498.297 79.023 508.687L88.3478 511.257C88.7806 511.376 89.2275 511.437 89.6765 511.437H255.5H421.324C421.772 511.437 422.219 511.376 422.652 511.257L431.977 508.687C469.678 498.295 497.934 470.032 508.231 432.414L510.787 423.075C510.903 422.651 510.963 422.214 510.965 421.775L511.27 342.224C511.577 262.435 511.567 261.989 509.48 257.899C507.983 254.963 506.184 253.242 503.191 251.884C497.948 249.503 496.054 249.502 490.828 251.875C482.456 255.676 483.072 249.296 482.429 338.892C482.014 396.543 481.523 419.676 480.643 422.937C472.487 453.16 450.998 474.315 421.5 481.161C413.451 483.029 97.549 483.029 89.5 481.161C59.616 474.225 37.212 451.821 30.276 421.937C28.408 413.888 28.408 97.9857 30.276 89.9367C36.148 64.6347 54.32 43.2267 77.298 34.5417C90.632 29.5017 88.639 29.6177 172.045 29.0117C259.898 28.3727 254.423 28.8387 258.141 21.6777C261.864 14.5047 259.38 5.92369 252.454 2.03069C248.758 -0.0463052 248.111 -0.0623054 171.864 0.0266946C110.196 0.0986946 93.449 0.396695 87.155 1.53369ZM350.571 1.67769C340.614 6.78469 339.976 20.3727 349.398 26.6667L351.535 28.0943C352.357 28.6435 353.324 28.9367 354.312 28.9367H407.396H449.934C454.387 28.9367 456.619 34.3201 453.471 37.4706L348.352 142.687C285.847 205.25 234.21 257.42 233.603 258.621C230.576 264.614 233.671 274.422 239.547 277.461C242.914 279.202 249.728 279.393 252.816 277.834C254.017 277.227 306.188 225.59 368.75 163.085L473.966 57.9657C477.117 54.8181 482.5 57.0495 482.5 61.5029V104.041V157.124C482.5 158.113 482.793 159.08 483.342 159.902L484.77 162.039C491.064 171.46 504.672 170.821 509.748 160.866C511.366 157.694 511.497 151.962 511.497 84.4367C511.497 16.9117 511.366 11.1797 509.748 8.00769C508.787 6.12169 506.73 3.64669 505.177 2.50769C502.39 0.462695 501.422 0.433695 428.177 0.177695C359.058 -0.0633054 353.766 0.0386946 350.571 1.67769Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </React.Fragment>
            )}
            {item.loading ? (
              <Progress type="circle" percent={item.percent} />
            ) : (
              <Tooltip
                title={
                  <div className="text-center">{`${item.filename}.${item.type}`}</div>
                }
                getPopupContainer={() => document.getElementById("attachments")}
              >
                <img
                  onClick={() => {
                    let type = item.type.split("/")[0];
                    switch (type) {
                      case "image":
                        return modal.show("img") + setImg({ ...item, type });
                      case "video":
                        return modal.show("img") + setImg({ ...item, type });
                      case "audio":
                        return modal.show("img") + setImg({ ...item, type });
                      default:
                        return parent.window.open(item.url);
                    }
                  }}
                  alt="avatar"
                  style={{
                    objectFit:
                      item.type.split("/")[0] === "image" ? "cover" : "contain",
                  }}
                  src={item.avatars?.medium || item.icon}
                  className="cursor-pointer rounded"
                />
              </Tooltip>
            )}
          </div>
        ))}
      </div>
      <div {...getRootProps({ className: "form-group" })}>
        <input {...getInputProps()} />
        <button
          className="btn btn-secondary d-flex align-items-center"
          onClick={open}
        >
          {Lang.get("AddAttachment")}
          <i className="feather feather-file ml-2" />
        </button>
      </div>
    </ErrorBoundary>
  );
};
