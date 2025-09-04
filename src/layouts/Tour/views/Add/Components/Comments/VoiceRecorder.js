// import React from "react";
// import classNames from "classnames";
// import { Spinner, Api, useToast } from "fogito-core-ui";
// import { useReactMediaRecorder } from "react-media-recorder";
// import { API_ROUTES } from "@config";

// let xhr = [];
// export const VoiceRecorder = ({ loading, isRecording, voiceUrl, setState }) => {
//   const toast = useToast();
//   const [uploadLoading, setUploadLoading] = React.useState(false);
//   const [counter, setCounter] = React.useState(0);
//   const [timer, setTimer] = React.useState("00:00");
//   const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder(
//     {
//       audio: isRecording,
//       onStop: (blobUrl, blob) => onUpload(blobUrl, blob),
//     }
//   );

//   const onUpload = async (blobUrl, blob) => {
//     setUploadLoading(true);
//     let response = null;

//     let formData = new FormData();
//     formData.append("for", "user");
//     formData.append("file", blob, "voice.mp3");

//     xhr = new XMLHttpRequest();
//     xhr.addEventListener("load", function (e) {
//       response = JSON.parse(e.target.responseText);
//       if (response.status === "success") {
//         setState("voice_id", response.data.id);
//         setState("voiceUrl", response.data.file);
//         setUploadLoading(false);
//       } else {
//         toast.fire({
//           title: response.description,
//           icon: "error",
//         });
//       }
//     });

//     xhr.open("POST", Api.convert(API_ROUTES["filesUpload"]), true);
//     xhr.withCredentials = true;
//     xhr.send(formData);
//   };

//   const stopTimer = () => {
//     setState("isRecording", false);
//     stopRecording();
//     setTimer("00:00");
//     setCounter(0);
//   };

//   React.useEffect(() => {
//     let intervalId;

//     if (isRecording) {
//       intervalId = setInterval(() => {
//         const secondCounter = counter % 60;
//         const minuteCounter = Math.floor(counter / 60);

//         let computedSecond =
//           String(secondCounter).length === 1
//             ? `0${secondCounter}`
//             : secondCounter;
//         let computedMinute =
//           String(minuteCounter).length === 1
//             ? `0${minuteCounter}`
//             : minuteCounter;

//         setCounter((counter) => counter + 1);

//         setTimer(`${computedMinute}:${computedSecond}`);
//       }, 1000);
//     }

//     return () => clearInterval(intervalId);
//   }, [isRecording, counter]);

//   React.useEffect(() => {
//     if (isRecording) {
//       startRecording();
//     }
//   }, [isRecording]);

//   return (
//     <div className="position-relative ml-auto d-flex align-items-center">
//       {voiceUrl ? (
//         <div className="d-flex align-items-center ml-auto">
//           <button
//             type="button"
//             className="btn btn-danger rounded-circle ml-auto d-flex align-items-center justify-content-center"
//             style={{ width: 45, height: 45 }}
//             onClick={() => setState("voiceUrl", "")}
//           >
//             <i className="feather feather-x" />
//           </button>
//           <button
//             className="btn btn-primary rounded-circle ml-auto d-flex align-items-center justify-content-center"
//             style={{ width: 45, height: 45 }}
//           >
//             {loading ? (
//               <Spinner color="#fff" style={{ width: 40 }} />
//             ) : (
//               <i className="feather feather-send" />
//             )}
//           </button>
//         </div>
//       ) : (
//         <React.Fragment>
//           {isRecording && (
//             <div className="circles">
//               <div className="circle1" />
//               <div className="circle2" />
//               <div className="circle3" />
//             </div>
//           )}
//           <span className={classNames("timer", { active: isRecording })}>
//             {timer}
//           </span>
//           <button
//             onClick={() => {
//               setState("isRecording", !isRecording);
//               if (!isRecording) {
//                 setState("isRecording", true);
//               } else {
//                 stopTimer();
//               }
//             }}
//             type="button"
//             className={`btn btn-${
//               isRecording ? "danger" : "primary"
//             } rounded-circle d-flex align-items-center justify-content-center`}
//             style={{ width: 45, height: 45, zIndex: 1 }}
//           >
//             {uploadLoading ? (
//               <Spinner color="#fff" style={{ width: 40 }} />
//             ) : (
//               <i
//                 className={`feather feather-${
//                   isRecording ? "stop-circle fs-24" : "mic"
//                 }`}
//               />
//             )}
//           </button>
//         </React.Fragment>
//       )}
//     </div>
//   );
// };
