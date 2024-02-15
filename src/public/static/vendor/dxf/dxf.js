(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dxf = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("./util/logger"));

var _parseString = _interopRequireDefault(require("./parseString"));

var _denormalise2 = _interopRequireDefault(require("./denormalise"));

var _toSVG2 = _interopRequireDefault(require("./toSVG"));

var _toPolylines2 = _interopRequireDefault(require("./toPolylines"));

var _groupEntitiesByLayer = _interopRequireDefault(require("./groupEntitiesByLayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Helper = /*#__PURE__*/function () {
  function Helper(contents) {
    _classCallCheck(this, Helper);

    if (!(typeof contents === 'string')) {
      throw Error('Helper constructor expects a DXF string');
    }

    this._contents = contents;
    this._parsed = null;
    this._denormalised = null;
  }

  _createClass(Helper, [{
    key: "parse",
    value: function parse() {
      this._parsed = (0, _parseString["default"])(this._contents);

      _logger["default"].info('parsed:', this.parsed);

      return this._parsed;
    }
  }, {
    key: "denormalise",
    value: function denormalise() {
      this._denormalised = (0, _denormalise2["default"])(this.parsed);

      _logger["default"].info('denormalised:', this._denormalised);

      return this._denormalised;
    }
  }, {
    key: "group",
    value: function group() {
      this._groups = (0, _groupEntitiesByLayer["default"])(this.denormalised);
    }
  }, {
    key: "toSVG",
    value: function toSVG() {
      return (0, _toSVG2["default"])(this.parsed);
    }
  }, {
    key: "toPolylines",
    value: function toPolylines() {
      return (0, _toPolylines2["default"])(this.parsed);
    }
  }, {
    key: "parsed",
    get: function get() {
      if (this._parsed === null) {
        this.parse();
      }

      return this._parsed;
    }
  }, {
    key: "denormalised",
    get: function get() {
      if (!this._denormalised) {
        this.denormalise();
      }

      return this._denormalised;
    }
  }, {
    key: "groups",
    get: function get() {
      if (!this._groups) {
        this.group();
      }

      return this._groups;
    }
  }]);

  return Helper;
}();

exports["default"] = Helper;
},{"./denormalise":4,"./groupEntitiesByLayer":7,"./parseString":29,"./toPolylines":30,"./toSVG":31,"./util/logger":36}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Apply the transforms to the polyline.
 *
 * @param polyline the polyline
 * @param transform the transforms array
 * @returns the transformed polyline
 */
var _default = function _default(polyline, transforms) {
  transforms.forEach(function (transform) {
    polyline = polyline.map(function (p) {
      // Use a copy to avoid side effects
      var p2 = [p[0], p[1]];

      if (transform.scaleX) {
        p2[0] = p2[0] * transform.scaleX;
      }

      if (transform.scaleY) {
        p2[1] = p2[1] * transform.scaleY;
      }

      if (transform.rotation) {
        var angle = transform.rotation / 180 * Math.PI;
        p2 = [p2[0] * Math.cos(angle) - p2[1] * Math.sin(angle), p2[1] * Math.cos(angle) + p2[0] * Math.sin(angle)];
      }

      if (transform.x) {
        p2[0] = p2[0] + transform.x;
      }

      if (transform.y) {
        p2[1] = p2[1] + transform.y;
      } // Observed once in a sample DXF - some cad applications
      // use negative extruxion Z for flipping


      if (transform.extrusionZ === -1) {
        p2[0] = -p2[0];
      }

      return p2;
    });
  });
  return polyline;
};

exports["default"] = _default;
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  verbose: false
};
exports["default"] = _default;
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _logger = _interopRequireDefault(require("./util/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = function _default(parseResult) {
  var blocksByName = parseResult.blocks.reduce(function (acc, b) {
    acc[b.name] = b;
    return acc;
  }, {});

  var gatherEntities = function gatherEntities(entities, transforms) {
    var current = [];
    entities.forEach(function (e) {
      if (e.type === 'INSERT') {
        var _ret = function () {
          var _insert$rowCount, _insert$columnCount, _insert$rowSpacing, _insert$columnSpacing, _insert$rotation;

          var insert = e;
          var block = blocksByName[insert.block];

          if (!block) {
            _logger["default"].error('no block found for insert. block:', insert.block);

            return {
              v: void 0
            };
          }

          var rowCount = (_insert$rowCount = insert.rowCount) !== null && _insert$rowCount !== void 0 ? _insert$rowCount : 1;
          var columnCount = (_insert$columnCount = insert.columnCount) !== null && _insert$columnCount !== void 0 ? _insert$columnCount : 1;
          var rowSpacing = (_insert$rowSpacing = insert.rowSpacing) !== null && _insert$rowSpacing !== void 0 ? _insert$rowSpacing : 0;
          var columnSpacing = (_insert$columnSpacing = insert.columnSpacing) !== null && _insert$columnSpacing !== void 0 ? _insert$columnSpacing : 0;
          var rotation = (_insert$rotation = insert.rotation) !== null && _insert$rotation !== void 0 ? _insert$rotation : 0; // It appears that the rectangular array is affected by rotation, but NOT by scale.

          var rowVec, colVec;

          if (rowCount > 1 || columnCount > 1) {
            var cos = Math.cos(rotation * Math.PI / 180);
            var sin = Math.sin(rotation * Math.PI / 180);
            rowVec = {
              x: -sin * rowSpacing,
              y: cos * rowSpacing
            };
            colVec = {
              x: cos * columnSpacing,
              y: sin * columnSpacing
            };
          } else {
            rowVec = {
              x: 0,
              y: 0
            };
            colVec = {
              x: 0,
              y: 0
            };
          } // For rectangular arrays, add the block entities for each location in the array


          for (var r = 0; r < rowCount; r++) {
            for (var c = 0; c < columnCount; c++) {
              // Adjust insert transform by row and column for rectangular arrays
              var t = {
                x: insert.x + rowVec.x * r + colVec.x * c,
                y: insert.y + rowVec.y * r + colVec.y * c,
                scaleX: insert.scaleX,
                scaleY: insert.scaleY,
                scaleZ: insert.scaleZ,
                extrusionX: insert.extrusionX,
                extrusionY: insert.extrusionY,
                extrusionZ: insert.extrusionZ,
                rotation: insert.rotation
              }; // Add the insert transform and recursively add entities

              var transforms2 = transforms.slice(0);
              transforms2.push(t); // Use the insert layer

              var blockEntities = block.entities.map(function (be) {
                var be2 = (0, _cloneDeep["default"])(be);
                be2.layer = insert.layer; // https://github.com/bjnortier/dxf/issues/52
                // See Issue 52. If we don't modify the
                // entity coordinates here it creates an issue with the
                // transformation matrices (which are only applied AFTER
                // block insertion modifications has been applied).

                switch (be2.type) {
                  case 'LINE':
                    {
                      be2.start.x -= block.x;
                      be2.start.y -= block.y;
                      be2.end.x -= block.x;
                      be2.end.y -= block.y;
                      break;
                    }

                  case 'LWPOLYLINE':
                  case 'POLYLINE':
                    {
                      be2.vertices.forEach(function (v) {
                        v.x -= block.x;
                        v.y -= block.y;
                      });
                      break;
                    }

                  case 'CIRCLE':
                  case 'ELLIPSE':
                  case 'ARC':
                    {
                      be2.x -= block.x;
                      be2.y -= block.y;
                      break;
                    }

                  case 'SPLINE':
                    {
                      be2.controlPoints.forEach(function (cp) {
                        cp.x -= block.x;
                        cp.y -= block.y;
                      });
                      break;
                    }
                }

                return be2;
              });
              current = current.concat(gatherEntities(blockEntities, transforms2));
            }
          }
        }();

        if (_typeof(_ret) === "object") return _ret.v;
      } else {
        // Top-level entity. Clone and add the transforms
        // The transforms are reversed so they occur in
        // order of application - i.e. the transform of the
        // top-level insert is applied last
        var e2 = (0, _cloneDeep["default"])(e);
        e2.transforms = transforms.slice().reverse();
        current.push(e2);
      }
    });
    return current;
  };

  return gatherEntities(parseResult.entities, []);
};

exports["default"] = _default;
},{"./util/logger":36,"lodash/cloneDeep":133}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.interpolateBSpline = void 0;

var _bSpline = _interopRequireDefault(require("./util/bSpline"));

var _logger = _interopRequireDefault(require("./util/logger"));

var _createArcForLWPolyline = _interopRequireDefault(require("./util/createArcForLWPolyline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Rotate a set of points.
 *
 * @param points the points
 * @param angle the rotation angle
 */
var rotate = function rotate(points, angle) {
  return points.map(function (p) {
    return [p[0] * Math.cos(angle) - p[1] * Math.sin(angle), p[1] * Math.cos(angle) + p[0] * Math.sin(angle)];
  });
};
/**
 * Interpolate an ellipse
 * @param cx center X
 * @param cy center Y
 * @param rx radius X
 * @param ry radius Y
 * @param start start angle in radians
 * @param start end angle in radians
 */


var interpolateEllipse = function interpolateEllipse(cx, cy, rx, ry, start, end, rotationAngle) {
  if (end < start) {
    end += Math.PI * 2;
  } // ----- Relative points -----
  // Start point


  var points = [];
  var dTheta = Math.PI * 2 / 72;
  var EPS = 1e-6;

  for (var theta = start; theta < end - EPS; theta += dTheta) {
    points.push([Math.cos(theta) * rx, Math.sin(theta) * ry]);
  }

  points.push([Math.cos(end) * rx, Math.sin(end) * ry]); // ----- Rotate -----

  if (rotationAngle) {
    points = rotate(points, rotationAngle);
  } // ----- Offset center -----


  points = points.map(function (p) {
    return [cx + p[0], cy + p[1]];
  });
  return points;
};
/**
 * Interpolate a b-spline. The algorithm examins the knot vector
 * to create segments for interpolation. The parameterisation value
 * is re-normalised back to [0,1] as that is what the lib expects (
 * and t i de-normalised in the b-spline library)
 *
 * @param controlPoints the control points
 * @param degree the b-spline degree
 * @param knots the knot vector
 * @returns the polyline
 */


var interpolateBSpline = function interpolateBSpline(controlPoints, degree, knots, interpolationsPerSplineSegment, weights) {
  var polyline = [];
  var controlPointsForLib = controlPoints.map(function (p) {
    return [p.x, p.y];
  });
  var segmentTs = [knots[degree]];
  var domain = [knots[degree], knots[knots.length - 1 - degree]];

  for (var k = degree + 1; k < knots.length - degree; ++k) {
    if (segmentTs[segmentTs.length - 1] !== knots[k]) {
      segmentTs.push(knots[k]);
    }
  }

  interpolationsPerSplineSegment = interpolationsPerSplineSegment || 25;

  for (var i = 1; i < segmentTs.length; ++i) {
    var uMin = segmentTs[i - 1];
    var uMax = segmentTs[i];

    for (var _k = 0; _k <= interpolationsPerSplineSegment; ++_k) {
      var u = _k / interpolationsPerSplineSegment * (uMax - uMin) + uMin; // Clamp t to 0, 1 to handle numerical precision issues

      var t = (u - domain[0]) / (domain[1] - domain[0]);
      t = Math.max(t, 0);
      t = Math.min(t, 1);
      var p = (0, _bSpline["default"])(t, degree, controlPointsForLib, knots, weights);
      polyline.push(p);
    }
  }

  return polyline;
};
/**
 * Convert a parsed DXF entity to a polyline. These can be used to render the
 * the DXF in SVG, Canvas, WebGL etc., without depending on native support
 * of primitive objects (ellispe, spline etc.)
 */


exports.interpolateBSpline = interpolateBSpline;

var _default = function _default(entity, options) {
  options = options || {};
  var polyline;

  if (entity.type === 'LINE') {
    polyline = [[entity.start.x, entity.start.y], [entity.end.x, entity.end.y]];
  }

  if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
    polyline = [];

    if (entity.polygonMesh || entity.polyfaceMesh) {// Do not attempt to render meshes
    } else if (entity.vertices.length) {
      if (entity.closed) {
        entity.vertices = entity.vertices.concat(entity.vertices[0]);
      }

      for (var i = 0, il = entity.vertices.length; i < il - 1; ++i) {
        var from = [entity.vertices[i].x, entity.vertices[i].y];
        var to = [entity.vertices[i + 1].x, entity.vertices[i + 1].y];
        polyline.push(from);

        if (entity.vertices[i].bulge) {
          polyline = polyline.concat((0, _createArcForLWPolyline["default"])(from, to, entity.vertices[i].bulge));
        } // The last iteration of the for loop


        if (i === il - 2) {
          polyline.push(to);
        }
      }
    } else {
      _logger["default"].warn('Polyline entity with no vertices');
    }
  }

  if (entity.type === 'CIRCLE') {
    polyline = interpolateEllipse(entity.x, entity.y, entity.r, entity.r, 0, Math.PI * 2);

    if (entity.extrusionZ === -1) {
      polyline = polyline.map(function (p) {
        return [-p[0], p[1]];
      });
    }
  }

  if (entity.type === 'ELLIPSE') {
    var rx = Math.sqrt(entity.majorX * entity.majorX + entity.majorY * entity.majorY);
    var ry = entity.axisRatio * rx;
    var majorAxisRotation = -Math.atan2(-entity.majorY, entity.majorX);
    polyline = interpolateEllipse(entity.x, entity.y, rx, ry, entity.startAngle, entity.endAngle, majorAxisRotation);

    if (entity.extrusionZ === -1) {
      polyline = polyline.map(function (p) {
        return [-p[0], p[1]];
      });
    }
  }

  if (entity.type === 'ARC') {
    // Why on earth DXF has degree start & end angles for arc,
    // and radian start & end angles for ellipses is a mystery
    polyline = interpolateEllipse(entity.x, entity.y, entity.r, entity.r, entity.startAngle, entity.endAngle, undefined, false); // I kid you not, ARCs and ELLIPSEs handle this differently,
    // as evidenced by how AutoCAD actually renders these entities

    if (entity.extrusionZ === -1) {
      polyline = polyline.map(function (p) {
        return [-p[0], p[1]];
      });
    }
  }

  if (entity.type === 'SPLINE') {
    polyline = interpolateBSpline(entity.controlPoints, entity.degree, entity.knots, options.interpolationsPerSplineSegment, entity.weights);
  }

  if (!polyline) {
    _logger["default"].warn('unsupported entity for converting to polyline:', entity.type);

    return [];
  }

  return polyline;
};

exports["default"] = _default;
},{"./util/bSpline":32,"./util/createArcForLWPolyline":34,"./util/logger":36}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _colors = _interopRequireDefault(require("./util/colors"));

