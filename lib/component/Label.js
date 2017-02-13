'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isNil2 = require('lodash/isNil');

var _isNil3 = _interopRequireDefault(_isNil2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

var _ReactUtils = require('../util/ReactUtils');

var _DataUtils = require('../util/DataUtils');

var _PolarUtils = require('../util/PolarUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cartesianViewBoxShape = _react.PropTypes.shape({
  x: _react.PropTypes.number,
  y: _react.PropTypes.number,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number
});
var polarViewBoxShape = _react.PropTypes.shape({
  cx: _react.PropTypes.number,
  cy: _react.PropTypes.number,
  innerRadius: _react.PropTypes.number,
  outerRadius: _react.PropTypes.number,
  startAngle: _react.PropTypes.number,
  endAngle: _react.PropTypes.number
});

var propTypes = {
  viewBox: _react.PropTypes.oneOfType([cartesianViewBoxShape, polarViewBoxShape]),
  formatter: _react.PropTypes.func,
  value: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]),
  offset: _react.PropTypes.number,
  position: _react.PropTypes.oneOf(['top', 'left', 'right', 'bottom', 'inside', 'outside', 'insideLeft', 'insideRight', 'insideTop', 'insideBottom', 'insideTopLeft', 'insideBottomLeft', 'insideTopRight', 'insideBottomRight', 'insideStart', 'insideEnd', 'end']),
  children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.node), _react.PropTypes.node])
};

var defaultProps = {
  offset: 5
};

var getLabel = function getLabel(props) {
  if (!(0, _isNil3.default)(props.children)) {
    return props.children;
  }

  var value = props.value,
      formatter = props.formatter;


  if ((0, _isFunction3.default)(formatter)) {
    return formatter(value);
  }

  return value;
};

var getDeltaAngle = function getDeltaAngle(startAngle, endAngle) {
  var sign = Math.sign(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);

  return sign * deltaAngle;
};

var renderRadialLabel = function renderRadialLabel(labelProps, label, attrs) {
  var position = labelProps.position,
      viewBox = labelProps.viewBox,
      offset = labelProps.offset;
  var cx = viewBox.cx,
      cy = viewBox.cy,
      innerRadius = viewBox.innerRadius,
      outerRadius = viewBox.outerRadius,
      startAngle = viewBox.startAngle,
      endAngle = viewBox.endAngle,
      clockWise = viewBox.clockWise;

  var radius = (innerRadius + outerRadius) / 2;
  var deltaAngle = getDeltaAngle(startAngle, endAngle);
  var sign = deltaAngle >= 0 ? 1 : -1;
  var labelAngle = void 0,
      direction = void 0;

  if (position === 'insideStart') {
    labelAngle = startAngle + sign * offset;
    direction = clockWise;
  } else if (position === 'insideEnd') {
    labelAngle = endAngle - sign * offset;
    direction = !clockWise;
  } else if (position === 'end') {
    labelAngle = endAngle + sign * offset;
    direction = clockWise;
  }

  direction = deltaAngle <= 0 ? direction : !direction;

  var startPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, labelAngle);
  var endPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, labelAngle + (direction ? 1 : -1) * 359);
  var path = 'M' + startPoint.x + ',' + startPoint.y + '\n    A' + radius + ',' + radius + ',0,1,' + (direction ? 0 : 1) + ',\n    ' + endPoint.x + ',' + endPoint.y;
  var id = (0, _DataUtils.uniqueId)('recharts-radial-line-');

  return _react2.default.createElement(
    'text',
    _extends({}, attrs, {
      dominantBaseline: 'central',
      className: 'recharts-radial-bar-label'
    }),
    _react2.default.createElement(
      'defs',
      null,
      _react2.default.createElement('path', { id: id, d: path })
    ),
    _react2.default.createElement(
      'textPath',
      { xlinkHref: '#' + id },
      label
    )
  );
};

var getAttrsOfPolarLabel = function getAttrsOfPolarLabel(props) {
  var viewBox = props.viewBox,
      offset = props.offset,
      position = props.position;
  var cx = viewBox.cx,
      cy = viewBox.cy,
      innerRadius = viewBox.innerRadius,
      outerRadius = viewBox.outerRadius,
      startAngle = viewBox.startAngle,
      endAngle = viewBox.endAngle;

  var midAngle = (startAngle + endAngle) / 2;

  if (position === 'outside') {
    var _polarToCartesian = (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius + offset, midAngle),
        _x = _polarToCartesian.x,
        _y = _polarToCartesian.y;

    return {
      x: _x,
      y: _y,
      textAnchor: _x >= cx ? 'start' : 'end',
      verticalAnchor: 'middle'
    };
  }

  if (position === 'center') {
    return {
      x: cx,
      y: cy,
      textAnchor: 'middle',
      verticalAnchor: 'middle'
    };
  }

  var r = (innerRadius + outerRadius) / 2;

  var _polarToCartesian2 = (0, _PolarUtils.polarToCartesian)(cx, cy, r, midAngle),
      x = _polarToCartesian2.x,
      y = _polarToCartesian2.y;

  return {
    x: x,
    y: y,
    textAnchor: 'middle',
    verticalAnchor: 'middle'
  };
};

