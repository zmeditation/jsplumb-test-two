import dagre from 'dagre';

export default function(data, dGraph, config) {
  let updatedData = [];
  data.nodes.forEach(n => {
    dGraph.setNode(n.id, {
      label: n.id,
      width: config.nodeSize[0],
      height: config.nodeSize[1]
    });
    if (n.data.parent) {
      dGraph.setParent(n.id, n.data.parent);
    }
  });

  data.links.forEach(e => {
    dGraph.setEdge(e.source, e.target, {
      id: e.id
    });
  });

  dagre.layout(dGraph);

  dGraph.nodes().forEach(function(n) {
    let nd = dGraph.node(n);
    let $n = config.$container.find('#' + n);
    let node = data.nodes.find(o => o.id === n);
    let bbox = {
      left: nd.x - nd.width / 2,
      top: nd.y - nd.height / 2,
      width: nd.width,
      height: nd.height
    };
    node.data.bbox = bbox;
    $n.css({
      left: bbox.left + 'px',
      top: bbox.top + 'px',
      width: bbox.width + 'px',
      height: bbox.height + 'px'
    });
  });

  return updatedData;
}