var _logger = _interopRequireDefault(require("./util/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(layers, entity) {
  var layerTable = layers[entity.layer];

  if (layerTable) {
    var colorNumber = 'colorNumber' in entity ? entity.colorNumber : layerTable.colorNumber;
    var rgb = _colors["default"][colorNumber];

    if (rgb) {
      return rgb;
    } else {
      _logger["default"].warn('Color index', colorNumber, 'invalid, defaulting to black');

      return [0, 0, 0];
    }
  } else {
    _logger["default"].warn('no layer table for layer:' + entity.layer);

    return [0, 0, 0];
  }
};

exports["default"] = _default;
},{"./util/colors":33,"./util/logger":36}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(entities) {
  return entities.reduce(function (acc, entity) {
    var layer = entity.layer;

    if (!acc[layer]) {
      acc[layer] = [];
    }

    acc[layer].push(entity);
    return acc;
  }, {});
};

exports["default"] = _default;
},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _entities = _interopRequireDefault(require("./entities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(tuples) {
  var state;
  var blocks = [];
  var block;
  var entitiesTuples = [];
  tuples.forEach(function (tuple) {
    var type = tuple[0];
    var value = tuple[1];

    if (value === 'BLOCK') {
      state = 'block';
      block = {};
      entitiesTuples = [];
      blocks.push(block);
    } else if (value === 'ENDBLK') {
      if (state === 'entities') {
        block.entities = (0, _entities["default"])(entitiesTuples);
      } else {
        block.entities = [];
      }

      entitiesTuples = undefined;
      state = undefined;
    } else if (state === 'block' && type !== 0) {
      switch (type) {
        case 1:
          block.xref = value;
          break;

        case 2:
          block.name = value;
          break;

        case 10:
          block.x = value;
          break;

        case 20:
          block.y = value;
          break;

        case 30:
          block.z = value;
          break;

        default:
          break;
      }
    } else if (state === 'block' && type === 0) {
      state = 'entities';
      entitiesTuples.push(tuple);
    } else if (state === 'entities') {
      entitiesTuples.push(tuple);
    }
  });
  return blocks;
};

exports["default"] = _default;
},{"./entities":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("../util/logger"));

var _point = _interopRequireDefault(require("./entity/point"));

var _line = _interopRequireDefault(require("./entity/line"));

var _lwpolyline = _interopRequireDefault(require("./entity/lwpolyline"));

var _polyline = _interopRequireDefault(require("./entity/polyline"));

var _vertex = _interopRequireDefault(require("./entity/vertex"));

var _circle = _interopRequireDefault(require("./entity/circle"));

var _arc = _interopRequireDefault(require("./entity/arc"));

var _ellipse = _interopRequireDefault(require("./entity/ellipse"));

var _spline = _interopRequireDefault(require("./entity/spline"));

var _solid = _interopRequireDefault(require("./entity/solid"));

var _mtext = _interopRequireDefault(require("./entity/mtext"));

var _insert = _interopRequireDefault(require("./entity/insert"));

var _threeDFace = _interopRequireDefault(require("./entity/threeDFace"));

var _dimension = _interopRequireDefault(require("./entity/dimension"));

var _text = _interopRequireDefault(require("./entity/text"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var handlers = [_point["default"], _line["default"], _lwpolyline["default"], _polyline["default"], _vertex["default"], _circle["default"], _arc["default"], _ellipse["default"], _spline["default"], _solid["default"], _mtext["default"], _text["default"], _insert["default"], _dimension["default"], _threeDFace["default"]].reduce(function (acc, mod) {
  acc[mod.TYPE] = mod;
  return acc;
}, {});

var _default = function _default(tuples) {
  var entities = [];
  var entityGroups = [];
  var currentEntityTuples; // First group them together for easy processing

  tuples.forEach(function (tuple) {
    var type = tuple[0];

    if (type === 0) {
      currentEntityTuples = [];
      entityGroups.push(currentEntityTuples);
    }

    currentEntityTuples.push(tuple);
  });
  var currentPolyline;
  entityGroups.forEach(function (tuples) {
    var entityType = tuples[0][1];
    var contentTuples = tuples.slice(1);

    if (handlers[entityType] !== undefined) {
      var e = handlers[entityType].process(contentTuples); // "POLYLINE" cannot be parsed in isolation, it is followed by
      // N "VERTEX" entities and ended with a "SEQEND" entity.
      // Essentially we convert POLYLINE to LWPOLYLINE - the extra
      // vertex flags are not supported

      if (entityType === 'POLYLINE') {
        currentPolyline = e;
        entities.push(e);
      } else if (entityType === 'VERTEX') {
        if (currentPolyline) {
          currentPolyline.vertices.push(e);
        } else {
          _logger["default"].error('ignoring invalid VERTEX entity');
        }
      } else if (entityType === 'SEQEND') {
        currentPolyline = undefined;
      } else {
        // All other entities
        entities.push(e);
      }
    } else {
      _logger["default"].warn('unsupported type in ENTITIES section:', entityType);
    }
  });
  return entities;
};

exports["default"] = _default;
},{"../util/logger":36,"./entity/arc":10,"./entity/circle":11,"./entity/dimension":13,"./entity/ellipse":14,"./entity/insert":15,"./entity/line":16,"./entity/lwpolyline":17,"./entity/mtext":18,"./entity/point":19,"./entity/polyline":20,"./entity/solid":21,"./entity/spline":22,"./entity/text":23,"./entity/threeDFace":24,"./entity/vertex":25}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'ARC';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        entity.x = value;
        break;

      case 20:
        entity.y = value;
        break;

      case 30:
        entity.z = value;
        break;

      case 39:
        entity.thickness = value;
        break;

      case 40:
        entity.r = value;
        break;

      case 50:
        // *Someone* decided that ELLIPSE angles are in radians but
        // ARC angles are in degrees
        entity.startAngle = value / 180 * Math.PI;
        break;

      case 51:
        entity.endAngle = value / 180 * Math.PI;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'CIRCLE';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        entity.x = value;
        break;

      case 20:
        entity.y = value;
        break;

      case 30:
        entity.z = value;
        break;

      case 40:
        entity.r = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(type, value) {
  switch (type) {
    case 6:
      // Linetype name (present if not BYLAYER).
      // The special name BYBLOCK indicates a
      // floating linetype. (optional)
      return {
        lineTypeName: value
      };

    case 8:
      return {
        layer: value
      };

    case 48:
      // Linetype scale (optional)
      return {
        lineTypeScale: value
      };

    case 60:
      // Object visibility (optional): 0 = visible, 1 = invisible.
      return {
        visible: value === 0
      };

    case 62:
      // Color number (present if not BYLAYER).
      // Zero indicates the BYBLOCK (floating) color.
      // 256 indicates BYLAYER.
      // A negative value indicates that the layer is turned off. (optional)
      return {
        colorNumber: value
      };

    case 210:
      return {
        extrusionX: value
      };

    case 220:
      return {
        extrusionY: value
      };

    case 230:
      return {
        extrusionZ: value
      };

    default:
      return {};
  }
};

exports["default"] = _default;
},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'DIMENSION';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 2:
        entity.block = value;
        break;

      case 10:
        entity.start.x = value;
        break;

      case 20:
        entity.start.y = value;
        break;

      case 30:
        entity.start.z = value;
        break;

      case 11:
        entity.textMidpoint.x = value;
        break;

      case 21:
        entity.textMidpoint.y = value;
        break;

      case 31:
        entity.textMidpoint.z = value;
        break;

      case 13:
        entity.measureStart.x = value;
        break;

      case 23:
        entity.measureStart.y = value;
        break;

      case 33:
        entity.measureStart.z = value;
        break;

      case 14:
        entity.measureEnd.x = value;
        break;

      case 24:
        entity.measureEnd.y = value;
        break;

      case 34:
        entity.measureEnd.z = value;
        break;

      case 50:
        entity.rotation = value;
        break;

      case 51:
        entity.horizonRotation = value;
        break;

      case 52:
        entity.extensionRotation = value;
        break;

      case 53:
        entity.textRotation = value;
        break;

      case 70:
        {
          var dimType = parseBitCombinationsFromValue(value);

          if (dimType.ordinateType) {
            entity.ordinateType = true;
          }

          if (dimType.uniqueBlockReference) {
            entity.uniqueBlockReference = true;
          }

          if (dimType.userDefinedLocation) {
            entity.userDefinedLocation = true;
          }

          entity.dimensionType = dimType.dimensionType;
          break;
        }

      case 71:
        entity.attachementPoint = value;
        break;

      case 210:
        entity.extrudeDirection = entity.extrudeDirection || {};
        entity.extrudeDirection.x = value;
        break;

      case 220:
        entity.extrudeDirection = entity.extrudeDirection || {};
        entity.extrudeDirection.y = value;
        break;

      case 230:
        entity.extrudeDirection = entity.extrudeDirection || {};
        entity.extrudeDirection.z = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE,
    start: {
      x: 0,
      y: 0,
      z: 0
    },
    measureStart: {
      x: 0,
      y: 0,
      z: 0
    },
    measureEnd: {
      x: 0,
      y: 0,
      z: 0
    },
    textMidpoint: {
      x: 0,
      y: 0,
      z: 0
    },
    attachementPoint: 1,
    dimensionType: 0
  });
};
/**
 * From DXF Reference for DIMENSION
 * Values 0-6 are integer values that represent the dimension type. Values 32, 64, and 128
 * are bit values, which are added to the integer values (value 32 is always set in R13 and
 * later releases)
 * 0 = Rotated, horizontal, or vertical; 1 = Aligned
 * 2 = Angular; 3 = Diameter; 4 = Radius
 * 5 = Angular 3 point; 6 = Ordinate
 * 32 = Indicates that the block reference (group code 2) is referenced by this dimension only
 * 64 = Ordinate type. This is a bit value (bit 7) used only with integer value 6. If set, ordinate is X-type; if not set, ordinate is Y-type
 * 128 = This is a bit value (bit 8) added to the other group 70 values if the dimension text has been positioned at a user-defined location rather than at the default location
 */


exports.process = process;

function parseBitCombinationsFromValue(value) {
  var uniqueBlockReference = false;
  var ordinateType = false;
  var userDefinedLocation = false; // ToDo: Solve in some more clever way??

  if (value > 6) {
    var alt1 = value - 32;
    var alt2 = value - 64;
    var alt3 = value - 32 - 64;
    var alt4 = value - 32 - 128;
    var alt5 = value - 32 - 64 - 128;

    if (alt1 >= 0 && alt1 <= 6) {
      uniqueBlockReference = true;
      value = alt1;
    } else if (alt2 >= 0 && alt2 <= 6) {
      ordinateType = true;
      value = alt2;
    } else if (alt3 >= 0 && alt3 <= 6) {
      uniqueBlockReference = true;
      ordinateType = true;
      value = alt3;
    } else if (alt4 >= 0 && alt4 <= 6) {
      uniqueBlockReference = true;
      userDefinedLocation = true;
      value = alt4;
    } else if (alt5 >= 0 && alt5 <= 6) {
      uniqueBlockReference = true;
      ordinateType = true;
      userDefinedLocation = true;
      value = alt5;
    }
  }

  return {
    dimensionType: value,
    uniqueBlockReference: uniqueBlockReference,
    ordinateType: ordinateType,
    userDefinedLocation: userDefinedLocation
  };
}

