import React from "react";
import { ErrorBoundary, Lang, Popup } from "fogito-core-ui";
import { useParams } from "react-router-dom";
import { mailsInfo } from "@actions";
import { GeneralSkeleton } from "@components";

export const Info = ({}) => {
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

  console.log(state.data[0]);

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

  return (
    <ErrorBoundary>
      {!state.loading && (
        <div className="p-3 mb-3  bg-white rounded d-flex ">
          <h3 className="mr-1">Subject: </h3>
          <p>{state.data[0].subject}</p>
        </div>
      )}
      {state.loading ? (
        <GeneralSkeleton />
      ) : (
        state.data.map((data, key) => (
          <div className="d-flex flex-column" key={key}>
            <div className="p-5 mb-1 bg-white rounded ">
              <div className="row">
                <div className="col-auto">
                  <img
                    src="https://media.istockphoto.com/id/1171169127/photo/headshot-of-cheerful-handsome-man-with-trendy-haircut-and-eyeglasses-isolated-on-gray.jpg?s=612x612&w=0&k=20&c=yqAKmCqnpP_T8M8I5VTKxecri1xutkXH7zfybnwVWPQ="
                    width={50}
                    height={50}
                    className="rounded-circle profil-img"
                  />
                </div>
                <div className="col-auto">
                  <div>
                    <span></span>
                    <span>{data.from}</span>
                  </div>
                  <div className="d-flex   ">
                    <p className="receiver-mail">{data.to}</p>

                    <div className="dropright ml-1">
                      <button
                        data-toggle="dropdown"
                        className="btn shadow-none bg-transparent feather feather-chevron-down p-0"
                        style={{
                          fontSize: "1.2rem",
                          height: "22px",
                          lineHeight: "1px",
                        }}
                      />
                      <div className="dropdown-menu">
                        {/* <Link
                          className="text-dark"
                          to={`${path}/info/${data?.id}`}
                        >
                          <button className="dropdown-item">
                            {Lang.get("Info")}
                          </button>
                        </Link> */}
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => onDelete([data.id])}
                        >
                          {Lang.get("Delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto ml-auto mr-2">
                  <button
                    data-toggle="dropdown"
                    className="btn shadow-none bg-transparent feather feather-more-vertical p-0"
                    style={{
                      fontSize: "1.2rem",
                      height: "22px",
                      lineHeight: "1px",
                      transform: "rotate(90deg)",
                    }}
                  />
                </div>
              </div>
              <div className="inbox-message-content mt-3 container ml-0">
                <p>{data.snippet}</p>
              </div>
            </div>
          </div>
        ))
      )}

      {/* <div className="pl-7 p-5 mb-1 bg-white rounded ">
        <div className="row">
          <div className="col-auto">
            <img
              src="https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp"
              width={50}
              height={50}
              className="rounded-circle profil-img"
            />
          </div>
          <div className="col-auto">
            <span>Maryam Mahmudova</span>
            <div className="d-flex test-bg align-items-center ">
              <p className="receiver-mail">to me</p>
              <i className="feather feather-chevron-down  mb-3" />
            </div>
          </div>
          <div className="col-auto p-0">
            <span>&lt;maryammahmudova6@gmail.com&gt;</span>
          </div>
          <div className="col-auto ml-auto mr-2">
            <button
              data-toggle="dropdown"
              className="btn shadow-none bg-transparent feather feather-more-vertical p-0"
              style={{
                fontSize: "1.2rem",
                height: "22px",
                lineHeight: "1px",
                transform: "rotate(90deg)",
              }}
            />
          </div>
        </div>
        <div className="inbox-message-content mt-3 container ml-0">
          <p>
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown pIpsum has been the industry's standard
            dummy text ever since the 1500s, when. Ipsum has been the industry's
            standard dummy text ever since the 1500s, when
          </p>
        </div>
      </div>

      <div className="p-5 mb-1 bg-white rounded ">
        <div className="row">
          <div className="col-auto">
            <img
              src="https://media.istockphoto.com/id/1171169127/photo/headshot-of-cheerful-handsome-man-with-trendy-haircut-and-eyeglasses-isolated-on-gray.jpg?s=612x612&w=0&k=20&c=yqAKmCqnpP_T8M8I5VTKxecri1xutkXH7zfybnwVWPQ="
              width={50}
              height={50}
              className="rounded-circle profil-img"
            />
          </div>
          <div className="col-auto">
            <span>Asif Huseynli</span>
            <div className="d-flex test-bg align-items-center ">
              <p className="receiver-mail">to Maryam</p>
              <i className="feather feather-chevron-down  mb-3" />
            </div>
          </div>
          <div className="col-auto p-0">
            <span>&lt;asifhuseynli56@gmail.com&gt;</span>
          </div>
          <div className="col-auto ml-auto mr-2">
            <button
              data-toggle="dropdown"
              className="btn shadow-none bg-transparent feather feather-more-vertical p-0"
              style={{
                fontSize: "1.2rem",
                height: "22px",
                lineHeight: "1px",
                transform: "rotate(90deg)",
              }}
            />
          </div>
        </div>
        <div className="inbox-message-content mt-3 container ml-0">
          <p>
            Still in their infancy. Various versions have evolved over the
            years, sometimes by accident, sometimes on purpose injected humour
            and the like, opposed to using.
          </p>
        </div>
      </div> */}
    </ErrorBoundary>
  );
};
