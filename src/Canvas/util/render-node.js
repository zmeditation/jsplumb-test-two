export default function(d, config, selected) {
  let el = config.sampleNode
    .clone()
    .addClass(d.type)
    .addClass(() => (selected ? 'selected' : ''))
    .attr({ id: d.id })
    .css({ left: d.left, top: d.top });
  el.find('.label').html(() => d.label || d.type);
  el.appendTo(config.container);

  config.instance.draggable(el, {
    containment: config.container,
    grid: [10, 10]
  });

  return el;
}
