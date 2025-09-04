import React from "react";
import ErrorBoundary from "fogito-core-ui/build/components/error/ErrorBoundary";
import Lang from "fogito-core-ui/build/library/Lang";

export const TableHead = (props) => {
  const { params } = props;
  return (
    <ErrorBoundary>
      <div
        className={`t-main-header ${
          params.items?.length ? `resize-border` : ""
        } `}
      >
        {params.items?.length > 1 && (
          <div className="" style={{ flex: 1 }}></div>
        )}

        <div className="d-flex" style={{ flex: 24 }}>
          <div className="" style={{ flex: 8 }}>
            {Lang.get("Accom")}
          </div>
          <div className="" style={{ flex: 4, marginLeft: "10px" }}>
            {Lang.get("RoomType")}
          </div>
          <div className="" style={{ flex: 7, marginLeft: "10px" }}>
            {Lang.get("Unit")}
          </div>
          <div className="" style={{ flex: 4, marginLeft: "10px" }}>
            {Lang.get("Night")}
          </div>
          <div className="" style={{ flex: 4, marginLeft: "10px" }}>
            {Lang.get("CheckIn")}
          </div>
          <div className="" style={{ flex: 4, marginLeft: "10px" }}>
            {Lang.get("CheckOut")}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
