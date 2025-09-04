import React from 'react';
import {ErrorBoundary} from 'fogito-core-ui';
import {Skeleton} from 'antd';

export const LabelsLoading = React.memo(({height = 44}) => {

  const length = [0, 1, 2, 3, 4];

  return (
    <ErrorBoundary>
      {
        length.map((row, key) =>
          <div className="d-flex align-items-center mb-2" key={key}>
            <div className="d-flex flex-column w-100">
              <Skeleton.Button active
                               size={'default'}
                // shape={'round'}
                               block={false}
                               className="d-block w-100"
                               style={{width: 'auto', height, borderRadius: 7}}
              />
            </div>
          </div>,
        )
      }
    </ErrorBoundary>
  );
});