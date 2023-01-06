import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { useProjectStore } from '../../ProjectStore';

export const PreviewCanvas: React.FC = observer(() => {
  const projectStore = useProjectStore();

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    const div = divRef.current;
    div.textContent = '';
    div.setAttribute("style", "position: relative;");
    if (projectStore.canvas) {
      div.append(projectStore.canvas);
    }
    if (projectStore.canvas2d) {
      projectStore.canvas2d.setAttribute('style',' background-color: transparent;position: absolute;left: 0px;top: 0px;z-index: 10;')
      div.append(projectStore.canvas2d);
    }
  }, [projectStore.canvas]);

  return <div ref={divRef} />;
});
