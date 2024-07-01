import React from "react";
import { ErrorBoundary, Lang, } from "fogito-core-ui";

export const InfoCard = ({ data }) => {
    return (
        <ErrorBoundary>
            <div className="p-4 mb-1 bg-white rounded card-bg ">
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
                                        style={{ lineHeight: '30px' }}
                                        className="feather feather-chevron-down fs-20 cursor-pointer"
                                    ></i>
                                    <div className="dropdown-menu p-3 card-more-bg">
                                        <div className="d-flex">
                                            <ul className="d-flex flex-column align-items-end p-0">
                                                <li><span>{Lang.get("From")}:</span></li>
                                                <li><span>{Lang.get("To")}:</span></li>
                                                <li><span>{Lang.get("Date")}:</span></li>
                                                <li><span>{Lang.get("Subject")}:</span></li>
                                            </ul>
                                            <ul className='pl-2'>
                                                <li><span className="fw-bold">{data.from}</span></li>
                                                <li><span>{data.to}</span></li>
                                                <li><span>{data.date}</span></li>
                                                <li><span>{data.subject}</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ml-auto d-flex">
                        <div>
                            <button
                                className="btn shadow-none bg-transparent feather feather-corner-up-left p-0 m-0"></button>
                        </div>
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
                <div className="inbox-message-content mt-3 ml-0">
                    <p className="text-break">{data.snippet}</p>
                </div>
            </div>
        </ErrorBoundary>
    );
};
