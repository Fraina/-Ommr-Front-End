(function(factory) {
  'use strict';

  define([
    'reactjs'
  ], factory);

})(function(React) {
  'use strict';

  class HelloMessage extends React.Component {
    render() {
      return <div>Hello {this.props.name}</div>;
    }
  }

  React.render(<HelloMessage name="World" />, document.getElementById('test'));

});