import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  BsBoxArrowInUp,
  BsCamera,
  BsDownload,
  BsClipboard,
  BsInfoSquare,
} from 'react-icons/bs';

import { useProjectStore } from '../../ProjectStore';
import { Logo } from '../common/Logo';

const copyToClipboardAvailable = !!(window as any)['ClipboardItem'];

export const Menu: React.FC = observer(() => {
  const projectStore = useProjectStore();

  return (
    <ul className="panel menu">
      <Logo />
      <li>
        <button onClick={() => projectStore.openFilePicker()}>
          <BsBoxArrowInUp />
          <span>Open</span>
        </button>
      </li>
      <li>
        <button onClick={() => (projectStore.showWebcam = true)}>
          <BsCamera />
          <span>Webcam</span>
        </button>
      </li>
      <li>
        <button onClick={() => (projectStore.showExport = true)}>
          <BsDownload />
          <span>Export</span>
        </button>
      </li>
      {copyToClipboardAvailable && (
        <li>
          <button onClick={() => projectStore.copyToClipboard()}>
            <BsClipboard />
            <span>Copy to clipboard</span>
          </button>
        </li>
      )}
      <li>
        <button onClick={() => (projectStore.showAbout = true)}>
          <BsInfoSquare />
          <span>About</span>
        </button>
      </li>
    </ul>
  );
});