var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'ELLIPSE';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        entity.x = value;
        break;

      case 11:
        entity.majorX = value;
        break;

      case 20:
        entity.y = value;
        break;

      case 21:
        entity.majorY = value;
        break;

      case 30:
        entity.z = value;
        break;

      case 31:
        entity.majorZ = value;
        break;

      case 40:
        entity.axisRatio = value;
        break;

      case 41:
        entity.startAngle = value;
        break;

      case 42:
        entity.endAngle = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'INSERT';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 2:
        entity.block = value;
        break;

      case 10:
        entity.x = value;
        break;

      case 20:
        entity.y = value;
        break;

      case 30:
        entity.z = value;
        break;

      case 41:
        entity.scaleX = value;
        break;

      case 42:
        entity.scaleY = value;
        break;

      case 43:
        entity.scaleZ = value;
        break;

      case 44:
        entity.columnSpacing = value;
        break;

      case 45:
        entity.rowSpacing = value;
        break;

      case 50:
        entity.rotation = value;
        break;

      case 70:
        entity.columnCount = value;
        break;

      case 71:
        entity.rowCount = value;
        break;

      case 210:
        entity.extrusionX = value;
        break;

      case 220:
        entity.extrusionY = value;
        break;

      case 230:
        entity.extrusionZ = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'LINE';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        entity.start.x = value;
        break;

      case 20:
        entity.start.y = value;
        break;

      case 30:
        entity.start.z = value;
        break;

      case 39:
        entity.thickness = value;
        break;

      case 11:
        entity.end.x = value;
        break;

      case 21:
        entity.end.y = value;
        break;

      case 31:
        entity.end.z = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE,
    start: {},
    end: {}
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'LWPOLYLINE';
exports.TYPE = TYPE;

var process = function process(tuples) {
  var vertex;
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 70:
        entity.closed = (value & 1) === 1;
        break;

      case 10:
        vertex = {
          x: value,
          y: 0
        };
        entity.vertices.push(vertex);
        break;

      case 20:
        vertex.y = value;
        break;

      case 39:
        entity.thickness = value;
        break;

      case 42:
        // Bulge (multiple entries; one entry for each vertex)  (optional; default = 0).
        vertex.bulge = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE,
    vertices: []
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'MTEXT';
exports.TYPE = TYPE;
var simpleCodes = {
  10: 'x',
  20: 'y',
  30: 'z',
  40: 'nominalTextHeight',
  41: 'refRectangleWidth',
  71: 'attachmentPoint',
  72: 'drawingDirection',
  7: 'styleName',
  11: 'xAxisX',
  21: 'xAxisY',
  31: 'xAxisZ',
  42: 'horizontalWidth',
  43: 'verticalHeight',
  73: 'lineSpacingStyle',
  44: 'lineSpacingFactor',
  90: 'backgroundFill',
  420: 'bgColorRGB0',
  421: 'bgColorRGB1',
  422: 'bgColorRGB2',
  423: 'bgColorRGB3',
  424: 'bgColorRGB4',
  425: 'bgColorRGB5',
  426: 'bgColorRGB6',
  427: 'bgColorRGB7',
  428: 'bgColorRGB8',
  429: 'bgColorRGB9',
  430: 'bgColorName0',
  431: 'bgColorName1',
  432: 'bgColorName2',
  433: 'bgColorName3',
  434: 'bgColorName4',
  435: 'bgColorName5',
  436: 'bgColorName6',
  437: 'bgColorName7',
  438: 'bgColorName8',
  439: 'bgColorName9',
  45: 'fillBoxStyle',
  63: 'bgFillColor',
  441: 'bgFillTransparency',
  75: 'columnType',
  76: 'columnCount',
  78: 'columnFlowReversed',
  79: 'columnAutoheight',
  48: 'columnWidth',
  49: 'columnGutter',
  50: 'columnHeights'
};

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    if (simpleCodes[type] !== undefined) {
      entity[simpleCodes[type]] = value;
    } else if (type === 1 || type === 3) {
      entity.string += value;
    } else if (type === 50) {
      // Rotation angle in radians
      entity.xAxisX = Math.cos(value);
      entity.xAxisY = Math.sin(value);
    } else {
      Object.assign(entity, (0, _common["default"])(type, value));
    }

    return entity;
  }, {
    type: TYPE,
    string: ''
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'POINT';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        entity.x = value;
        break;

      case 20:
        entity.y = value;
        break;

      case 30:
        entity.z = value;
        break;

      case 39:
        entity.thickness = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'POLYLINE';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 70:
        entity.closed = (value & 1) === 1;
        entity.polygonMesh = (value & 16) === 16;
        entity.polyfaceMesh = (value & 64) === 64;
        break;

      case 39:
        entity.thickness = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE,
    vertices: []
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'SOLID';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        entity.corners[0].x = value;
        break;

      case 20:
        entity.corners[0].y = value;
        break;

      case 30:
        entity.corners[0].z = value;
        break;

      case 11:
        entity.corners[1].x = value;
        break;

      case 21:
        entity.corners[1].y = value;
        break;

      case 31:
        entity.corners[1].z = value;
        break;

      case 12:
        entity.corners[2].x = value;
        break;

      case 22:
        entity.corners[2].y = value;
        break;

      case 32:
        entity.corners[2].z = value;
        break;

      case 13:
        entity.corners[3].x = value;
        break;

      case 23:
        entity.corners[3].y = value;
        break;

      case 33:
        entity.corners[3].z = value;
        break;

      case 39:
        entity.thickness = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE,
    corners: [{}, {}, {}, {}]
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'SPLINE';
exports.TYPE = TYPE;

var process = function process(tuples) {
  var controlPoint;
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        controlPoint = {
          x: value,
          y: 0
        };
        entity.controlPoints.push(controlPoint);
        break;

      case 20:
        controlPoint.y = value;
        break;

      case 30:
        controlPoint.z = value;
        break;

      case 40:
        entity.knots.push(value);
        break;

      case 41:
        // Only create weights if needed
        if (!entity.weights) entity.weights = [];
        entity.weights.push(value);
        break;

      case 42:
        entity.knotTolerance = value;
        break;

      case 43:
        entity.controlPointTolerance = value;
        break;

      case 44:
        entity.fitTolerance = value;
        break;

      case 70:
        // Spline flag (bit coded):
        // 1 = Closed spline
        // 2 = Periodic spline
        // 4 = Rational spline
        // 8 = Planar
        // 16 = Linear (planar bit is also set)
        entity.flag = value;
        entity.closed = (value & 1) === 1;
        break;

      case 71:
        entity.degree = value;
        break;

      case 72:
        entity.numberOfKnots = value;
        break;

      case 73:
        entity.numberOfControlPoints = value;
        break;

      case 74:
        entity.numberOfFitPoints = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE,
    controlPoints: [],
    knots: []
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = 'TEXT';
exports.TYPE = TYPE;
var simpleCodes = {
  1: 'string',
  10: 'x',
  20: 'y',
  30: 'z',
  11: 'x2',
  21: 'y2',
  31: 'z2',
  39: 'thickness',
  40: 'textHeight',
  41: 'relScaleX',
  50: 'rotation',
  51: 'obliqueAngle',
  7: 'styleName',
  71: 'mirror',
  72: 'hAlign',
  73: 'vAlign',
  210: 'extX',
  220: 'extY',
  230: 'extZ'
}; // const EXCEPTION_STRINGS = ['\\A1;', '%%u']

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    if (simpleCodes[type] !== undefined) {
      entity[simpleCodes[type]] = value;
    } else {
      Object.assign(entity, (0, _common["default"])(type, value));
    }

    return entity;
  }, {
    type: TYPE,
    string: ''
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;

var _common = _interopRequireDefault(require("./common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TYPE = '3DFACE';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        entity.vertices[0].x = value;
        break;

      case 20:
        entity.vertices[0].y = value;
        break;

      case 30:
        entity.vertices[0].z = value;
        break;

      case 11:
        entity.vertices[1].x = value;
        break;

      case 21:
        entity.vertices[1].y = value;
        break;

      case 31:
        entity.vertices[1].z = value;
        break;

      case 12:
        entity.vertices[2].x = value;
        break;

      case 22:
        entity.vertices[2].y = value;
        break;

      case 32:
        entity.vertices[2].z = value;
        break;

      case 13:
        entity.vertices[3].x = value;
        break;

      case 23:
        entity.vertices[3].y = value;
        break;

      case 33:
        entity.vertices[3].z = value;
        break;

      default:
        Object.assign(entity, (0, _common["default"])(type, value));
        break;
    }

    return entity;
  }, {
    type: TYPE,
    vertices: [{}, {}, {}, {}]
  });
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{"./common":12}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.process = exports.TYPE = void 0;
var TYPE = 'VERTEX';
exports.TYPE = TYPE;

var process = function process(tuples) {
  return tuples.reduce(function (entity, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 10:
        entity.x = value;
        break;

      case 20:
        entity.y = value;
        break;

      case 30:
        entity.z = value;
        break;

      case 42:
        entity.bulge = value;
        break;

      default:
        break;
    }

    return entity;
  }, {});
};

exports.process = process;
var _default = {
  TYPE: TYPE,
  process: process
};
exports["default"] = _default;
},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(tuples) {
  var state;
  var header = {};
  tuples.forEach(function (tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (value) {
      case '$MEASUREMENT':
        {
          state = 'measurement';
          break;
        }

      case '$INSUNITS':
        {
          state = 'insUnits';
          break;
        }

      case '$EXTMIN':
        header.extMin = {};
        state = 'extMin';
        break;

      case '$EXTMAX':
        header.extMax = {};
        state = 'extMax';
        break;

      case '$DIMASZ':
        header.dimArrowSize = {};
        state = 'dimArrowSize';
        break;

      default:
        switch (state) {
          case 'extMin':
          case 'extMax':
            {
              switch (type) {
                case 10:
                  header[state].x = value;
                  break;

                case 20:
                  header[state].y = value;
                  break;

                case 30:
                  header[state].z = value;
                  state = undefined;
                  break;
              }

              break;
            }

          case 'measurement':
          case 'insUnits':
            {
              switch (type) {
                case 70:
                  {
                    header[state] = value;
                    state = undefined;
                    break;
                  }
              }

              break;
            }

          case 'dimArrowSize':
            {
              switch (type) {
                case 40:
                  {
                    header[state] = value;
                    state = undefined;
                    break;
                  }
              }

              break;
            }
        }

    }
  });
  return header;
};

exports["default"] = _default;
},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("../util/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var layerHandler = function layerHandler(tuples) {
  return tuples.reduce(function (layer, tuple) {
    var type = tuple[0];
    var value = tuple[1]; // https://www.autodesk.com/techpubs/autocad/acad2000/dxf/layer_dxf_04.htm

    switch (type) {
      case 2:
        layer.name = value;
        break;

      case 6:
        layer.lineTypeName = value;
        break;

      case 62:
        layer.colorNumber = value;
        break;

      case 70:
        layer.flags = value;
        break;

      case 290:
        layer.plot = parseInt(value) !== 0;
        break;

      case 370:
        layer.lineWeightEnum = value;
        break;

      default:
    }

    return layer;
  }, {
    type: 'LAYER'
  });
};

var styleHandler = function styleHandler(tuples) {
  return tuples.reduce(function (style, tuple) {
    var type = tuple[0];
    var value = tuple[1];

    switch (type) {
      case 2:
        style.name = value;
        break;

      case 6:
        style.lineTypeName = value;
        break;

      case 40:
        style.fixedTextHeight = value;
        break;

      case 41:
        style.widthFactor = value;
        break;

      case 50:
        style.obliqueAngle = value;
        break;

      case 71:
        style.flags = value;
        break;

      case 42:
        style.lastHeightUsed = value;
        break;

      case 3:
        style.primaryFontFileName = value;
        break;

      case 4:
        style.bigFontFileName = value;
        break;

      default:
    }

    return style;
  }, {
    type: 'STYLE'
  });
};

