import React from 'react';
import { ErrorBoundary, Lang, Textarea } from 'fogito-core-ui';
import { Spinner } from '@components';

export const AddChecklist = React.memo(
  ({ state, setState, contentRef, onAddChecklist }) => {
    return (
      <ErrorBoundary>
        <div ref={contentRef} className="mb-3">
          <button
            style={{ width: 35, height: 35, borderRadius: '50%' }}
            type="button"
            className="btn btn-primary d-flex align-items-center justify-content-center p-0"
            onClick={() => setState({ add: !state.add, title: 'Checklist' })}
          >
            <i
              className="feather feather-plus fs-16"
              style={{
                transform: state.add ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'all .3s ',
              }}
            />
          </button>
          {state.add && (
            <form onSubmit={onAddChecklist}>
              <div className="form-group">
                <div className="form-group mt-3 mb-2">
                  <Textarea
                    rows="1"
                    maxLength="300"
                    value={state.title}
                    onChange={(e) => setState({ title: e.target.value })}
                    placeholder={Lang.get('Title')}
                    className="form-control"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        e.preventDefault();
                        onAddChecklist(e);
                      }
                    }}
                    onFocus={(e) => {
                      let length = e.target.value.length;
                      e.target.setSelectionRange(0, length);
                    }}
                  />
                </div>
                <div className="d-flex align-items-center">
                  <button className="btn btn-primary px-5 py-2">
                    {state.smallLoading ? (
                      <Spinner color="#fff" />
                    ) : (
                      Lang.get('Save')
                    )}
                  </button>
                  <button
                    className="btn btn-secondary px-5 py-2"
                    type="button"
                    onClick={() => setState({ add: false })}
                  >
                    {Lang.get('Cancel')}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </ErrorBoundary>
    );
  }
);
