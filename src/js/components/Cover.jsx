(function(factory) {

  define([
    'reactjs'
  ], factory);

})(function(React) {
  'use strict';

  class Cover extends React.Component {
    render() {
      return (
        <div className="AudioPlayer-cover">
          <img src="img/cover.jpg" />
        </div>
      )
    }
  }

  return Cover;

});