var tableHandler = function tableHandler(tuples, tableType, handler) {
  var tableRowsTuples = [];
  var tableRowTuples;
  tuples.forEach(function (tuple) {
    var type = tuple[0];
    var value = tuple[1];

    if ((type === 0 || type === 2) && value === tableType) {
      tableRowTuples = [];
      tableRowsTuples.push(tableRowTuples);
    } else {
      tableRowTuples.push(tuple);
    }
  });
  return tableRowsTuples.reduce(function (acc, rowTuples) {
    var tableRow = handler(rowTuples);

    if (tableRow.name) {
      acc[tableRow.name] = tableRow;
    } else {
      _logger["default"].warn('table row without name:', tableRow);
    }

    return acc;
  }, {});
};

var _default = function _default(tuples) {
  var tableGroups = [];
  var tableTuples;
  tuples.forEach(function (tuple) {
    // const type = tuple[0];
    var value = tuple[1];

    if (value === 'TABLE') {
      tableTuples = [];
      tableGroups.push(tableTuples);
    } else if (value === 'ENDTAB') {
      tableGroups.push(tableTuples);
    } else {
      tableTuples.push(tuple);
    }
  });
  var stylesTuples = [];
  var layersTuples = [];
  tableGroups.forEach(function (group) {
    if (group[0][1] === 'STYLE') {
      stylesTuples = group;
    } else if (group[0][1] === 'LTYPE') {
      _logger["default"].warn('LTYPE in tables not supported');
    } else if (group[0][1] === 'LAYER') {
      layersTuples = group;
    }
  });
  return {
    layers: tableHandler(layersTuples, 'LAYER', layerHandler),
    styles: tableHandler(stylesTuples, 'STYLE', styleHandler)
  };
};

exports["default"] = _default;
},{"../util/logger":36}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function get() {
    return _config["default"];
  }
});
Object.defineProperty(exports, "parseString", {
  enumerable: true,
  get: function get() {
    return _parseString["default"];
  }
});
Object.defineProperty(exports, "denormalise", {
  enumerable: true,
  get: function get() {
    return _denormalise["default"];
  }
});
Object.defineProperty(exports, "groupEntitiesByLayer", {
  enumerable: true,
  get: function get() {
    return _groupEntitiesByLayer["default"];
  }
});
Object.defineProperty(exports, "toPolylines", {
  enumerable: true,
  get: function get() {
    return _toPolylines["default"];
  }
});
Object.defineProperty(exports, "toSVG", {
  enumerable: true,
  get: function get() {
    return _toSVG["default"];
  }
});
Object.defineProperty(exports, "colors", {
  enumerable: true,
  get: function get() {
    return _colors["default"];
  }
});
Object.defineProperty(exports, "Helper", {
  enumerable: true,
  get: function get() {
    return _Helper["default"];
  }
});

var _config = _interopRequireDefault(require("./config"));

var _parseString = _interopRequireDefault(require("./parseString"));

var _denormalise = _interopRequireDefault(require("./denormalise"));

var _groupEntitiesByLayer = _interopRequireDefault(require("./groupEntitiesByLayer"));

var _toPolylines = _interopRequireDefault(require("./toPolylines"));

var _toSVG = _interopRequireDefault(require("./toSVG"));

var _colors = _interopRequireDefault(require("./util/colors"));

