import {
  connectorPaintStyle,
  connectorHoverStyle,
  endpointHoverStyle,
  paintStyle,
} from './style';

const endpoint = {
  endpoint: 'Dot',
  paintStyle,
  connectionsDetachable: true,
  maxConnections: -1,
  connector: ['Flowchart'],
  connectorStyle: connectorPaintStyle,
  hoverPaintStyle: endpointHoverStyle,
  connectorHoverStyle: connectorHoverStyle,
  dropOptions: { hoverClass: 'hover', activeClass: 'active' },
};

function _addEndpoints(nd, instance, anchors) {
  instance.updateOffset({ recalc: true, elId: nd.id });
  nd.data.anchors = [];
  for (let i = 0; i < anchors.length; i++) {
    let uuid = nd.id + '_' + anchors[i]['id'];
    let isSource = true;
    if (anchors[i]['id'].indexOf('_in_') !== -1) {
      isSource = false;
    }
    instance.addEndpoint(
      nd.id,
      {
        ...endpoint,
        isSource: isSource,
        isTarget: !isSource,
        cssClass: anchors[i]['id'],
      },
      {
        anchor: anchors[i]['cord'],
        uuid: uuid,
        connectionsDetachable: true,
      }
    );
    nd.data.anchors.push(uuid);
  }
}

export default function (data, config) {
  let simpleNodes = data.nodes.filter((n) => n.type !== 'group');
  simpleNodes.forEach(function (d) {
    addEndpointToEl(d, config);
  });
}

export function addEndpointToEl(nd, config) {
  let anchors = [
    { id: nd.type + '_out_', cord: [1, 0.5, 1, 0] },
    { id: nd.type + '_in_', cord: [0, 0.5, -1, 0] },
  ];
  if (nd.type === 'join') {
    anchors = [
      { id: 'join_out_l', cord: [1, 0.2, 1, 0] },
      { id: 'join_out_i', cord: [1, 0.5, 1, 0] },
      { id: 'join_out_r', cord: [1, 0.8, 1, 0] },
      { id: 'join_in_l', cord: [0, 0.2, -1, 0] },
      { id: 'join_in_r', cord: [0, 0.8, -1, 0] },
    ];
  }
  _addEndpoints(nd, config.instance, anchors);
}
