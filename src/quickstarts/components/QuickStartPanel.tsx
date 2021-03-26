import React from 'react';
import { DrawerHead, DrawerActions, DrawerCloseButton } from '@patternfly/react-core';
import { QuickStartBody } from './QuickStartBody';

export const QuickStartPanel = () => {
  const onClose = () => (document.getElementById('quickstartDrawer') as HTMLElement).classList.remove('pf-m-expanded');
  return (
    <DrawerHead>
      <DrawerActions>
        <DrawerCloseButton onClick={onClose} />
      </DrawerActions>
      <QuickStartBody />
    </DrawerHead>
  );
}

