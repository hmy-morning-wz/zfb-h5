import React from 'react';

const setTitle = (title) => {
  if (title) {
    global.document.title = title;
    if (global.AlipayJSBridge) {
      global.AlipayJSBridge.call('setTitle', { title });
    }
  }
};

class ApDocumentTitle extends React.Component {
  componentDidMount() {
    setTitle(this.props.title);
  }

  componentWillReceiveProps(nextProps) {
    setTitle(nextProps.title);
  }

  render() {
    if (this.props.children) {
      return React.Children.only(this.props.children);
    } else {
      return null;
    }
  }

}

export default ApDocumentTitle;
