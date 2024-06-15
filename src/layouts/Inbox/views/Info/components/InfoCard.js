import React from "react";
import {ErrorBoundary, Lang,} from "fogito-core-ui";

export const InfoCard = ({data, key}) => {

    return (
        <ErrorBoundary>
            <div className="p-5 mb-1 bg-white rounded " key={key}>
                <div className="d-flex">
                    <div className="d-flex">
                        <img
                            alt='profile'
                            src="https://media.istockphoto.com/id/1171169127/photo/headshot-of-cheerful-handsome-man-with-trendy-haircut-and-eyeglasses-isolated-on-gray.jpg?s=612x612&w=0&k=20&c=yqAKmCqnpP_T8M8I5VTKxecri1xutkXH7zfybnwVWPQ="
                            width={50}
                            height={50}
                            className="rounded-circle profil-img mr-2"
                        />

                        <div>
                            <span>{data.from}</span>

                            <div className='d-flex align-items-center'>
                                <span className="fs-14">{data.to}</span>
                                <div className="ml-1">
                                    <i
                                        data-toggle="dropdown"
                                        style={{lineHeight:'30px'}}
                                        className="feather feather-chevron-down fs-20 cursor-pointer"
                                    ></i>
                                    <div className="dropdown-menu p-3">
                                        <ul className='m-0 p-0'>
                                            <li>
                                                <span>{Lang.get("From")}:</span>
                                                <span className="fw-bold">{data.from}</span>
                                            </li>
                                            <li>
                                                <span>{Lang.get("To")}:</span>
                                                <span>{data.to}</span>
                                            </li>
                                            <li>
                                                <span>{Lang.get("Date")}:</span>
                                                <span>{data.date}</span>
                                            </li>
                                            <li>
                                                <span>{Lang.get("Subject")}:</span>
                                                <span>{data.subject}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ml-auto d-flex">
                        <div className="tooltip_">
                            <button
                                className="btn shadow-none bg-transparent feather feather-corner-up-left p-0 "></button>
                            <span className="tooltiptext">Replay</span></div>
                        <div className="dropleft">
                            <button
                                data-toggle="dropdown"
                                className="btn shadow-none bg-transparent feather feather-more-vertical"
                                style={{
                                    fontSize: "1.2rem",
                                    height: "22px",
                                    lineHeight: "1px",
                                    transform: "rotate(90deg)",
                                }}
                            />
                            <div className="dropdown-menu">
                                <button className="dropdown-item"><i
                                    className="feather-corner-up-left"></i> {Lang.get("Replay")}</button>
                                <button className="dropdown-item"><i
                                    className="feather-corner-up-right"></i> {Lang.get("Forward")}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inbox-message-content mt-3 container ml-0">
                    <p>{data.snippet}</p>
                </div>
            </div>

        </ErrorBoundary>
    );
};
