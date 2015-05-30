(function(factory) {

  define([
    'reactjs',
    'jsx!components/Info',
    'jsx!components/Controller'
  ], factory);

})(function(React, Info, Controller) {
  'use strict';

  class AudioDetail extends React.Component {
    render() {
      return (
        <div className="AudioPlayer-detail">
          <Info />
          <Controller />
        </div>
      )
    }
  }

  return AudioDetail;

});
