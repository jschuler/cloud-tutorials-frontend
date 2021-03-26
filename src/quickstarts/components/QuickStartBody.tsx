import React from 'react';
import { Spinner } from '@patternfly/react-core';

declare const QUICKSTARTS_BASE: string;

export const QuickStartBody = () => {
  // TODO: add types
  const [quickstart, setQuickstart] = React.useState<any>();

  React.useEffect(() => {
    fetch(`${QUICKSTARTS_BASE}/add-healthchecks-quickstart.json`)
      .then(res => res.json())
      .then(json => setQuickstart(json))
  }, []);
  
  if (quickstart) {
    return <pre><code>{JSON.stringify(quickstart, null, 2)}</code></pre>;
  }
  else {
    return <Spinner />
  }
}
