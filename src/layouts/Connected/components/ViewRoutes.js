import React from "react";
import { ErrorBoundary, Modal } from "fogito-core-ui";
import { Route } from "react-router-dom";
import { Add } from "../views";
 

export const ViewRoutes = ({ onClose, history, loadData, path, url  }) => {
  return (
    <ErrorBoundary>
      <Route
        path={`${path}/add`}
        render={(routeProps) => (
          <Add {...routeProps} reload={() => loadData()} onClose={onClose} />
        )}
      />
      {/* <Route
        path={`${path}/info/:id`}
        render={(routeProps) => (
          <Modal show>
            <Modal.Header onClose={() => history.push(url)}></Modal.Header>
            <Modal.Body>
              <Info {...routeProps} reloadTable={loadData} />
            </Modal.Body>
          </Modal>
        )}
      /> */}
    </ErrorBoundary>
  );
};