var getAttrsOfCartesianLabel = function getAttrsOfCartesianLabel(props) {
  var viewBox = props.viewBox,
      offset = props.offset,
      position = props.position;
  var x = viewBox.x,
      y = viewBox.y,
      width = viewBox.width,
      height = viewBox.height;

  var sign = height >= 0 ? 1 : -1;

  if (position === 'top') {
    return {
      x: x + width / 2,
      y: y - sign * offset,
      textAnchor: 'middle',
      verticalAnchor: 'end'
    };
  }

  if (position === 'bottom') {
    return {
      x: x + width / 2,
      y: y + height + sign * offset,
      textAnchor: 'middle',
      verticalAnchor: 'start'
    };
  }

  if (position === 'left') {
    return {
      x: x - offset,
      y: y + height / 2,
      textAnchor: 'end',
      verticalAnchor: 'middle'
    };
  }

  if (position === 'right') {
    return {
      x: x + width + offset,
      y: y + height / 2,
      textAnchor: 'start',
      verticalAnchor: 'middle'
    };
  }

  if (position === 'insideLeft') {
    return {
      x: x + offset,
      y: y + height / 2,
      textAnchor: 'start',
      verticalAnchor: 'middle'
    };
  }

  if (position === 'insideRight') {
    return {
      x: x + width - offset,
      y: y + height / 2,
      textAnchor: 'end',
      verticalAnchor: 'middle'
    };
  }

  if (position === 'insideTop') {
    return {
      x: x + width / 2,
      y: y + sign * offset,
      textAnchor: 'middle',
      verticalAnchor: 'start'
    };
  }

  if (position === 'insideBottom') {
    return {
      x: x + width / 2,
      y: y + height - sign * offset,
      textAnchor: 'middle',
      verticalAnchor: 'end'
    };
  }

  if (position === 'insideTopLeft') {
    return {
      x: x + offset,
      y: y + sign * offset,
      textAnchor: 'start',
      verticalAnchor: 'start'
    };
  }

  if (position === 'insideTopRight') {
    return {
      x: x + width - offset,
      y: y + sign * offset,
      textAnchor: 'end',
      verticalAnchor: 'start'
    };
  }

  if (position === 'insideBottomLeft') {
    return {
      x: x + offset,
      y: y + height - sign * offset,
      textAnchor: 'start',
      verticalAnchor: 'end'
    };
  }

  if (position === 'insideBottomRight') {
    return {
      x: x + width - offset,
      y: y + height - sign * offset,
      textAnchor: 'end',
      verticalAnchor: 'end'
    };
  }

  if ((0, _isObject3.default)(position) && ((0, _DataUtils.isNumber)(position.x) || (0, _DataUtils.isPercent)(position.x)) && ((0, _DataUtils.isNumber)(position.y) || (0, _DataUtils.isPercent)(position.y))) {
    return {
      x: x + (0, _DataUtils.getPercentValue)(position.x, width),
      y: y + (0, _DataUtils.getPercentValue)(position.y, height),
      textAnchor: 'end',
      verticalAnchor: 'end'
    };
  }

  return {
    x: x + width / 2,
    y: y + height / 2,
    textAnchor: 'middle',
    verticalAnchor: 'middle'
  };
};

var isPolar = function isPolar(viewBox) {
  return (0, _DataUtils.isNumber)(viewBox.cx);
};

function Label(props) {
  var viewBox = props.viewBox,
      position = props.position,
      value = props.value,
      children = props.children;


  if (!viewBox || (0, _isNil3.default)(value) && (0, _isNil3.default)(children)) {
    return null;
  }

  var isPolarLabel = isPolar(viewBox);
  var label = getLabel(props);
  var attrs = (0, _ReactUtils.getPresentationAttributes)(props);

  if (isPolarLabel && (position === 'insideStart' || position === 'insideEnd' || position === 'end')) {
    return renderRadialLabel(props, label, attrs);
  }

  var positionAttrs = isPolarLabel ? getAttrsOfPolarLabel(props) : getAttrsOfCartesianLabel(props);

  return _react2.default.createElement(
    _Text2.default,
    _extends({}, attrs, positionAttrs),
    label
  );
}

Label.displayName = 'Label';
Label.defaultProps = defaultProps;
Label.propTypes = propTypes;

var parseViewBox = function parseViewBox(props) {
  var cx = props.cx,
      cy = props.cy,
      angle = props.angle,
      startAngle = props.startAngle,
      endAngle = props.endAngle,
      r = props.r,
      radius = props.radius,
      innerRadius = props.innerRadius,
      outerRadius = props.outerRadius,
      x = props.x,
      y = props.y,
      top = props.top,
      left = props.left,
      width = props.width,
      height = props.height,
      clockWise = props.clockWise;


  if ((0, _DataUtils.isNumber)(width) && (0, _DataUtils.isNumber)(height)) {
    if ((0, _DataUtils.isNumber)(x) && (0, _DataUtils.isNumber)(y)) {
      return { x: x, y: y, width: width, height: height };
    } else if ((0, _DataUtils.isNumber)(top) && (0, _DataUtils.isNumber)(left)) {
      return { x: top, y: left, width: width, height: height };
    }
  }

  if ((0, _DataUtils.isNumber)(x) && (0, _DataUtils.isNumber)(y)) {
    return { x: x, y: y, width: 0, height: 0 };
  }

  if ((0, _DataUtils.isNumber)(cx) && (0, _DataUtils.isNumber)(cy)) {
    return {
      cx: cx, cy: cy,
      startAngle: startAngle || angle || 0,
      endAngle: endAngle || angle || 0,
      innerRadius: innerRadius || 0,
      outerRadius: outerRadius || radius || r || 0,
      clockWise: clockWise
    };
  }

  if (props.viewBox) {
    return props.viewBox;
  }

  return {};
};

var renderCallByParent = function renderCallByParent(parentProps, viewBox) {
  if (!parentProps || !parentProps.children) {
    return null;
  }
  var children = parentProps.children;


  return (0, _ReactUtils.findAllByType)(children, Label).map(function (child, index) {
    return (0, _react.cloneElement)(child, {
      viewBox: viewBox || parseViewBox(parentProps),
      key: 'label-' + index
    });
  });
};

Label.parseViewBox = parseViewBox;
Label.renderCallByParent = renderCallByParent;

exports.default = Label;