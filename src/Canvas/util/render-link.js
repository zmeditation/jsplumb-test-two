import { connectorPaintStyle, connectorHoverStyle } from './style';

export default function (data, config) {
  data.links.forEach((e) => {
    let source = data.nodes.find((n) => n.id === e.source);
    let target = data.nodes.find((n) => n.id === e.target);
    let sepuid = e.data.sourceAnchor;
    let tepuid = e.data.targetAnchor;
    // if (target.type === 'join') {
    //   if (
    //     source.data.bbox &&
    //     target.data.bbox &&
    //     source.data.bbox.top > target.data.bbox.top
    //   ) {
    //     tepuid = target.data.anchors[2];
    //   } else {
    //     tepuid = target.data.anchors[1];
    //   }
    // }
    config.instance.connect({
      id: e.id,
      uuids: [sepuid, tepuid],
      //endpoint: ['Dot', { radius: 7 }],
      connector: ['Flowchart'],
      paintStyle: connectorPaintStyle,
      hoverPaintStyle: connectorHoverStyle,
    });
  });
  return config.instance;
}
