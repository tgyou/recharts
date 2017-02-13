'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isNil2 = require('lodash/isNil');

var _isNil3 = _interopRequireDefault(_isNil2);

var _last2 = require('lodash/last');

var _last3 = _interopRequireDefault(_last2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Label = require('./Label');

var _Label2 = _interopRequireDefault(_Label);

var _Layer = require('../container/Layer');

var _Layer2 = _interopRequireDefault(_Layer);

var _ReactUtils = require('../util/ReactUtils');

var _DataUtils = require('../util/DataUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var propTypes = {
  data: _react.PropTypes.arrayOf(_react.PropTypes.object),
  valueAccessor: _react.PropTypes.func,
  clockWise: _react.PropTypes.bool
};

var defaultProps = {
  valueAccessor: function valueAccessor(entry) {
    return (0, _isArray3.default)(entry.value) ? (0, _last3.default)(entry.value) : entry.value;
  }
};

function LabelList(props) {
  var data = props.data,
      valueAccessor = props.valueAccessor,
      clockWise = props.clockWise,
      others = _objectWithoutProperties(props, ['data', 'valueAccessor', 'clockWise']);

  if (!data || !data.length) {
    return null;
  }

  return _react2.default.createElement(
    _Layer2.default,
    null,
    data.map(function (entry, index) {
      return _react2.default.createElement(_Label2.default, _extends({}, (0, _ReactUtils.getPresentationAttributes)(entry), others, {
        value: valueAccessor(entry, index),
        viewBox: _Label2.default.parseViewBox((0, _isNil3.default)(clockWise) ? entry : _extends({}, entry, { clockWise: clockWise })),
        key: 'label-' + index
      }));
    })
  );
}

LabelList.propTypes = propTypes;
LabelList.displayName = 'LabelList';

var renderCallByParent = function renderCallByParent(parentProps, data) {
  if (!parentProps || !parentProps.children) {
    return null;
  }
  var children = parentProps.children;


  return (0, _ReactUtils.findAllByType)(children, LabelList).map(function (child, index) {
    return (0, _react.cloneElement)(child, {
      data: data,
      key: 'labelList-' + index
    });
  });
};
LabelList.renderCallByParent = renderCallByParent;
LabelList.defaultProps = defaultProps;

exports.default = LabelList;