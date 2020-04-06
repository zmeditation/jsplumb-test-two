import $ from 'jquery';

export default function (config) {
  let instance = config.instance;

  function updateNodeLabel(type, e) {
    e.stopPropagation();
    e.preventDefault();
    let _label = $(this).text();
    let nodeLabel = window.prompt(_label) || _label;
    if (nodeLabel.trim() !== _label.trim()) {
      $(this).text(nodeLabel);
      config.onChange(type + ':update', { label: nodeLabel });
    }
  }

  instance.on(config.container, 'click', function (e) {
    $('.jtk-endpoint-anchor-hover').removeClass('jtk-endpoint-anchor-hover');
    config.onChange('canvas:selected', {});
  });

  instance.on(config.container, 'click', '.jtk-endpoint-anchor', function () {
    $('.jtk-endpoint-anchor-hover').removeClass('jtk-endpoint-anchor-hover');
    $(this).addClass('jtk-endpoint-anchor-hover');
  });

  instance.bind('connection', function (info, event) {
    const { sourceId, targetId } = info;
    config.onChange('conn:created', {
      source: sourceId,
      target: targetId,
      data: {
        sourceAnchor: info.sourceEndpoint.getUuid(),
        targetAnchor: info.targetEndpoint.getUuid(),
      },
    });
  });

  instance.bind('click', function (conn, event) {
    event.stopPropagation();
    setTimeout(() => {
      config.onChange('conn:selected', {
        id: conn.id,
        source: conn.sourceId,
        target: conn.targetId,
      });
    }, 0);
  });

  instance.bind('endpointClick', function (ep, event) {
    event.stopPropagation();
    const [id, type, anchorType, anchorId] = ep.getUuid().split('_');
    setTimeout(() => {
      config.onChange('anchor:selected', {
        id,
        type,
        anchorId,
        anchorType,
      });
    }, 0);
  });

  instance.on(config.container, 'click', '.group', function (e) {
    e.stopPropagation();
    config.onChange('group:selected', { id: this.id });
  });

  instance.on(config.container, 'click', '.ds', function (e) {
    e.stopPropagation();
    config.onChange('ds:selected', { id: this.id });
  });

  instance.on(config.container, 'click', '.join', function (e) {
    e.stopPropagation();
    config.onChange('join:selected', { id: this.id });
  });

  instance.on(config.container, 'dblclick', '.ds .label', function (e) {
    updateNodeLabel.call(this, 'ds', e);
  });

  instance.on(config.container, 'dblclick', '.join .label', function (e) {
    updateNodeLabel.call(this, 'join', e);
  });

  instance.on(config.container, 'dblclick', '.group .label', function (e) {
    if (e.target !== $(this).closest('.group').find('.label:first-child')[0]) {
      return;
    }
    updateNodeLabel.call(this, 'group', e);
  });

  instance.on(config.container, 'click', '.join', function (e) {
    config.onChange('join:selected', { id: this.id });
  });

  instance.on(config.container, 'click', '.del', function () {
    var g = this.parentNode.getAttribute('group');
    config.onChange('group:delete', g);
    instance.removeGroup(g, this.getAttribute('delete-all') != null);
  });

  instance.on(config.container, 'click', '.node-collapse', function () {
    var g = this.parentNode.getAttribute('group'),
      collapsed = instance.hasClass(this.parentNode, 'collapsed');

    instance[collapsed ? 'removeClass' : 'addClass'](
      this.parentNode,
      'collapsed'
    );
    instance[collapsed ? 'expandGroup' : 'collapseGroup'](g);
  });
}