var _Helper = _interopRequireDefault(require("./Helper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
},{"./Helper":1,"./config":3,"./denormalise":4,"./groupEntitiesByLayer":7,"./parseString":29,"./toPolylines":30,"./toSVG":31,"./util/colors":33}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _header = _interopRequireDefault(require("./handlers/header"));

var _tables = _interopRequireDefault(require("./handlers/tables"));

var _blocks = _interopRequireDefault(require("./handlers/blocks"));

var _entities = _interopRequireDefault(require("./handlers/entities"));

var _logger = _interopRequireDefault(require("./util/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Parse the value into the native representation
var parseValue = function parseValue(type, value) {
  if (type >= 10 && type < 60) {
    return parseFloat(value, 10);
  } else if (type >= 210 && type < 240) {
    return parseFloat(value, 10);
  } else if (type >= 60 && type < 100) {
    return parseInt(value, 10);
  } else {
    return value;
  }
}; // Content lines are alternate lines of type and value


var convertToTypesAndValues = function convertToTypesAndValues(contentLines) {
  var state = 'type';
  var type;
  var typesAndValues = [];

  var _iterator = _createForOfIteratorHelper(contentLines),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;

      if (state === 'type') {
        type = parseInt(line, 10);
        state = 'value';
      } else {
        typesAndValues.push([type, parseValue(type, line)]);
        state = 'type';
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return typesAndValues;
};

var separateSections = function separateSections(tuples) {
  var sectionTuples;
  return tuples.reduce(function (sections, tuple) {
    if (tuple[0] === 0 && tuple[1] === 'SECTION') {
      sectionTuples = [];
    } else if (tuple[0] === 0 && tuple[1] === 'ENDSEC') {
      sections.push(sectionTuples);
      sectionTuples = undefined;
    } else if (sectionTuples !== undefined) {
      sectionTuples.push(tuple);
    }

    return sections;
  }, []);
}; // Each section start with the type tuple, then proceeds
// with the contents of the section


var reduceSection = function reduceSection(acc, section) {
  var sectionType = section[0][1];
  var contentTuples = section.slice(1);

  switch (sectionType) {
    case 'HEADER':
      acc.header = (0, _header["default"])(contentTuples);
      break;

    case 'TABLES':
      acc.tables = (0, _tables["default"])(contentTuples);
      break;

    case 'BLOCKS':
      acc.blocks = (0, _blocks["default"])(contentTuples);
      break;

    case 'ENTITIES':
      acc.entities = (0, _entities["default"])(contentTuples);
      break;

    default:
      _logger["default"].warn("Unsupported section: ".concat(sectionType));

  }

  return acc;
};

var _default = function _default(string) {
  var lines = string.split(/\r\n|\r|\n/g);
  var tuples = convertToTypesAndValues(lines);
  var sections = separateSections(tuples);
  var result = sections.reduce(reduceSection, {
    // Start with empty defaults in the event of empty sections
    header: {},
    blocks: [],
    entities: [],
    tables: {
      layers: {},
      styles: {}
    }
  });
  return result;
};

exports["default"] = _default;
},{"./handlers/blocks":8,"./handlers/entities":9,"./handlers/header":26,"./handlers/tables":27,"./util/logger":36}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vecks = require("vecks");

var _colors = _interopRequireDefault(require("./util/colors"));

var _denormalise = _interopRequireDefault(require("./denormalise"));

var _entityToPolyline = _interopRequireDefault(require("./entityToPolyline"));

var _applyTransforms = _interopRequireDefault(require("./applyTransforms"));

var _logger = _interopRequireDefault(require("./util/logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(parsed) {
  var entities = (0, _denormalise["default"])(parsed);
  var polylines = entities.map(function (entity) {
    var layerTable = parsed.tables.layers[entity.layer];
    var rgb;

    if (layerTable) {
      var colorNumber = 'colorNumber' in entity ? entity.colorNumber : layerTable.colorNumber;
      rgb = _colors["default"][colorNumber];

      if (rgb === undefined) {
        _logger["default"].warn('Color index', colorNumber, 'invalid, defaulting to black');

        rgb = [0, 0, 0];
      }
    } else {
      _logger["default"].warn('no layer table for layer:' + entity.layer);

      rgb = [0, 0, 0];
    }

    return {
      rgb: rgb,
      vertices: (0, _applyTransforms["default"])((0, _entityToPolyline["default"])(entity), entity.transforms)
    };
  });
  var bbox = new _vecks.Box2();
  polylines.forEach(function (polyline) {
    polyline.vertices.forEach(function (vertex) {
      bbox.expandByPoint({
        x: vertex[0],
        y: vertex[1]
      });
    });
  });
  return {
    bbox: bbox,
    polylines: polylines
  };
};

exports["default"] = _default;
},{"./applyTransforms":2,"./denormalise":4,"./entityToPolyline":5,"./util/colors":33,"./util/logger":36,"vecks":158}],31:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.piecewiseToPaths = void 0;

var _vecks = require("vecks");

var _entityToPolyline = _interopRequireDefault(require("./entityToPolyline"));

var _denormalise = _interopRequireDefault(require("./denormalise"));

var _getRGBForEntity = _interopRequireDefault(require("./getRGBForEntity"));

var _logger = _interopRequireDefault(require("./util/logger"));

var _rotate = _interopRequireDefault(require("./util/rotate"));

var _rgbToColorAttribute = _interopRequireDefault(require("./util/rgbToColorAttribute"));

var _toPiecewiseBezier = _interopRequireWildcard(require("./util/toPiecewiseBezier"));

var _transformBoundingBoxAndElement = _interopRequireDefault(require("./util/transformBoundingBoxAndElement"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var addFlipXIfApplicable = function addFlipXIfApplicable(entity, _ref) {
  var bbox = _ref.bbox,
      element = _ref.element;

  if (entity.extrusionZ === -1) {
    return {
      bbox: new _vecks.Box2().expandByPoint({
        x: -bbox.min.x,
        y: bbox.min.y
      }).expandByPoint({
        x: -bbox.max.x,
        y: bbox.max.y
      }),
      element: "<g transform=\"matrix(-1 0 0 1 0 0)\">\n        ".concat(element, "\n      </g>")
    };
  } else {
    return {
      bbox: bbox,
      element: element
    };
  }
};
/**
 * Create a <path /> element. Interpolates curved entities.
 */


var polyline = function polyline(entity) {
  var vertices = (0, _entityToPolyline["default"])(entity);
  var bbox = vertices.reduce(function (acc, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        x = _ref3[0],
        y = _ref3[1];

    return acc.expandByPoint({
      x: x,
      y: y
    });
  }, new _vecks.Box2());
  var d = vertices.reduce(function (acc, point, i) {
    acc += i === 0 ? 'M' : 'L';
    acc += point[0] + ',' + point[1];
    return acc;
  }, ''); // Empirically it appears that flipping horzontally does not apply to polyline

  return (0, _transformBoundingBoxAndElement["default"])(bbox, "<path d=\"".concat(d, "\" />"), entity.transforms);
};
/**
 * Create a <circle /> element for the CIRCLE entity.
 */


var circle = function circle(entity) {
  var bbox0 = new _vecks.Box2().expandByPoint({
    x: entity.x + entity.r,
    y: entity.y + entity.r
  }).expandByPoint({
    x: entity.x - entity.r,
    y: entity.y - entity.r
  });
  var element0 = "<circle cx=\"".concat(entity.x, "\" cy=\"").concat(entity.y, "\" r=\"").concat(entity.r, "\" />");

  var _addFlipXIfApplicable = addFlipXIfApplicable(entity, {
    bbox: bbox0,
    element: element0
  }),
      bbox = _addFlipXIfApplicable.bbox,
      element = _addFlipXIfApplicable.element;

  return (0, _transformBoundingBoxAndElement["default"])(bbox, element, entity.transforms);
};
/**
 * Create a a <path d="A..." /> or <ellipse /> element for the ARC or ELLIPSE
 * DXF entity (<ellipse /> if start and end point are the same).
 */


var ellipseOrArc = function ellipseOrArc(cx, cy, majorX, majorY, axisRatio, startAngle, endAngle, flipX) {
  var rx = Math.sqrt(majorX * majorX + majorY * majorY);
  var ry = axisRatio * rx;
  var rotationAngle = -Math.atan2(-majorY, majorX);
  var bbox = bboxEllipseOrArc(cx, cy, majorX, majorY, axisRatio, startAngle, endAngle, flipX);

  if (Math.abs(startAngle - endAngle) < 1e-9 || Math.abs(startAngle - endAngle + Math.PI * 2) < 1e-9) {
    // Use a native <ellipse> when start and end angles are the same, and
    // arc paths with same start and end points don't render (at least on Safari)
    var element = "<g transform=\"rotate(".concat(rotationAngle / Math.PI * 180, " ").concat(cx, ", ").concat(cy, ")\">\n      <ellipse cx=\"").concat(cx, "\" cy=\"").concat(cy, "\" rx=\"").concat(rx, "\" ry=\"").concat(ry, "\" />\n    </g>");
    return {
      bbox: bbox,
      element: element
    };
  } else {
    var startOffset = (0, _rotate["default"])({
      x: Math.cos(startAngle) * rx,
      y: Math.sin(startAngle) * ry
    }, rotationAngle);
    var startPoint = {
      x: cx + startOffset.x,
      y: cy + startOffset.y
    };
    var endOffset = (0, _rotate["default"])({
      x: Math.cos(endAngle) * rx,
      y: Math.sin(endAngle) * ry
    }, rotationAngle);
    var endPoint = {
      x: cx + endOffset.x,
      y: cy + endOffset.y
    };
    var adjustedEndAngle = endAngle < startAngle ? endAngle + Math.PI * 2 : endAngle;
    var largeArcFlag = adjustedEndAngle - startAngle < Math.PI ? 0 : 1;
    var d = "M ".concat(startPoint.x, " ").concat(startPoint.y, " A ").concat(rx, " ").concat(ry, " ").concat(rotationAngle / Math.PI * 180, " ").concat(largeArcFlag, " 1 ").concat(endPoint.x, " ").concat(endPoint.y);

    var _element = "<path d=\"".concat(d, "\" />");

    return {
      bbox: bbox,
      element: _element
    };
  }
};
/**
 * Compute the bounding box of an elliptical arc, given the DXF entity parameters
 */


var bboxEllipseOrArc = function bboxEllipseOrArc(cx, cy, majorX, majorY, axisRatio, startAngle, endAngle, flipX) {
  // The bounding box will be defined by the starting point of the ellipse, and ending point,
  // and any extrema on the ellipse that are between startAngle and endAngle.
  // The extrema are found by setting either the x or y component of the ellipse's
  // tangent vector to zero and solving for the angle.
  // Ensure start and end angles are > 0 and well-ordered
  while (startAngle < 0) {
    startAngle += Math.PI * 2;
  }

  while (endAngle <= startAngle) {
    endAngle += Math.PI * 2;
  } // When rotated, the extrema of the ellipse will be found at these angles


  var angles = [];

  if (Math.abs(majorX) < 1e-12 || Math.abs(majorY) < 1e-12) {
    // Special case for majorX or majorY = 0
    for (var i = 0; i < 4; i++) {
      angles.push(i / 2 * Math.PI);
    }
  } else {
    // reference https://github.com/bjnortier/dxf/issues/47#issuecomment-545915042
    angles[0] = Math.atan(-majorY * axisRatio / majorX) - Math.PI; // Ensure angles < 0

    angles[1] = Math.atan(majorX * axisRatio / majorY) - Math.PI;
    angles[2] = angles[0] - Math.PI;
    angles[3] = angles[1] - Math.PI;
  } // Remove angles not falling between start and end


  for (var _i2 = 4; _i2 >= 0; _i2--) {
    while (angles[_i2] < startAngle) {
      angles[_i2] += Math.PI * 2;
    }

    if (angles[_i2] > endAngle) {
      angles.splice(_i2, 1);
    }
  } // Also to consider are the starting and ending points:


  angles.push(startAngle);
  angles.push(endAngle); // Compute points lying on the unit circle at these angles

  var pts = angles.map(function (a) {
    return {
      x: Math.cos(a),
      y: Math.sin(a)
    };
  }); // Transformation matrix, formed by the major and minor axes

  var M = [[majorX, -majorY * axisRatio], [majorY, majorX * axisRatio]]; // Rotate, scale, and translate points

  var rotatedPts = pts.map(function (p) {
    return {
      x: p.x * M[0][0] + p.y * M[0][1] + cx,
      y: p.x * M[1][0] + p.y * M[1][1] + cy
    };
  }); // Compute extents of bounding box

  var bbox = rotatedPts.reduce(function (acc, p) {
    acc.expandByPoint(p);
    return acc;
  }, new _vecks.Box2());
  return bbox;
};
/**
 * An ELLIPSE is defined by the major axis, convert to X and Y radius with
 * a rotation angle
 */


var ellipse = function ellipse(entity) {
  var _ellipseOrArc = ellipseOrArc(entity.x, entity.y, entity.majorX, entity.majorY, entity.axisRatio, entity.startAngle, entity.endAngle),
      bbox0 = _ellipseOrArc.bbox,
      element0 = _ellipseOrArc.element;

  var _addFlipXIfApplicable2 = addFlipXIfApplicable(entity, {
    bbox: bbox0,
    element: element0
  }),
      bbox = _addFlipXIfApplicable2.bbox,
      element = _addFlipXIfApplicable2.element;

  return (0, _transformBoundingBoxAndElement["default"])(bbox, element, entity.transforms);
};
/**
 * An ARC is an ellipse with equal radii
 */


var arc = function arc(entity) {
  var _ellipseOrArc2 = ellipseOrArc(entity.x, entity.y, entity.r, 0, 1, entity.startAngle, entity.endAngle, entity.extrusionZ === -1),
      bbox0 = _ellipseOrArc2.bbox,
      element0 = _ellipseOrArc2.element;

  var _addFlipXIfApplicable3 = addFlipXIfApplicable(entity, {
    bbox: bbox0,
    element: element0
  }),
      bbox = _addFlipXIfApplicable3.bbox,
      element = _addFlipXIfApplicable3.element;

  return (0, _transformBoundingBoxAndElement["default"])(bbox, element, entity.transforms);
};

var piecewiseToPaths = function piecewiseToPaths(k, knots, controlPoints) {
  var paths = [];
  var controlPointIndex = 0;
  var knotIndex = k;

  while (knotIndex < knots.length - k + 1) {
    var m = (0, _toPiecewiseBezier.multiplicity)(knots, knotIndex);
    var cp = controlPoints.slice(controlPointIndex, controlPointIndex + k);

    if (k === 4) {
      paths.push("<path d=\"M ".concat(cp[0].x, " ").concat(cp[0].y, " C ").concat(cp[1].x, " ").concat(cp[1].y, " ").concat(cp[2].x, " ").concat(cp[2].y, " ").concat(cp[3].x, " ").concat(cp[3].y, "\" />"));
    } else if (k === 3) {
      paths.push("<path d=\"M ".concat(cp[0].x, " ").concat(cp[0].y, " Q ").concat(cp[1].x, " ").concat(cp[1].y, " ").concat(cp[2].x, " ").concat(cp[2].y, "\" />"));
    }

    controlPointIndex += m;
    knotIndex += m;
  }

  return paths;
};

exports.piecewiseToPaths = piecewiseToPaths;

var bezier = function bezier(entity) {
  var bbox = new _vecks.Box2();
  entity.controlPoints.forEach(function (p) {
    bbox = bbox.expandByPoint(p);
  });
  var k = entity.degree + 1;
  var piecewise = (0, _toPiecewiseBezier["default"])(k, entity.controlPoints, entity.knots);
  var paths = piecewiseToPaths(k, piecewise.knots, piecewise.controlPoints);
  var element = "<g>".concat(paths.join(''), "</g>");
  return (0, _transformBoundingBoxAndElement["default"])(bbox, element, entity.transforms);
};
/**
 * Switcth the appropriate function on entity type. CIRCLE, ARC and ELLIPSE
 * produce native SVG elements, the rest produce interpolated polylines.
 */


var entityToBoundsAndElement = function entityToBoundsAndElement(entity) {
  switch (entity.type) {
    case 'CIRCLE':
      return circle(entity);

    case 'ELLIPSE':
      return ellipse(entity);

    case 'ARC':
      return arc(entity);

    case 'SPLINE':
      {
        var hasWeights = entity.weights && entity.weights.some(function (w) {
          return w !== 1;
        });

        if ((entity.degree === 2 || entity.degree === 3) && !hasWeights) {
          try {
            return bezier(entity);
          } catch (err) {
            return polyline(entity);
          }
        } else {
          return polyline(entity);
        }
      }

    case 'LINE':
    case 'LWPOLYLINE':
    case 'POLYLINE':
      {
        return polyline(entity);
      }

    default:
      _logger["default"].warn('entity type not supported in SVG rendering:', entity.type);

      return null;
  }
};

var _default = function _default(parsed) {
  var entities = (0, _denormalise["default"])(parsed);

  var _entities$reduce = entities.reduce(function (acc, entity, i) {
    var rgb = (0, _getRGBForEntity["default"])(parsed.tables.layers, entity);
    var boundsAndElement = entityToBoundsAndElement(entity); // Ignore entities like MTEXT that don't produce SVG elements

    if (boundsAndElement) {
      var _bbox = boundsAndElement.bbox,
          element = boundsAndElement.element; // Ignore invalid bounding boxes

      if (_bbox.valid) {
        acc.bbox.expandByPoint(_bbox.min);
        acc.bbox.expandByPoint(_bbox.max);
      }

      acc.elements.push("<g stroke=\"".concat((0, _rgbToColorAttribute["default"])(rgb), "\">").concat(element, "</g>"));
    }

    return acc;
  }, {
    bbox: new _vecks.Box2(),
    elements: []
  }),
      bbox = _entities$reduce.bbox,
      elements = _entities$reduce.elements;

  var viewBox = bbox.valid ? {
    x: bbox.min.x,
    y: -bbox.max.y,
    width: bbox.max.x - bbox.min.x,
    height: bbox.max.y - bbox.min.y
  } : {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  return "<?xml version=\"1.0\"?>\n<svg\n  xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\"\n  preserveAspectRatio=\"xMinYMin meet\"\n  viewBox=\"".concat(viewBox.x, " ").concat(viewBox.y, " ").concat(viewBox.width, " ").concat(viewBox.height, "\"\n  width=\"100%\" height=\"100%\"\n>\n  <g stroke=\"#000000\" stroke-width=\"0.1%\" fill=\"none\" transform=\"matrix(1,0,0,-1,0,0)\">\n    ").concat(elements.join('\n'), "\n  </g>\n</svg>");
};

exports["default"] = _default;
},{"./denormalise":4,"./entityToPolyline":5,"./getRGBForEntity":6,"./util/logger":36,"./util/rgbToColorAttribute":37,"./util/rotate":38,"./util/toPiecewiseBezier":40,"./util/transformBoundingBoxAndElement":41,"vecks":158}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _round = _interopRequireDefault(require("./round10"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Copied and ported to code standard as the b-spline library is not maintained any longer.
 * Source:
 * https://github.com/thibauts/b-spline
 * Copyright (c) 2015 Thibaut Séguy <thibaut.seguy@gmail.com>
 */
var _default = function _default(t, degree, points, knots, weights) {
  var n = points.length; // points count

  var d = points[0].length; // point dimensionality

  if (t < 0 || t > 1) {
    throw new Error('t out of bounds [0,1]: ' + t);
  }

  if (degree < 1) throw new Error('degree must be at least 1 (linear)');
  if (degree > n - 1) throw new Error('degree must be less than or equal to point count - 1');

  if (!weights) {
    // build weight vector of length [n]
    weights = [];

    for (var i = 0; i < n; i++) {
      weights[i] = 1;
    }
  }

  if (!knots) {
    // build knot vector of length [n + degree + 1]
    knots = [];

    for (var _i = 0; _i < n + degree + 1; _i++) {
      knots[_i] = _i;
    }
  } else {
    if (knots.length !== n + degree + 1) throw new Error('bad knot vector length');
  }

  var domain = [degree, knots.length - 1 - degree]; // remap t to the domain where the spline is defined

  var low = knots[domain[0]];
  var high = knots[domain[1]];
  t = t * (high - low) + low; // Clamp to the upper &  lower bounds instead of
  // throwing an error like in the original lib
  // https://github.com/bjnortier/dxf/issues/28

  t = Math.max(t, low);
  t = Math.min(t, high); // find s (the spline segment) for the [t] value provided

  var s;

  for (s = domain[0]; s < domain[1]; s++) {
    if (t >= knots[s] && t <= knots[s + 1]) {
      break;
    }
  } // convert points to homogeneous coordinates


  var v = [];

  for (var _i2 = 0; _i2 < n; _i2++) {
    v[_i2] = [];

    for (var j = 0; j < d; j++) {
      v[_i2][j] = points[_i2][j] * weights[_i2];
    }

    v[_i2][d] = weights[_i2];
  } // l (level) goes from 1 to the curve degree + 1


  var alpha;

  for (var l = 1; l <= degree + 1; l++) {
    // build level l of the pyramid
    for (var _i3 = s; _i3 > s - degree - 1 + l; _i3--) {
      alpha = (t - knots[_i3]) / (knots[_i3 + degree + 1 - l] - knots[_i3]); // interpolate each component

      for (var _j = 0; _j < d + 1; _j++) {
        v[_i3][_j] = (1 - alpha) * v[_i3 - 1][_j] + alpha * v[_i3][_j];
      }
    }
  } // convert back to cartesian and return


  var result = [];

  for (var _i4 = 0; _i4 < d; _i4++) {
    result[_i4] = (0, _round["default"])(v[s][_i4] / v[s][d], -9);
  }

  return result;
};

exports["default"] = _default;
},{"./round10":39}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = [[0, 0, 0], [255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 255, 255], [65, 65, 65], [128, 128, 128], [255, 0, 0], [255, 170, 170], [189, 0, 0], [189, 126, 126], [129, 0, 0], [129, 86, 86], [104, 0, 0], [104, 69, 69], [79, 0, 0], [79, 53, 53], [255, 63, 0], [255, 191, 170], [189, 46, 0], [189, 141, 126], [129, 31, 0], [129, 96, 86], [104, 25, 0], [104, 78, 69], [79, 19, 0], [79, 59, 53], [255, 127, 0], [255, 212, 170], [189, 94, 0], [189, 157, 126], [129, 64, 0], [129, 107, 86], [104, 52, 0], [104, 86, 69], [79, 39, 0], [79, 66, 53], [255, 191, 0], [255, 234, 170], [189, 141, 0], [189, 173, 126], [129, 96, 0], [129, 118, 86], [104, 78, 0], [104, 95, 69], [79, 59, 0], [79, 73, 53], [255, 255, 0], [255, 255, 170], [189, 189, 0], [189, 189, 126], [129, 129, 0], [129, 129, 86], [104, 104, 0], [104, 104, 69], [79, 79, 0], [79, 79, 53], [191, 255, 0], [234, 255, 170], [141, 189, 0], [173, 189, 126], [96, 129, 0], [118, 129, 86], [78, 104, 0], [95, 104, 69], [59, 79, 0], [73, 79, 53], [127, 255, 0], [212, 255, 170], [94, 189, 0], [157, 189, 126], [64, 129, 0], [107, 129, 86], [52, 104, 0], [86, 104, 69], [39, 79, 0], [66, 79, 53], [63, 255, 0], [191, 255, 170], [46, 189, 0], [141, 189, 126], [31, 129, 0], [96, 129, 86], [25, 104, 0], [78, 104, 69], [19, 79, 0], [59, 79, 53], [0, 255, 0], [170, 255, 170], [0, 189, 0], [126, 189, 126], [0, 129, 0], [86, 129, 86], [0, 104, 0], [69, 104, 69], [0, 79, 0], [53, 79, 53], [0, 255, 63], [170, 255, 191], [0, 189, 46], [126, 189, 141], [0, 129, 31], [86, 129, 96], [0, 104, 25], [69, 104, 78], [0, 79, 19], [53, 79, 59], [0, 255, 127], [170, 255, 212], [0, 189, 94], [126, 189, 157], [0, 129, 64], [86, 129, 107], [0, 104, 52], [69, 104, 86], [0, 79, 39], [53, 79, 66], [0, 255, 191], [170, 255, 234], [0, 189, 141], [126, 189, 173], [0, 129, 96], [86, 129, 118], [0, 104, 78], [69, 104, 95], [0, 79, 59], [53, 79, 73], [0, 255, 255], [170, 255, 255], [0, 189, 189], [126, 189, 189], [0, 129, 129], [86, 129, 129], [0, 104, 104], [69, 104, 104], [0, 79, 79], [53, 79, 79], [0, 191, 255], [170, 234, 255], [0, 141, 189], [126, 173, 189], [0, 96, 129], [86, 118, 129], [0, 78, 104], [69, 95, 104], [0, 59, 79], [53, 73, 79], [0, 127, 255], [170, 212, 255], [0, 94, 189], [126, 157, 189], [0, 64, 129], [86, 107, 129], [0, 52, 104], [69, 86, 104], [0, 39, 79], [53, 66, 79], [0, 63, 255], [170, 191, 255], [0, 46, 189], [126, 141, 189], [0, 31, 129], [86, 96, 129], [0, 25, 104], [69, 78, 104], [0, 19, 79], [53, 59, 79], [0, 0, 255], [170, 170, 255], [0, 0, 189], [126, 126, 189], [0, 0, 129], [86, 86, 129], [0, 0, 104], [69, 69, 104], [0, 0, 79], [53, 53, 79], [63, 0, 255], [191, 170, 255], [46, 0, 189], [141, 126, 189], [31, 0, 129], [96, 86, 129], [25, 0, 104], [78, 69, 104], [19, 0, 79], [59, 53, 79], [127, 0, 255], [212, 170, 255], [94, 0, 189], [157, 126, 189], [64, 0, 129], [107, 86, 129], [52, 0, 104], [86, 69, 104], [39, 0, 79], [66, 53, 79], [191, 0, 255], [234, 170, 255], [141, 0, 189], [173, 126, 189], [96, 0, 129], [118, 86, 129], [78, 0, 104], [95, 69, 104], [59, 0, 79], [73, 53, 79], [255, 0, 255], [255, 170, 255], [189, 0, 189], [189, 126, 189], [129, 0, 129], [129, 86, 129], [104, 0, 104], [104, 69, 104], [79, 0, 79], [79, 53, 79], [255, 0, 191], [255, 170, 234], [189, 0, 141], [189, 126, 173], [129, 0, 96], [129, 86, 118], [104, 0, 78], [104, 69, 95], [79, 0, 59], [79, 53, 73], [255, 0, 127], [255, 170, 212], [189, 0, 94], [189, 126, 157], [129, 0, 64], [129, 86, 107], [104, 0, 52], [104, 69, 86], [79, 0, 39], [79, 53, 66], [255, 0, 63], [255, 170, 191], [189, 0, 46], [189, 126, 141], [129, 0, 31], [129, 86, 96], [104, 0, 25], [104, 69, 78], [79, 0, 19], [79, 53, 59], [51, 51, 51], [80, 80, 80], [105, 105, 105], [130, 130, 130], [190, 190, 190], [255, 255, 255]];
exports["default"] = _default;
},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vecks = require("vecks");

/**
 * Create the arcs point for a LWPOLYLINE. The start and end are excluded
 *
 * See diagram.png in this directory for description of points and angles used.
 */
var _default = function _default(from, to, bulge, resolution) {
  // Resolution in degrees
  if (!resolution) {
    resolution = 5;
  } // If the bulge is < 0, the arc goes clockwise. So we simply
  // reverse a and b and invert sign
  // Bulge = tan(theta/4)


  var theta;
  var a;
  var b;

  if (bulge < 0) {
    theta = Math.atan(-bulge) * 4;
    a = new _vecks.V2(from[0], from[1]);
    b = new _vecks.V2(to[0], to[1]);
  } else {
    // Default is counter-clockwise
    theta = Math.atan(bulge) * 4;
    a = new _vecks.V2(to[0], to[1]);
    b = new _vecks.V2(from[0], from[1]);
  }

  var ab = b.sub(a);
  var lengthAB = ab.length();
  var c = a.add(ab.multiply(0.5)); // Distance from center of arc to line between form and to points

  var lengthCD = Math.abs(lengthAB / 2 / Math.tan(theta / 2));
  var normAB = ab.norm();
  var d;

  if (theta < Math.PI) {
    var normDC = new _vecks.V2(normAB.x * Math.cos(Math.PI / 2) - normAB.y * Math.sin(Math.PI / 2), normAB.y * Math.cos(Math.PI / 2) + normAB.x * Math.sin(Math.PI / 2)); // D is the center of the arc

    d = c.add(normDC.multiply(-lengthCD));
  } else {
    var normCD = new _vecks.V2(normAB.x * Math.cos(Math.PI / 2) - normAB.y * Math.sin(Math.PI / 2), normAB.y * Math.cos(Math.PI / 2) + normAB.x * Math.sin(Math.PI / 2)); // D is the center of the arc

    d = c.add(normCD.multiply(lengthCD));
  } // Add points between start start and eng angle relative
  // to the center point


  var startAngle = Math.atan2(b.y - d.y, b.x - d.x) / Math.PI * 180;
  var endAngle = Math.atan2(a.y - d.y, a.x - d.x) / Math.PI * 180;

  if (endAngle < startAngle) {
    endAngle += 360;
  }

  var r = b.sub(d).length();
  var startInter = Math.floor(startAngle / resolution) * resolution + resolution;
  var endInter = Math.ceil(endAngle / resolution) * resolution - resolution;
  var points = [];

  for (var i = startInter; i <= endInter; i += resolution) {
    points.push(d.add(new _vecks.V2(Math.cos(i / 180 * Math.PI) * r, Math.sin(i / 180 * Math.PI) * r)));
  } // Maintain the right ordering to join the from and to points


  if (bulge < 0) {
    points.reverse();
  }

  return points.map(function (p) {
    return [p.x, p.y];
  });
};

exports["default"] = _default;
},{"vecks":158}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Knot insertion is known as "Boehm's algorithm"
 *
 * https://math.stackexchange.com/questions/417859/convert-a-b-spline-into-bezier-curves
 * code adapted from http://preserve.mactech.com/articles/develop/issue_25/schneider.html
 */
var _default = function _default(k, controlPoints, knots, newKnot) {
  var x = knots;
  var b = controlPoints;
  var n = controlPoints.length;
  var i = 0;
  var foundIndex = false;

  for (var j = 0; j < n + k; j++) {
    if (newKnot > x[j] && newKnot <= x[j + 1]) {
      i = j;
      foundIndex = true;
      break;
    }
  }

  if (!foundIndex) {
    throw new Error('invalid new knot');
  }

  var xHat = [];

  for (var _j = 0; _j < n + k + 1; _j++) {
    if (_j <= i) {
      xHat[_j] = x[_j];
    } else if (_j === i + 1) {
      xHat[_j] = newKnot;
    } else {
      xHat[_j] = x[_j - 1];
    }
  }

  var alpha;
  var bHat = [];

  for (var _j2 = 0; _j2 < n + 1; _j2++) {
    if (_j2 <= i - k + 1) {
      alpha = 1;
    } else if (i - k + 2 <= _j2 && _j2 <= i) {
      if (x[_j2 + k - 1] - x[_j2] === 0) {
        alpha = 0;
      } else {
        alpha = (newKnot - x[_j2]) / (x[_j2 + k - 1] - x[_j2]);
      }
    } else {
      alpha = 0;
    }

    if (alpha === 0) {
      bHat[_j2] = b[_j2 - 1];
    } else if (alpha === 1) {
      bHat[_j2] = b[_j2];
    } else {
      bHat[_j2] = {
        x: (1 - alpha) * b[_j2 - 1].x + alpha * b[_j2].x,
        y: (1 - alpha) * b[_j2 - 1].y + alpha * b[_j2].y
      };
    }
  }

  return {
    controlPoints: bHat,
    knots: xHat
  };
};

exports["default"] = _default;
},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function info() {
  if (_config["default"].verbose) {
    console.info.apply(undefined, arguments);
  }
}

function warn() {
  if (_config["default"].verbose) {
    console.warn.apply(undefined, arguments);
  }
}

function error() {
  console.error.apply(undefined, arguments);
}

var _default = {
  info: info,
  warn: warn,
  error: error
};
exports["default"] = _default;
},{"../config":3}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Convert an RGB array to a CSS string definition.
 * Converts white lines to black as the default.
 */
var _default = function _default(rgb) {
  if (rgb[0] === 255 && rgb[1] === 255 && rgb[2] === 255) {
    return 'rgb(0, 0, 0)';
  } else {
    return "rgb(".concat(rgb[0], ", ").concat(rgb[1], ", ").concat(rgb[2], ")");
  }
};

exports["default"] = _default;
},{}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/**
 * Rotate a points by the given angle.
 *
 * @param points the points
 * @param angle the rotation angle
 */
