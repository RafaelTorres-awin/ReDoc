import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
// import DevTools from 'mobx-react-devtools';

import { RedocProps } from '../../src/components/Redoc/Redoc';
import { AppStore } from '../../src/services/AppStore';
import { RedocRawOptions } from '../../src/services/RedocNormalizedOptions';
import { loadAndBundleSpec } from '../../src/utils/loadAndBundleSpec';

const renderRoot = (props: RedocProps) =>
  render(<App {...props} />, document.getElementById('example'));

const big = window.location.search.indexOf('big') > -1;
const swagger = window.location.search.indexOf('swagger') > -1; // compatibility mode ?

const specUrl = swagger ? 'swagger.yaml' : big ? 'big-openapi.json' : 'openapi.yaml';

let store;
const options: RedocRawOptions = { nativeScrollbars: false };

async function init() {
  const spec = await loadAndBundleSpec(specUrl);
  store = new AppStore(spec, specUrl, options);
  renderRoot({ store });
}

init();

if (module.hot) {
  const reload = () => {
    const state = store.toJS();
    store.dispose();
    store = AppStore.fromJS(state);
    renderRoot({ store });
  };

  module.hot.accept(['../../src/services/AppStore'], reload);
}
