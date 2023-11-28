/* eslint-disable */
/**
 * WindowResizeListener
 * React component for listening to window resize events
 */
var React = require('react');
var debounce = require('lodash');
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
var createReactClass = require('create-react-class');

var WindowResizeListener = createReactClass({
  displayName: 'WindowResizeListener',

  propTypes: {
    /**
     * Called at least once soon after being mounted
     * type WindowSize = { windowWidth: number, windowHeight: number }
     * type onResize = (windowSize: WindowSize) => void
     */
    onResize: PropTypes.func.isRequired,
  },

  statics: {
    /**
     * List of resize listeners
     * @private
     */
    _listeners: [],

    /**
     * Maximum debounce wait time
     * @public
     */
    DEBOUNCE_TIME: 100,

    /**
     * Resize handler
     * Gets the window size and calls each listener
     * @private
     */
    _onResize: function _onResize() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

      WindowResizeListener._listeners.forEach(function (listener) {
        listener({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
        });
      });
    },
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return nextProps.onResize !== this.props.onResize;
  },

  componentDidMount: function componentDidMount() {
    this.onResizeMem = memoize((onResize) => {
      let last_onResize = this.last_onResize;
      this.last_onResize = onResize;

      var idx = WindowResizeListener._listeners.indexOf(last_onResize);
      if (idx > -1) {
        WindowResizeListener._listeners.splice(idx, 1, onResize);
      } else {
        WindowResizeListener._listeners.push(onResize);
      }
    });

    // Defer creating _debouncedResize until it's mounted
    // This allows users to change DEBOUNCE_TIME if they want
    // If there's no listeners, we need to attach the window listener
    if (!WindowResizeListener._listeners.length) {
      WindowResizeListener._debouncedResize = debounce.debounce(WindowResizeListener._onResize, WindowResizeListener.DEBOUNCE_TIME);
      window.addEventListener('resize', WindowResizeListener._debouncedResize, false);
    }
    WindowResizeListener._listeners.push(this.props.onResize);
    WindowResizeListener._debouncedResize();
  },

  componentWillUnmount: function componentWillUnmount() {
    var idx = WindowResizeListener._listeners.indexOf(this.props.onResize);
    WindowResizeListener._listeners.splice(idx, 1);
    if (!WindowResizeListener._listeners.length) {
      window.removeEventListener('resize', WindowResizeListener._debouncedResize, false);
    }
  },

  componentDidUpdate: function () {
    this.onResizeMem(this.props.onResize);
  },

  render: function resize() {
    return null;
  },
});

export default WindowResizeListener;