var _default = function _default(p, angle) {
  return {
    x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
    y: p.y * Math.cos(angle) + p.x * Math.sin(angle)
  };
};

exports["default"] = _default;
},{}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

// This is based on the example code found from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
// Example code on MDN is public domain or CC0 (your preference) or MIT depending when the
// example code was added:
// https://developer.mozilla.org/en-US/docs/MDN/About
var _default = function _default(value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math.round(value);
  }

  value = +value;
  exp = +exp; // If the value is not a number or the exp is not an integer...

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  } // Shift


  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp))); // Shift back

  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
};

exports["default"] = _default;
},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.computeInsertions = exports.multiplicity = exports.checkPinned = void 0;

var _insertKnot = _interopRequireDefault(require("./insertKnot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * For a pinned spline, the knots have to be repeated k times
 * (where k is the order), at both the beginning and the end
 */
var checkPinned = function checkPinned(k, knots) {
  // Pinned at the start
  for (var i = 1; i < k; ++i) {
    if (knots[i] !== knots[0]) {
      throw Error("not pinned. order: ".concat(k, " knots: ").concat(knots));
    }
  } // Pinned at the end


  for (var _i = knots.length - 2; _i > knots.length - k - 1; --_i) {
    if (knots[_i] !== knots[knots.length - 1]) {
      throw Error("not pinned. order: ".concat(k, " knots: ").concat(knots));
    }
  }
};

exports.checkPinned = checkPinned;

var multiplicity = function multiplicity(knots, index) {
  var m = 1;

  for (var i = index + 1; i < knots.length; ++i) {
    if (knots[i] === knots[index]) {
      ++m;
    } else {
      break;
    }
  }

  return m;
};
/**
 * https://saccade.com/writing/graphics/KnotVectors.pdf
 * A quadratic piecewise Bézier knot vector with seven control points
 * will look like this [0 0 0 1 1 2 2 3 3 3]. In general, in a
 * piecewise Bézier knot vector the first k knots are the same,
 * then each subsequent group of k-1 knots is the same,
 * until you get to the end.
 */


exports.multiplicity = multiplicity;

var computeInsertions = function computeInsertions(k, knots) {
  var inserts = [];
  var i = k;

  while (i < knots.length - k) {
    var knot = knots[i];
    var m = multiplicity(knots, i);

    for (var j = 0; j < k - m - 1; ++j) {
      inserts.push(knot);
    }

    i = i + m;
  }

  return inserts;
};

exports.computeInsertions = computeInsertions;

var _default = function _default(k, controlPoints, knots) {
  checkPinned(k, knots);
  var insertions = computeInsertions(k, knots);
  return insertions.reduce(function (acc, tNew) {
    return (0, _insertKnot["default"])(k, acc.controlPoints, acc.knots, tNew);
  }, {
    controlPoints: controlPoints,
    knots: knots
  });
};

exports["default"] = _default;
},{"./insertKnot":35}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vecks = require("vecks");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * Transform the bounding box and the SVG element by the given
 * transforms. The <g> element are created in reverse transform
 * order and the bounding box in the given order.
 */
var _default = function _default(bbox, element, transforms) {
  var transformedElement = '';
  var matrices = transforms.map(function (transform) {
    // Create the transformation matrix
    var tx = transform.x || 0;
    var ty = transform.y || 0;
    var sx = transform.scaleX || 1;
    var sy = transform.scaleY || 1;
    var angle = (transform.rotation || 0) / 180 * Math.PI;
    var cos = Math.cos,
        sin = Math.sin;
    var a, b, c, d, e, f; // In DXF an extrusionZ value of -1 denote a tranform around the Y axis.

    if (transform.extrusionZ === -1) {
      a = -sx * cos(angle);
      b = sx * sin(angle);
      c = sy * sin(angle);
      d = sy * cos(angle);
      e = -tx;
      f = ty;
    } else {
      a = sx * cos(angle);
      b = sx * sin(angle);
      c = -sy * sin(angle);
      d = sy * cos(angle);
      e = tx;
      f = ty;
    }

    return [a, b, c, d, e, f];
  }); // Only transform the bounding box is it is valid (i.e. not Infinity)

  var transformedBBox = new _vecks.Box2();

  if (bbox.valid) {
    var bboxPoints = [{
      x: bbox.min.x,
      y: bbox.min.y
    }, {
      x: bbox.max.x,
      y: bbox.min.y
    }, {
      x: bbox.max.x,
      y: bbox.max.y
    }, {
      x: bbox.min.x,
      y: bbox.max.y
    }];
    matrices.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 6),
          a = _ref2[0],
          b = _ref2[1],
          c = _ref2[2],
          d = _ref2[3],
          e = _ref2[4],
          f = _ref2[5];

      bboxPoints = bboxPoints.map(function (point) {
        return {
          x: point.x * a + point.y * c + e,
          y: point.x * b + point.y * d + f
        };
      });
    });
    transformedBBox = bboxPoints.reduce(function (acc, point) {
      return acc.expandByPoint(point);
    }, new _vecks.Box2());
  }

  matrices.reverse();
  matrices.forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 6),
        a = _ref4[0],
        b = _ref4[1],
        c = _ref4[2],
        d = _ref4[3],
        e = _ref4[4],
        f = _ref4[5];

    transformedElement += "<g transform=\"matrix(".concat(a, " ").concat(b, " ").concat(c, " ").concat(d, " ").concat(e, " ").concat(f, ")\">");
  });
  transformedElement += element;
  matrices.forEach(function (transform) {
    transformedElement += '</g>';
  });
  return {
    bbox: transformedBBox,
    element: transformedElement
  };
};

