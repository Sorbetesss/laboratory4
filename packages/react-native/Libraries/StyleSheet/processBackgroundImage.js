/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

'use strict';

import type {ProcessedColorValue} from './processColor';
import type {GradientValue} from './StyleSheetTypes';

const processColor = require('./processColor').default;
const DIRECTION_REGEX =
  /^to\s+(?:top|bottom|left|right)(?:\s+(?:top|bottom|left|right))?/;
const ANGLE_UNIT_REGEX = /^([+-]?\d*\.?\d+)(deg|grad|rad|turn)$/i;

const TO_BOTTOM_START_END_POINTS = {
  start: {x: 0.5, y: 0},
  end: {x: 0.5, y: 1},
};

type ParsedGradientValue = {
  type: 'linearGradient',
  start: {x: number, y: number},
  end: {x: number, y: number},
  colorStops: $ReadOnlyArray<{
    color: ProcessedColorValue,
    position: number,
  }>,
};

export default function processBackgroundImage(
  backgroundImage: ?($ReadOnlyArray<GradientValue> | string),
): $ReadOnlyArray<ParsedGradientValue> {
  let result: $ReadOnlyArray<ParsedGradientValue> = [];
  if (backgroundImage == null) {
    return result;
  }

  if (typeof backgroundImage === 'string') {
    result = parseCSSLinearGradient(backgroundImage);
  } else if (Array.isArray(backgroundImage)) {
    for (const bgImage of backgroundImage) {
      const processedColorStops = [];
      for (const stop of bgImage.colorStops) {
        const processedColor = processColor(stop.color);
        if (processedColor == null) {
          // If a color is invalid, return an empty array and do not apply any gradient. Web works the same way.
          return [];
        } else {
          processedColorStops.push({
            color: processedColor,
            position: stop.position,
          });
        }
      }
      result = result.concat({
        type: 'linearGradient',
        start: bgImage.start,
        end: bgImage.end,
        colorStops: processedColorStops,
      });
    }
  }

  return result;
}

function parseCSSLinearGradient(
  cssString: string,
): $ReadOnlyArray<ParsedGradientValue> {
  const gradients = [];
  let match;
  const linearGradientRegex = /linear-gradient\s*\(((?:\([^)]*\)|[^())])*)\)/gi;

  while ((match = linearGradientRegex.exec(cssString))) {
    const gradientContent = match[1];
    const parts = gradientContent.split(',');
    let points = TO_BOTTOM_START_END_POINTS;
    const trimmedDirection = parts[0].trim().toLowerCase();
    const colorStopRegex =
      /\s*((?:(?:rgba?|hsla?)\s*\([^)]+\))|#[0-9a-fA-F]+|[a-zA-Z]+)(?:\s+([0-9.]+%?))?\s*/gi;

    if (ANGLE_UNIT_REGEX.test(trimmedDirection)) {
      const angle = parseAngle(trimmedDirection);
      if (angle != null) {
        points = calculateStartEndPointsFromAngle(angle);
        parts.shift();
      } else {
        // If an angle is invalid, return an empty array and do not apply any gradient. Same as web.
        return [];
      }
    } else if (DIRECTION_REGEX.test(trimmedDirection)) {
      const parsedPoints =
        calculateStartEndPointsFromDirection(trimmedDirection);
      if (parsedPoints != null) {
        points = parsedPoints;
        parts.shift();
      } else {
        // If a direction is invalid, return an empty array and do not apply any gradient. Same as web.
        return [];
      }
    } else if (!colorStopRegex.test(trimmedDirection)) {
      // If first part is not an angle/direction or a color stop, return an empty array and do not apply any gradient. Same as web.
      return [];
    }
    colorStopRegex.lastIndex = 0;

    const colorStops = [];
    const fullColorStopsStr = parts.join(',');
    let colorStopMatch;
    while ((colorStopMatch = colorStopRegex.exec(fullColorStopsStr))) {
      const [, color, position] = colorStopMatch;
      const processedColor = processColor(color.trim().toLowerCase());
      if (
        processedColor != null &&
        (typeof position === 'undefined' || position.endsWith('%'))
      ) {
        colorStops.push({
          color: processedColor,
          position: position ? parseFloat(position) / 100 : null,
        });
      } else {
        // If a color or position is invalid, return an empty array and do not apply any gradient. Same as web.
        return [];
      }
    }

    gradients.push({
      type: 'linearGradient',
      start: points.start,
      end: points.end,
      colorStops: colorStops.map((stop, index, array) => ({
        color: stop.color,
        position:
          stop.position ??
          (array.length === 1 ? 1 : index / (array.length - 1)),
      })),
    });
  }

  return gradients;
}

function calculateStartEndPointsFromDirection(direction: string): ?{
  start: {x: number, y: number},
  end: {x: number, y: number},
} {
  // Remove extra whitespace
  const normalizedDirection = direction.replace(/\s+/g, ' ');

  switch (normalizedDirection) {
    case 'to right':
      return {
        start: {x: 0, y: 0.5},
        end: {x: 1, y: 0.5},
      };
    case 'to left':
      return {
        start: {x: 1, y: 0.5},
        end: {x: 0, y: 0.5},
      };
    case 'to bottom':
      return TO_BOTTOM_START_END_POINTS;
    case 'to top':
      return {
        start: {x: 0.5, y: 1},
        end: {x: 0.5, y: 0},
      };
    case 'to bottom right':
    case 'to right bottom':
      return {
        start: {x: 0, y: 0},
        end: {x: 1, y: 1},
      };
    case 'to top left':
    case 'to left top':
      return {
        start: {x: 1, y: 1},
        end: {x: 0, y: 0},
      };
    case 'to bottom left':
    case 'to left bottom':
      return {
        start: {x: 1, y: 0},
        end: {x: 0, y: 1},
      };
    case 'to top right':
    case 'to right top':
      return {
        start: {x: 0, y: 1},
        end: {x: 1, y: 0},
      };
    default:
      return null;
  }
}

function calculateStartEndPointsFromAngle(angleRadians: number): {
  start: {x: number, y: number},
  end: {x: number, y: number},
} {
  // Normalize angle to be between 0 and 2π
  let angleRadiansNormalized = angleRadians % (2 * Math.PI);
  if (angleRadiansNormalized < 0) {
    angleRadiansNormalized += 2 * Math.PI;
  }

  const endX = 0.5 + 0.5 * Math.sin(angleRadiansNormalized);
  const endY = 0.5 - 0.5 * Math.cos(angleRadiansNormalized);

  const startX = 1 - endX;
  const startY = 1 - endY;

  return {
    start: {x: startX, y: startY},
    end: {x: endX, y: endY},
  };
}

function parseAngle(angle: string): ?number {
  const match = angle.match(ANGLE_UNIT_REGEX);
  if (!match) {
    return null;
  }

  const [, value, unit] = match;

  const numericValue = parseFloat(value);
  switch (unit) {
    case 'deg':
      return (numericValue * Math.PI) / 180;
    case 'grad':
      return (numericValue * Math.PI) / 200;
    case 'rad':
      return numericValue;
    case 'turn':
      return numericValue * 2 * Math.PI;
    default:
      return null;
  }
}
