import renderGroup from './render-group';
import renderNode from './render-node';

export default function (data, config) {
  let groups = data.nodes.filter((n) => n.type === 'group');
  let simpleNodes = data.nodes.filter((n) => n.type !== 'group');

  groups.forEach(function (_g, i) {
    renderGroup(_g, config);
  });

  simpleNodes.forEach(function (d, i) {
    renderNode(d, config);
  });
}
