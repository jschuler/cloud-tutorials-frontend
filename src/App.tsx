import React, { useEffect } from "react";

declare global {
  interface Window {
    insights: {
      chrome: {
        init: () => void,
        identifyApp: (name: string) => void
      }
    };
  }
}

const App = () => {
  useEffect(() => {
    window.insights.chrome.init();
    window.insights.chrome.identifyApp('cloud-tutorials');
  }, []);

  return (
    <div>hi</div>
  );
};

export default App;
