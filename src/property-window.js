import React from 'react';

const buttonStyle = {
  padding: '6px 15px',
  margin: '2px 45px',
  cursor: 'pointer',
};

export default class extends React.Component {
  onRemoveBtnClick = () => {
    this.props.remove(this.props.ele);
  };

  updateData = () => {
    let data = document.querySelector('#contentbox').innerHTML;
    try {
      this.props.update({ ...this.props.ele, data: JSON.parse(data) });
    } catch (error) {
      alert('Invalid JSON');
    }
  };

  renderData = (data) => {
    return (
      <div>
        <h3>DATA</h3>
        <pre id='contentbox' contentEditable>
          {JSON.stringify(data, null, 3)}
        </pre>
        <button style={buttonStyle} onClick={this.updateData}>
          Update
        </button>
      </div>
    );
  };

  renderInfo = () => {
    return (
      <div>
        <pre>{JSON.stringify(this.props.ele, null, 3)}</pre>
        <pre>{this.renderData(this.props.ele.data)}</pre>
        <button style={buttonStyle} onClick={this.onRemoveBtnClick}>
          Remove
        </button>
      </div>
    );
  };

  render() {
    return (
      <div className='property-window'>
        {this.props.ele && this.renderInfo()}
      </div>
    );
  }
}
