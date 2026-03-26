export default function LoadingSpinner() {
  return (
    <div className="loading-screen-loader-wrap" role="status" aria-live="polite" aria-label="Loading">
      <div className="loading-screen-loader-shell">
        <div className="loading-screen-loader">
          <span>
            <span />
            <span />
            <span />
            <span />
          </span>
          <div className="loading-screen-loader-base">
            <span />
            <div className="loading-screen-loader-face" />
          </div>
        </div>
        <div className="loading-screen-longfazers" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="loading-screen-loader-label">Loading</div>
    </div>
  );
}
