import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useProjectStore } from '../../ProjectStore';
import { FilterSettingType, LayerType, FilterLayer } from '../../types';
import { PreviewCanvas } from './PreviewCanvas';

export const Preview: React.FC = observer(() => {
  const projectStore = useProjectStore();
  const project = projectStore.currentProject;

  const [moving, setMoving] = useState<string>();
  const initialPositionRef = useRef<[number, number]>();
  const initialValueRef = useRef<[number, number]>();

  const layer = project?.layers.find(
    layer => layer.id === project.selectedLayer
  );

  useEffect(() => {
    if (!moving) {
      return;
    }

    const move = (pageX: number, pageY: number) => {
      if (!initialPositionRef.current || !initialValueRef.current) {
        return;
      }

      const [x, y] = initialPositionRef.current;
      const [valueX, valueY] = initialValueRef.current;

      const initialCanvasX = projectStore.canvas.width * (valueX + 0.5);
      const initialCanvasY = projectStore.canvas.height * (valueY + 0.5);

      const canvasPageX = x - initialCanvasX;
      const canvasPageY = y - initialCanvasY;

      const newCanvasX = pageX - canvasPageX;
      const newCanvasY = pageY - canvasPageY;

      const newValueX = newCanvasX / projectStore.canvas.width - 0.5;
      const newValueY = newCanvasY / projectStore.canvas.height - 0.5;

      (layer as FilterLayer).settings[moving] = [newValueX, newValueY];
      projectStore.requestPreviewRender();
    };

    const handleMouseMove = (e: MouseEvent) => {
      move(e.pageX, e.pageY);
    };
    const handleUp = () => {
      setMoving(undefined);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) {
        return;
      }

      move(touch.pageX, touch.pageY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleUp);
    document.addEventListener('touchcancel', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);

      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
      document.removeEventListener('touchcancel', handleUp);
    };
  }, [moving, layer, projectStore, setMoving]);

  if (!layer) {
    return null;
  }

  const renderOffsetMarks = () => {
    if (layer?.type !== LayerType.FILTER || !layer.filter.settings) {
      return null;
    }

    const offsetSettings = layer.filter.settings.filter(
      setting => setting.type === FilterSettingType.OFFSET
    );
    if (offsetSettings.length === 0) {
      return null;
    }

    return offsetSettings.map(setting => {
      const [x, y] = layer.settings[setting.key];

      return (
        <div
          key={setting.key}
          className="offset-mark"
          onMouseDown={e => {
            initialPositionRef.current = [e.pageX, e.pageY];
            initialValueRef.current = [x, y];

            setMoving(setting.key);
          }}
          onTouchStart={e => {
            const touch = e.touches[0];
            if (!touch) {
              return;
            }

            initialPositionRef.current = [touch.pageX, touch.pageY];
            initialValueRef.current = [x, y];

            setMoving(setting.key);
          }}
          style={{
            backgroundColor: setting.color,
            top: (y + 0.5) * projectStore.canvas.height,
            left: (x + 0.5) * projectStore.canvas.width,
          }}
        />
      );
    });
  };

  return (
    <div className="preview-wrap">
      {renderOffsetMarks()}
      <PreviewCanvas />
    </div>
  );
});
