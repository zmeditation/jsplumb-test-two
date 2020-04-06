export default function(data, config) {
  data.nodes.forEach(function(d, i) {
    if (d.data.parent) {
      config.instance.addToGroup(
        d.data.parent,
        config.$container.find('#' + d.id)[0]
      );
    }
  });
}