exports["default"] = _default;
},{"vecks":158}],42:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":91,"./_root":126}],43:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":98,"./_hashDelete":99,"./_hashGet":100,"./_hashHas":101,"./_hashSet":102}],44:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":110,"./_listCacheDelete":111,"./_listCacheGet":112,"./_listCacheHas":113,"./_listCacheSet":114}],45:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":91,"./_root":126}],46:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":115,"./_mapCacheDelete":116,"./_mapCacheGet":117,"./_mapCacheHas":118,"./_mapCacheSet":119}],47:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":91,"./_root":126}],48:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":91,"./_root":126}],49:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":44,"./_stackClear":127,"./_stackDelete":128,"./_stackGet":129,"./_stackHas":130,"./_stackSet":131}],50:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":126}],51:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":126}],52:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":91,"./_root":126}],53:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],54:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],55:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":73,"./_isIndex":106,"./isArguments":135,"./isArray":136,"./isBuffer":138,"./isTypedArray":145}],56:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],57:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":61,"./eq":134}],58:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":134}],59:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":82,"./keys":146}],60:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

},{"./_copyObject":82,"./keysIn":147}],61:[function(require,module,exports){
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":86}],62:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isMap = require('./isMap'),
    isObject = require('./isObject'),
    isSet = require('./isSet'),
    keys = require('./keys'),
    keysIn = require('./keysIn');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":49,"./_arrayEach":53,"./_assignValue":57,"./_baseAssign":59,"./_baseAssignIn":60,"./_cloneBuffer":76,"./_copyArray":81,"./_copySymbols":83,"./_copySymbolsIn":84,"./_getAllKeys":88,"./_getAllKeysIn":89,"./_getTag":96,"./_initCloneArray":103,"./_initCloneByTag":104,"./_initCloneObject":105,"./isArray":136,"./isBuffer":138,"./isMap":141,"./isObject":142,"./isSet":144,"./keys":146,"./keysIn":147}],63:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;

},{"./isObject":142}],64:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":56,"./isArray":136}],65:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":50,"./_getRawTag":93,"./_objectToString":124}],66:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":65,"./isObjectLike":143}],67:[function(require,module,exports){
var getTag = require('./_getTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;

},{"./_getTag":96,"./isObjectLike":143}],68:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":108,"./_toSource":132,"./isFunction":139,"./isObject":142}],69:[function(require,module,exports){
var getTag = require('./_getTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;

},{"./_getTag":96,"./isObjectLike":143}],70:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":65,"./isLength":140,"./isObjectLike":143}],71:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":109,"./_nativeKeys":121}],72:[function(require,module,exports){
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;

},{"./_isPrototype":109,"./_nativeKeysIn":122,"./isObject":142}],73:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],74:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],75:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":51}],76:[function(require,module,exports){
var root = require('./_root');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{"./_root":126}],77:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":75}],78:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],79:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":50}],80:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":75}],81:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],82:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":57,"./_baseAssignValue":61}],83:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":82,"./_getSymbols":94}],84:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

},{"./_copyObject":82,"./_getSymbolsIn":95}],85:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":126}],86:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":91}],87:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],88:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":64,"./_getSymbols":94,"./keys":146}],89:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

},{"./_baseGetAllKeys":64,"./_getSymbolsIn":95,"./keysIn":147}],90:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":107}],91:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":68,"./_getValue":97}],92:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":125}],93:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":50}],94:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":54,"./stubArray":148}],95:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;

},{"./_arrayPush":56,"./_getPrototype":92,"./_getSymbols":94,"./stubArray":148}],96:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":42,"./_Map":45,"./_Promise":47,"./_Set":48,"./_WeakMap":52,"./_baseGetTag":65,"./_toSource":132}],97:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],98:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":120}],99:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],100:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":120}],101:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":120}],102:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":120}],103:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],104:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":75,"./_cloneDataView":77,"./_cloneRegExp":78,"./_cloneSymbol":79,"./_cloneTypedArray":80}],105:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":63,"./_getPrototype":92,"./_isPrototype":109}],106:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],107:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],108:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":85}],109:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],110:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],111:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":58}],112:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":58}],113:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":58}],114:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":58}],115:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":43,"./_ListCache":44,"./_Map":45}],116:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":90}],117:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":90}],118:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":90}],119:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":90}],120:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":91}],121:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":125}],122:[function(require,module,exports){
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;

},{}],123:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":87}],124:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],125:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],126:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":87}],127:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":44}],128:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],129:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],130:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],131:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":44,"./_Map":45,"./_MapCache":46}],132:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],133:[function(require,module,exports){
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;

},{"./_baseClone":62}],134:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],135:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":66,"./isObjectLike":143}],136:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],137:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":139,"./isLength":140}],138:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":126,"./stubFalse":149}],139:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":65,"./isObject":142}],140:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],141:[function(require,module,exports){
var baseIsMap = require('./_baseIsMap'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;

},{"./_baseIsMap":67,"./_baseUnary":74,"./_nodeUtil":123}],142:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],143:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],144:[function(require,module,exports){
var baseIsSet = require('./_baseIsSet'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;

},{"./_baseIsSet":69,"./_baseUnary":74,"./_nodeUtil":123}],145:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":70,"./_baseUnary":74,"./_nodeUtil":123}],146:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":55,"./_baseKeys":71,"./isArrayLike":137}],147:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

},{"./_arrayLikeKeys":55,"./_baseKeysIn":72,"./isArrayLike":137}],148:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],149:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],150:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _V = _interopRequireDefault(require("./V2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Box2 = /*#__PURE__*/function () {
  function Box2(min, max) {
    _classCallCheck(this, Box2);

    if (_typeof(min) === 'object' && _typeof(max) === 'object' && min.x !== undefined && min.y !== undefined && max.x !== undefined && max.y !== undefined) {
      this.min = new _V["default"](min);
      this.max = new _V["default"](max);
      this.valid = true;
    } else if (min === undefined && max === undefined) {
      this.min = new _V["default"](Infinity, Infinity);
      this.max = new _V["default"](-Infinity, -Infinity);
      this.valid = false;
    } else {
      throw Error('Illegal construction - must use { x, y } objects');
    }
  }

  _createClass(Box2, [{
    key: "equals",
    value: function equals(other) {
      if (!this.valid) {
        throw Error('Box2 is invalid');
      }

      return this.min.equals(other.min) && this.max.equals(other.max);
    }
  }, {
    key: "expandByPoint",
    value: function expandByPoint(p) {
      this.min = new _V["default"](Math.min(this.min.x, p.x), Math.min(this.min.y, p.y));
      this.max = new _V["default"](Math.max(this.max.x, p.x), Math.max(this.max.y, p.y));
      this.valid = true;
      return this;
    }
  }, {
    key: "expandByPoints",
    value: function expandByPoints(points) {
      var _this = this;

      points.forEach(function (point) {
        _this.expandByPoint(point);
      }, this);
      return this;
    }
  }, {
    key: "isPointInside",
    value: function isPointInside(p) {
      return p.x >= this.min.x && p.y >= this.min.y && p.x <= this.max.x && p.y <= this.max.y;
    }
  }, {
    key: "width",
    get: function get() {
      if (!this.valid) {
        throw Error('Box2 is invalid');
      }

      return this.max.x - this.min.x;
    }
  }, {
    key: "height",
    get: function get() {
      if (!this.valid) {
        throw Error('Box2 is invalid');
      }

      return this.max.y - this.min.y;
    }
  }]);

  return Box2;
}();

Box2.fromPoints = function (points) {
  return new Box2().expandByPoints(points);
};

var _default = Box2;
exports["default"] = _default;
},{"./V2":156}],151:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _V = _interopRequireDefault(require("./V3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Box3 = /*#__PURE__*/function () {
  function Box3(min, max) {
    _classCallCheck(this, Box3);

    if (_typeof(min) === 'object' && _typeof(max) === 'object' && min.x !== undefined && min.y !== undefined && min.z !== undefined && max.x !== undefined && max.y !== undefined && max.z !== undefined) {
      this.min = new _V["default"](min);
      this.max = new _V["default"](max);
      this.valid = true;
    } else if (min === undefined && max === undefined) {
      this.min = new _V["default"](Infinity, Infinity, Infinity);
      this.max = new _V["default"](-Infinity, -Infinity, -Infinity);
      this.valid = false;
    } else {
      throw Error('Illegal construction - must use { x, y, z } objects');
    }
  }

  _createClass(Box3, [{
    key: "equals",
    value: function equals(other) {
      if (!this.valid) {
        throw Error('Box3 is invalid');
      }

      return this.min.equals(other.min) && this.max.equals(other.max);
    }
  }, {
    key: "expandByPoint",
    value: function expandByPoint(p) {
      this.min = new _V["default"](Math.min(this.min.x, p.x), Math.min(this.min.y, p.y), Math.min(this.min.z, p.z));
      this.max = new _V["default"](Math.max(this.max.x, p.x), Math.max(this.max.y, p.y), Math.max(this.max.z, p.z));
      this.valid = true;
      return this;
    }
  }, {
    key: "expandByPoints",
    value: function expandByPoints(points) {
      var _this = this;

      points.forEach(function (point) {
        _this.expandByPoint(point);
      }, this);
      return this;
    }
  }, {
    key: "isPointInside",
    value: function isPointInside(p) {
      return p.x >= this.min.x && p.y >= this.min.y && p.z >= this.min.z && p.x <= this.max.x && p.y <= this.max.y && p.z <= this.max.z;
    }
  }, {
    key: "width",
    get: function get() {
      if (!this.valid) {
        throw Error('Box3 is invalid');
      }

      return this.max.x - this.min.x;
    }
  }, {
    key: "depth",
    get: function get() {
      if (!this.valid) {
        throw Error('Box3 is invalid');
      }

      return this.max.y - this.min.y;
    }
  }, {
    key: "height",
    get: function get() {
      if (!this.valid) {
        throw Error('Box3 is invalid');
      }

      return this.max.z - this.min.z;
    }
  }]);

  return Box3;
}();

Box3.fromPoints = function (points) {
  return new Box3().expandByPoints(points);
};

var _default = Box3;
exports["default"] = _default;
},{"./V3":157}],152:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _V = _interopRequireDefault(require("./V2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var turn = function turn(p1, p2, p3) {
  var a = p1.x;
  var b = p1.y;
  var c = p2.x;
  var d = p2.y;
  var e = p3.x;
  var f = p3.y;
  var m = (f - b) * (c - a);
  var n = (d - b) * (e - a);
  return m > n + Number.EPSILON ? 1 : m + Number.EPSILON < n ? -1 : 0;
}; // http://stackoverflow.com/a/16725715/35448


var isIntersect = function isIntersect(e1, e2) {
  var p1 = e1.a;
  var p2 = e1.b;
  var p3 = e2.a;
  var p4 = e2.b;
  return turn(p1, p3, p4) !== turn(p2, p3, p4) && turn(p1, p2, p3) !== turn(p1, p2, p4);
};

var _getIntersection = function getIntersection(m, n) {
  // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
  var x1 = m.a.x;
  var x2 = m.b.x;
  var y1 = m.a.y;
  var y2 = m.b.y;
  var x3 = n.a.x;
  var x4 = n.b.x;
  var y3 = n.a.y;
  var y4 = n.b.y;
  var x12 = x1 - x2;
  var x34 = x3 - x4;
  var y12 = y1 - y2;
  var y34 = y3 - y4;
  var c = x12 * y34 - y12 * x34;
  var px = ((x1 * y2 - y1 * x2) * x34 - x12 * (x3 * y4 - y3 * x4)) / c;
  var py = ((x1 * y2 - y1 * x2) * y34 - y12 * (x3 * y4 - y3 * x4)) / c;

  if (isNaN(px) || isNaN(py)) {
    return null;
  } else {
    return new _V["default"](px, py);
  }
};

var dist = function dist(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

var Line2 = /*#__PURE__*/function () {
  function Line2(a, b) {
    _classCallCheck(this, Line2);

    if (_typeof(a) !== 'object' || a.x === undefined || a.y === undefined) {
      throw Error('expected first argument to have x and y properties');
    }

    if (_typeof(b) !== 'object' || b.x === undefined || b.y === undefined) {
      throw Error('expected second argument to have x and y properties');
    }

    this.a = new _V["default"](a);
    this.b = new _V["default"](b);
  }

  _createClass(Line2, [{
    key: "length",
    value: function length() {
      return this.a.sub(this.b).length();
    }
  }, {
    key: "intersects",
    value: function intersects(other) {
      if (!(other instanceof Line2)) {
        throw new Error('expected argument to be an instance of vecks.Line2');
      }

      return isIntersect(this, other);
    }
  }, {
    key: "getIntersection",
    value: function getIntersection(other) {
      if (this.intersects(other)) {
        return _getIntersection(this, other);
      } else {
        return null;
      }
    }
  }, {
    key: "containsPoint",
    value: function containsPoint(point) {
      var eps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-12;
      return Math.abs(dist(this.a, this.b) - dist(point, this.a) - dist(point, this.b)) < eps;
    }
  }]);

  return Line2;
}();

var _default = Line2;
exports["default"] = _default;
},{"./V2":156}],153:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _V = _interopRequireDefault(require("./V3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var dist = function dist(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
};

var Line3 = /*#__PURE__*/function () {
  function Line3(a, b) {
    _classCallCheck(this, Line3);

    if (_typeof(a) !== 'object' || a.x === undefined || a.y === undefined || a.z === undefined) {
      throw Error('expected first argument to have x, y and z properties');
    }

    if (_typeof(b) !== 'object' || b.x === undefined || b.y === undefined || b.y === undefined) {
      throw Error('expected second argument to have x, y and z properties');
    }

    this.a = new _V["default"](a);
    this.b = new _V["default"](b);
  }

  _createClass(Line3, [{
    key: "length",
    value: function length() {
      return this.a.sub(this.b).length();
    }
  }, {
    key: "containsPoint",
    value: function containsPoint(point) {
      var eps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-12;
      return Math.abs(dist(this.a, this.b) - dist(point, this.a) - dist(point, this.b)) < eps;
    }
  }]);

  return Line3;
}();

var _default = Line3;
exports["default"] = _default;
},{"./V3":157}],154:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Plane3 = /*#__PURE__*/function () {
  function Plane3(a, b, c, d) {
    _classCallCheck(this, Plane3);

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  } // Distance to a point
  // http://mathworld.wolfram.com/Point-PlaneDistance.html eq 10


  _createClass(Plane3, [{
    key: "distanceToPoint",
    value: function distanceToPoint(p0) {
      var dd = (this.a * p0.x + this.b * p0.y + this.c * p0.z + this.d) / Math.sqrt(this.a * this.a + this.b * this.b + this.c * this.c);
      return dd;
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return this.a === other.a && this.b === other.b && this.c === other.c && this.d === other.d;
    }
  }, {
    key: "coPlanar",
    value: function coPlanar(other) {
      var coPlanarAndSameNormal = this.a === other.a && this.b === other.b && this.c === other.c && this.d === other.d;
      var coPlanarAndReversedNormal = this.a === -other.a && this.b === -other.b && this.c === -other.c && this.d === -other.d;
      return coPlanarAndSameNormal || coPlanarAndReversedNormal;
    }
  }]);

  return Plane3;
}(); // From point and normal


