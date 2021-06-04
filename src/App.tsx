import React from 'react';
import { GlueUtils } from 'fxglue';

import './App.scss';
import 'rc-slider/assets/index.css';

import { Layers } from './components/panels/Layers';
import { LayerSettings } from './components/panels/LayerSettings';
import { Tabs } from './components/panels/Tabs';
import { Menu } from './components/panels/Menu';

import { Welcome } from './components/modals/Welcome';
import { FilterGallery } from './components/modals/FilterGallery';
import { About } from './components/modals/About';
import { Export } from './components/modals/Export';

import { Preview } from './components/preview/Preview';

import { Loading } from './components/overlays/Loading';

const webglAvailable = GlueUtils.isWebGLAvailable();

export const App: React.FC = () => {
  if (!webglAvailable) {
    return (
      <div className="ui v-stack">
        <ul className="panel menu">
          <li className="logo">Instaglitch</li>
        </ul>
        <div className="webgl-error">
          Instaglitch requires WebGL to work.{' '}
          <a
            href="https://get.webgl.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Please click this link for more info.
          </a>
        </div>
      </div>
    );
  }
  return (
    <>
      <Welcome />
      <FilterGallery />
      <About />
      <Export />
      <Loading />
      <div className="ui v-stack">
        <Menu />
        <div className="workspace flex h-stack">
          <div className="v-stack flex">
            <Tabs />
            <div className="canvas-area flex">
              <Preview />
            </div>
          </div>
          <div className="panel side">
            <Layers />
            <LayerSettings />
          </div>
        </div>
      </div>
    </>
  );
};
