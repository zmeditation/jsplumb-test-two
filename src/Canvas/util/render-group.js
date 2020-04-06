import { paintStyle } from './style';

export default function (d, config, selected) {
  let el = config.sampleGroup
    .clone()
    .attr({ id: d.id })
    .addClass(d.type)
    .addClass(() => (selected ? 'selected' : ''))
    .css({ left: d.left, top: d.top });
  el.find('.label').html(d.label || d.id);
  el.appendTo(config.container);

  let gEl = el.attr('group', d.id);
  config.instance.addGroup({
    el: gEl[0],
    id: d.id,
    revert: false,
    constrain: false,
    endpoint: ['Dot', paintStyle],
    dragOptions: {
      containment: 'main',
    },
  });

  el.resizable();
}
