import React from 'react';
import _data from './data';
import Canvas from './Canvas';
import PropertyWindow from './property-window';

let id = new Date();

function normalizeData(data) {
  return (data || []).map((d) => ({ data: {}, ...d }));
}

let data = (function () {
  let _d = sessionStorage['data'] && JSON.parse(sessionStorage['data']);
  _data.nodes = normalizeData(_data.nodes);
  _data.links = normalizeData(_data.links);
  return _d || _data;
})();

const getId = () => id++;

export default class layout extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedEl: null,
    };
  }

  _setState = (el) => {
    this.setState({
      selectedEl: el,
    });
  };

  onChange = (info, d) => {
    const setSelectedEl = (type = 'node', nodeType) => {
      let el;
      if (type === 'node') {
        el = data.nodes
          .filter((o) => o.type === nodeType)
          .find((o) => o.id === d.id);
      } else {
        el = data.links.find(
          (o) => o.source === d.source && o.target === d.target
        );
      }
      this._setState(el);
    };

    switch (info) {
      case 'group:selected':
        setSelectedEl('node', 'group');
        break;

      case 'ds:selected':
        setSelectedEl('node', 'ds');
        break;

      case 'join:selected':
        setSelectedEl('node', 'join');
        break;

      case 'anchor:selected':
        this._setState(d);
        break;

      case 'group:update':
        this.updateNode(d);
        break;

      case 'ds:update':
        this.updateNode(d);
        break;

      case 'join:update':
        this.updateNode(d);
        break;

      case 'conn:selected':
        setSelectedEl('link');
        break;

      case 'conn:created':
        this.linkCreated(d);
        break;

      default:
        this.setState({
          selectedEl: null,
        });
        break;
    }
  };

  updateNode = (d) => {
    let n = data.nodes.find((n) => n.id === d.id);
    n.data = d.data;
    //@todo
    // Canvas.update('re-render', data);
  };

  linkCreated = (d) => {
    data.links.push(d);
  };

  removeNode = (node) => {
    let { type, id, source } = node;
    data.nodes = data.nodes.filter((o) => o.id !== id);
    if (source) {
      //@todo proper implementation needed!
      Canvas.update('remove', {
        type: 'link',
        data: node,
      });
    } else {
      Canvas.update('remove', {
        type: 'node',
        nodeType: type,
        data: node,
      });
    }
    this.setState({
      selectedEl: null,
    });
  };

  addDataSource = () => {
    let ds = { id: 'node' + getId(), type: 'ds', data: {} };
    data.nodes.push(ds);
    Canvas.update('add', {
      type: 'node',
      nodeType: 'ds',
      data: ds,
    });
  };

  addGroup = () => {
    let g = { id: 'group' + getId(), type: 'group', data: {} };
    data.nodes.push(g);
    Canvas.update('add', 'group', g);
    Canvas.update('add', {
      type: 'node',
      nodeType: 'group',
      data: g,
    });
  };

  addJoin = () => {
    let j = { id: 'join' + getId(), type: 'join', data: {} };
    data.nodes.push(j);
    Canvas.update('add', 'join', j);
    Canvas.update('add', {
      type: 'node',
      nodeType: 'join',
      data: j,
    });
  };

  buttonClick = (i) => {
    switch (i) {
      case 2:
        this.addJoin();
        break;
      case 3:
        this.addGroup();
        break;
      default:
        this.addDataSource();
    }
  };

  renderMenuBar = () => {
    return ['SOURCE', 'SELECT', 'JOIN', 'GROUP'].map((l, i) => {
      return (
        <div
          key={i}
          className={'menubar-button ' + l.split(' ').join('_').toLowerCase()}
          onClick={() => this.buttonClick(i + 1)}
        >
          {l}
        </div>
      );
    });
  };

  componentDidMount() {
    Canvas.init(this._rootNode, data, this.onChange);
  }

  _setRef(componentNode) {
    this._rootNode = componentNode;
  }

  render() {
    return (
      <div className='layout-page'>
        <div className='menubar'>
          {this.renderMenuBar()}
          <button
            onClick={() => {
              sessionStorage['data'] = JSON.stringify(data);
            }}
          >
            Save
          </button>
        </div>
        <div className='layout'>
          <div className='sidebar'>
            <PropertyWindow
              ele={this.state.selectedEl}
              remove={this.removeNode}
              update={this.updateNode}
            />
          </div>
          <div className='main' id='main'>
            <div className='canvas-container' ref={this._setRef.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}