Plane3.fromPointAndNormal = function (p, n) {
  var a = n.x;
  var b = n.y;
  var c = n.z;
  var d = -(p.x * a + p.y * b + p.z * c);
  return new Plane3(n.x, n.y, n.z, d);
};

Plane3.fromPoints = function (points) {
  var firstCross;

  for (var i = 0, il = points.length; i < il; ++i) {
    var ab = points[(i + 1) % il].sub(points[i]);
    var bc = points[(i + 2) % il].sub(points[(i + 1) % il]);
    var cross = ab.cross(bc);

    if (!(isNaN(cross.length()) || cross.length() === 0)) {
      if (!firstCross) {
        firstCross = cross.norm();
      } else {
        var same = cross.norm().equals(firstCross, 1e-6);
        var opposite = cross.neg().norm().equals(firstCross, 1e-6);

        if (!(same || opposite)) {
          throw Error('points not on a plane');
        }
      }
    }
  }

  if (!firstCross) {
    throw Error('points not on a plane');
  }

  return Plane3.fromPointAndNormal(points[0], firstCross.norm());
};

var _default = Plane3;
exports["default"] = _default;
},{}],155:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _V = _interopRequireDefault(require("./V3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Quaternion implementation heavily adapted from the Quaternion implementation in THREE.js
// https://github.com/mrdoob/three.js/blob/master/src/math/Quaternion.js
var Quaternion = /*#__PURE__*/function () {
  function Quaternion(x, y, z, w) {
    _classCallCheck(this, Quaternion);

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  _createClass(Quaternion, [{
    key: "applyToVec3",
    value: function applyToVec3(v3) {
      var x = v3.x;
      var y = v3.y;
      var z = v3.z;
      var qx = this.x;
      var qy = this.y;
      var qz = this.z;
      var qw = this.w; // calculate quat * vector

      var ix = qw * x + qy * z - qz * y;
      var iy = qw * y + qz * x - qx * z;
      var iz = qw * z + qx * y - qy * x;
      var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

      return new _V["default"](ix * qw + iw * -qx + iy * -qz - iz * -qy, iy * qw + iw * -qy + iz * -qx - ix * -qz, iz * qw + iw * -qz + ix * -qy - iy * -qx);
    }
  }]);

  return Quaternion;
}();

Quaternion.fromAxisAngle = function (axis, angle) {
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
  var axisNorm = axis.norm();
  var halfAngle = angle / 2;
  var s = Math.sin(halfAngle);
  return new Quaternion(axisNorm.x * s, axisNorm.y * s, axisNorm.z * s, Math.cos(halfAngle));
};

var _default = Quaternion;
exports["default"] = _default;
},{"./V3":157}],156:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var V2 = /*#__PURE__*/function () {
  function V2(x, y) {
    _classCallCheck(this, V2);

    if (_typeof(x) === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  _createClass(V2, [{
    key: "equals",
    value: function equals(other) {
      return this.x === other.x && this.y === other.y;
    }
  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.dot(this));
    }
  }, {
    key: "neg",
    value: function neg() {
      return new V2(-this.x, -this.y);
    }
  }, {
    key: "add",
    value: function add(b) {
      return new V2(this.x + b.x, this.y + b.y);
    }
  }, {
    key: "sub",
    value: function sub(b) {
      return new V2(this.x - b.x, this.y - b.y);
    }
  }, {
    key: "multiply",
    value: function multiply(w) {
      return new V2(this.x * w, this.y * w);
    }
  }, {
    key: "norm",
    value: function norm() {
      return this.multiply(1 / this.length());
    }
  }, {
    key: "dot",
    value: function dot(b) {
      return this.x * b.x + this.y * b.y;
    }
  }]);

  return V2;
}();

var _default = V2;
exports["default"] = _default;
},{}],157:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var V3 = /*#__PURE__*/function () {
  function V3(x, y, z) {
    _classCallCheck(this, V3);

    if (_typeof(x) === 'object') {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else if (x === undefined) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }

  _createClass(V3, [{
    key: "equals",
    value: function equals(other, eps) {
      if (eps === undefined) {
        eps = 0;
      }

      return Math.abs(this.x - other.x) <= eps && Math.abs(this.y - other.y) <= eps && Math.abs(this.z - other.z) <= eps;
    }
  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.dot(this));
    }
  }, {
    key: "neg",
    value: function neg() {
      return new V3(-this.x, -this.y, -this.z);
    }
  }, {
    key: "add",
    value: function add(b) {
      return new V3(this.x + b.x, this.y + b.y, this.z + b.z);
    }
  }, {
    key: "sub",
    value: function sub(b) {
      return new V3(this.x - b.x, this.y - b.y, this.z - b.z);
    }
  }, {
    key: "multiply",
    value: function multiply(w) {
      return new V3(this.x * w, this.y * w, this.z * w);
    }
  }, {
    key: "norm",
    value: function norm() {
      return this.multiply(1 / this.length());
    }
  }, {
    key: "dot",
    value: function dot(b) {
      return this.x * b.x + this.y * b.y + this.z * b.z;
    }
  }, {
    key: "cross",
    value: function cross(b) {
      return new V3(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
    }
  }]);

  return V3;
}();

var _default = V3;
exports["default"] = _default;
},{}],158:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "V2", {
  enumerable: true,
  get: function get() {
    return _V["default"];
  }
});
Object.defineProperty(exports, "V3", {
  enumerable: true,
  get: function get() {
    return _V2["default"];
  }
});
Object.defineProperty(exports, "Box2", {
  enumerable: true,
  get: function get() {
    return _Box["default"];
  }
});
Object.defineProperty(exports, "Box3", {
  enumerable: true,
  get: function get() {
    return _Box2["default"];
  }
});
Object.defineProperty(exports, "Plane3", {
  enumerable: true,
  get: function get() {
    return _Plane["default"];
  }
});
Object.defineProperty(exports, "Quaternion", {
  enumerable: true,
  get: function get() {
    return _Quaternion["default"];
  }
});
Object.defineProperty(exports, "Line2", {
  enumerable: true,
  get: function get() {
    return _Line["default"];
  }
});
Object.defineProperty(exports, "Line3", {
  enumerable: true,
  get: function get() {
    return _Line2["default"];
  }
});

var _V = _interopRequireDefault(require("./V2"));

var _V2 = _interopRequireDefault(require("./V3"));

var _Box = _interopRequireDefault(require("./Box2"));

var _Box2 = _interopRequireDefault(require("./Box3"));

var _Plane = _interopRequireDefault(require("./Plane3"));

var _Quaternion = _interopRequireDefault(require("./Quaternion"));

var _Line = _interopRequireDefault(require("./Line2"));

var _Line2 = _interopRequireDefault(require("./Line3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
},{"./Box2":150,"./Box3":151,"./Line2":152,"./Line3":153,"./Plane3":154,"./Quaternion":155,"./V2":156,"./V3":157}]},{},[28])(28)
});
