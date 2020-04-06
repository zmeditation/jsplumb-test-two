import $ from 'jquery';
import { jsPlumb } from 'jsplumb';
import dagre from 'dagre';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/resizable';

import graphPreRenderNode from './util/pre-render-node';
import graphPostRenderNode from './util/post-render-node';
import graphRenderLink from './util/render-link';
import renderNode from './util/render-node';
import renderGroup from './util/render-group';
import graphRenderEndpoint, { addEndpointToEl } from './util/render-endpoint';
import graphEffect from './util/effect';
import graphEvent from './graph-event';
import graphLayout from './graph-layout';

import './index.css';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/resizable.css';

const Graph = {};

const config = {
  sampleGroup: $('.sample-elem').find('.group'),
  sampleNode: $('.sample-elem').find('.node'),
  container: null,
  $container: null,
  instance: null,
  onChange: null,
  nodeSize: [70, 50],
};

function addElement({ type, nodeType, data }) {
  if (type === 'node') {
    switch (nodeType) {
      case 'ds':
        renderNode(data, config);
        addEndpointToEl(data, config);
        break;
      case 'group':
        renderGroup(data, config);
        break;
      case 'join':
        renderNode(data, config);
        addEndpointToEl(data, config);
        break;
      default:
        renderNode(data, config);
        break;
    }
  }
}

function removeSimpleEl({ id }) {
  const { instance } = config;
  instance.deleteConnectionsForElement(id);
  instance.removeAllEndpoints(id);
  $('#' + id).remove();
}

function removeGroup({ id }) {
  const { instance } = config;
  let gEl = config.$container.find('#' + id);
  var g = gEl.attr('group');
  instance.removeGroup(g, true);
}

function removeLink({ source, target }) {
  const { instance } = config;
  let conn = instance.getConnections({
    source,
    target,
  });
  instance.deleteConnection(conn[0]);
}

function removeElement({ type, nodeType, data }) {
  if (type === 'node') {
    switch (nodeType) {
      case 'ds':
        removeSimpleEl(data);
        break;
      case 'join':
        removeSimpleEl(data, config);
        break;
      case 'group':
        removeGroup(data, config);
        break;
      default:
        removeSimpleEl(data, config);
        break;
    }
  } else if (type === 'link') {
    removeLink(data, config);
  }
}

Graph.exit = function () {};

Graph.init = function (el, data, onChange) {
  config.container = el;
  config.$container = $(el);
  config.onChange = onChange;
  config.instance = jsPlumb.getInstance({
    DragOptions: { cursor: 'pointer', zIndex: 2000, containment: 'main' },
    ConnectionsDetachable: true,
    allowLoopback: false,
    Container: config.container,
  });

  let dGraph = new dagre.graphlib.Graph({ compound: true })
    .setGraph({
      ranker: 'simplex',
      nodesep: 50,
      edgesep: 50,
      ranksep: 100,
      rankdir: 'LR',
    })
    .setDefaultEdgeLabel(() => {
      return {};
    });

  graphPreRenderNode(data, config);
  graphLayout(data, dGraph, config);
  graphRenderEndpoint(data, config);
  graphPostRenderNode(data, config);
  graphRenderLink(data, config);
  graphEffect(config.instance);
  graphEvent(config);
  jsPlumb.fire('jsPlumbDemoLoaded', config.instance);
};

Graph.update = function (opt, data) {
  if (opt === 'add') {
    addElement(data);
  } else if (opt === 'remove') {
    removeElement(data);
  } else {
    graphPreRenderNode(data, config);
    graphRenderEndpoint(data, config);
    graphPostRenderNode(data, config);
    graphRenderLink(data, config);
    graphEffect(config.instance);
  }
};

export default Graph;
