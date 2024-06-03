import React from "react";
import { ErrorBoundary, Lang, Popup } from "fogito-core-ui";
import { useParams } from "react-router-dom";
import { mailsList } from "@actions";

export const Info = ({ onClose, reload, match }) => {
  let urlParams = useParams();

  const [state, setState] = React.useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      loading: true,
      skip: 0,
      params: {
        id: urlParams?.id,
        subject: "",
      },
      data: [],
    }
  );

  const loadData = async (params) => {
    setState({ loading: true, skip: params?.skip || 0 });
    let response = await mailsList({ id: state.id });
    if (response.status == "success") {
      setState({ data: response.data });
    }
    setState({ loading: false });
  };

  state.data.map((e) => {
    if (e.id == state.params.id) {
      console.log(e.id);
    }
  });

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <ErrorBoundary>
      <div className="d-flex flex-column">
        <div className="p-3 mb-3  bg-white rounded d-flex ">
          <h3 className="mr-1">Subject: </h3>
          <p>
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley
          </p>
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
              Lorem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and lorem
              ldlm lkmlm l1500s, when an unknown printer took
            </p>
          </div>
        </div>
      </div>

      <div className="pl-7 p-5 mb-1 bg-white rounded ">
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
            Still in their infancy. Various versions have evolved over the years, sometimes by accident,
             sometimes on purpose injected humour and the like, opposed to using. 
            </p>
          </div>
        </div>
    </ErrorBoundary>
  );
};

{
  /* <div className="d-flex justify-content-end align-items-start">
            <div className="inbox-profil-img mr-3">
              <img
                src="https://media.istockphoto.com/id/1171169127/photo/headshot-of-cheerful-
                handsome-man-with-trendy-haircut-and-eyeglasses-isolated-on-gray.jpg?s=612x612&w=0&k=20&c=yqAKmCqnpP_T8M8I5VTKxecri1xutkXH7zfybnwVWPQ="
                width={50}
                height={50}
                className="rounded-circle"
              />
            </div>
            <div className="inbox-user-info mr-2">
              <span>Asif Huseynli</span>
              <div className="d-flex test-bg align-items-center ">
                <p className="receiver-mail">to Maryam</p>
                <i className="feather feather-chevron-down  mb-3" />
              </div>
            </div>
            <div className="inbox-email ">
              <span>&lt;asifhuseynli56@gmail.com&gt;</span>
            </div>
            <div className="ml-auto">
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
          </div> */
}

//     <div className="pl-7 p-5 mb-1 bg-white rounded ">
//   <div className="d-flex justify-content-end align-items-start">
//     <div className="inbox-profil-img mr-3">
//       <img
//         src="https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp"
//         width={50}
//         height={50}
//         className="rounded-circle"
//       />
//     </div>
//     <div className="inbox-user-info mr-2">
//       <span>Maryam Mahmudova</span>
//       <div className="d-flex test-bg align-items-center ">
//         <p className="receiver-mail">to me</p>
//         <i className="feather feather-chevron-down  mb-3" />
//       </div>
//     </div>
//     <div className="inbox-email ">
//       <span>&lt;maryammahmudova6@gmail.com&gt;</span>
//     </div>
//     <div className="ml-auto">
//       <button
//         data-toggle="dropdown"
//         className="btn shadow-none bg-transparent feather feather-more-vertical p-0"
//         style={{
//           fontSize: "1.2rem",
//           height: "22px",
//           lineHeight: "1px",
//           transform: "rotate(90deg)",
//         }}
//       />
//     </div>
//   </div>

//   <div className="inbox-message-content mt-3 container ml-0">
//     <p>
//       Lorem Ipsum has been the industry's standard dummy text ever since
//       the 1500s, when an unknown pIpsum has been the industry's standard
//       dummy text ever since the 1500s, when. Ipsum has been the industry's
//       standard dummy text ever since the 1500s, when
//     </p>
//   </div>
// </div>
