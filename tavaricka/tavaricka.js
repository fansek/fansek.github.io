// function createAttribute(name, value) {
//    const result = document.createAttribute(name);
//    result.value = value;
//    return result;
// }

// function createElement(elementName, attributes) {
//    const element = document.createElement(elementName);
//    for (var name in attributes) {
//       if (attributes.hasOwnProperty(name)) {
//          element.setAttributeNode(createAttribute(name, attributes[name]));
//       }
//    }
//    return element;
// }
const canvas = document.getElementById('canvas');

function createElementSvg(elementName, attributes) {
   const element = document.createElementNS('http://www.w3.org/2000/svg', elementName);
   for (var name in attributes) {
      if (attributes.hasOwnProperty(name)) {
         element.setAttribute(name, attributes[name]);
      }
   }
   return element;
}

function mapToDistance(value) {
   return value * 50;
}

function mapToPosition(value) {
   return mapToDistance(value) + 50;
}

function putPoint(x, y, r, name) {
   x = mapToPosition(x);
   y = mapToPosition(y);
   r = mapToDistance(r);
   canvas.appendChild(
      createElementSvg('circle', { cx: x, cy: y, r, fill: 'black' }));
   if (name !== undefined) {
      var text = createElementSvg('text', { x: x + r, y: y + (2 * r), 'font-size': 2 * r });
      text.appendChild(document.createTextNode(name));
      canvas.appendChild(text);
   }
}

function putTree(x, y, r, name) {
   x = mapToPosition(x);
   y = mapToPosition(y);
   r = mapToDistance(r);
   canvas.appendChild(
      createElementSvg('circle', { cx: x, cy: y, r, stroke: 'green', 'stroke-width': r, fill: 'brown' }));
   if (name !== undefined) {
      var text = createElementSvg('text', { x: x + (1.5 * r), y: y + (2 * r), 'font-size': 2 * r });
      text.appendChild(document.createTextNode(name));
      canvas.appendChild(text);
   }
}

function putLabeledLine(x1, y1, d, vertical, label) {
   x1 = mapToPosition(x1);
   y1 = mapToPosition(y1);
   d = mapToDistance(d);
   const x2 = vertical ? x1 : x1 - d;
   const y2 = vertical ? y1 - d : y1;

   canvas.appendChild(
      createElementSvg('line', { x1, y1, x2, y2, stroke: 'black', 'stroke-width': 1 }));

   if (label !== undefined) {
      var text;
      if (vertical) {
         text = createElementSvg('text', { x: x1 + 5, y: (y1 + y2) / 2, 'font-size': 10 });
      } else {
         text = createElementSvg('text', { x: (x1 + x2) / 2, y: y1 + 12, 'font-size': 10, 'text-anchor': 'middle' });
      }
      text.appendChild(document.createTextNode(label));
      canvas.appendChild(text);
   }
}

///////

function toPositions(distances) {
   const positions = {};
   for (var name in distances) {
      if (distances.hasOwnProperty(name)) {
         const value = distances[name];
         computePosition(name, value, 'x', distances, positions);
         computePosition(name, value, 'y', distances, positions);
      }
   }
   return positions;
}

function computePosition(name, value, axis, distances, positions) {
   const otherName = value['d' + axis];
   if (positions[name] !== undefined && positions[name][axis] !== undefined) {
      return positions[name][axis];
   }
   if (otherName === undefined) {
      putPosition(positions, name, axis, value[axis]);
      return value[axis];
   } else {
      const otherValue = distances[otherName];
      if (otherValue !== undefined) {
         const otherPosition = computePosition(otherName, otherValue, axis, distances, positions);
         if (otherPosition !== undefined) {
            const result = value[axis] + otherPosition;
            putPosition(positions, name, axis, result);
            return result;
         }
      }
      return undefined;
   }
}

function putPosition(positions, name, axis, value) {
   if (positions[name] === undefined) {
      positions[name] = {};
   }
   positions[name][axis] = value;
   return positions;
}

var distances = {
   c1: { x: 0, y: 0 },
   c2: { x: 17, y: 0, dx: 'c1', dy: 'c1' },
   c3: { x: 0, y: 55, dx: 'c1', dy: 'c1' },
   c4: { x: 17, y: 55, dx: 'c3', dy: 'c2' },
   g1: { x: -3.8, y: 0, dx: 'g2', dy: 'g2' },
   g2: { x: -5.5, y: 0, dx: 'c2', dy: 'c2' },
   t1: { x: 1.15, y: 1.8, dx: 'g2', dy: 'g2' },
   t2: { x: -0.5, y: 2.9, dx: 't1', dy: 'g2' },
   t3: { x: -4.9, y: 7.5, dx: 'c2', dy: 'g2' },
   t4: { x: 2.6, y: 2, dx: 't3', dy: 't2' },
   t5: { x: 0.6, y: 0, dx: 't4', dy: 't4' },
   t6: { x: -1.5, y: 2.3, dx: 't3', dy: 't3' },
   t7: { x: -2.6, y: 4, dx: 'c2', dy: 't3' },
   t8: { x: -6.2, y: 15.3, dx: 'c2', dy: 'g2' },
   t9: { x: 0, y: 0.6, dx: 't8', dy: 't8' },
   t10: { x: -2.3, y: 4.7, dx: 'c2', dy: 't7' },
   w1: { x: 0, y: 12, dx: 'g1', dy: 'g1' },
   w2: { x: -7.8, y: 17, dx: 'c2', dy: 'w1' },
   t11: { x: 2, y: 0, dx: 'w2', dy: 'w2' },
   t20: { x: -0.2, y: 1.8, dx: 'g1', dy: 'g1' },
   t21: { x: 2.3, y: 0.8, dx: 'c1', dy: 'c1' },
   t22: { x: 3.3, y: 0.8, dx: 'c1', dy: 'c1' },
   t23: { x: 0.2, y: 5, dx: 'c1', dy: 'c1' },
   h1: { x: 3.13, y: -8.15, dx: 'c3', dy: 'c3' },
   h2: { x: 0, y: 5.4, dx: 'h1', dy: 'h1' },
   h3: { x: -1.63, y: 0, dx: 'c4', dy: 'h1' },
   h4: { x: 0, y: 0, dx: 'h3', dy: 'h2' },
   a1: { x: 0, y: 0, dx: 'a3', dy: 'a2' },
   a2: { x: 0, y: -2.93, dx: 'a4', dy: 'a4' },
   a3: { x: -2.95, y: 0, dx: 'a4', dy: 'a4' },
   a4: { x: -1.73, y: -2.7, dx: 'h3', dy: 'h3' },
};

const positions = toPositions(distances);

for (var name in positions) {
   if (positions.hasOwnProperty(name)) {
      const x = positions[name].x;
      const y = positions[name].y;

      const dx = distances[name].x;
      const dy = distances[name].y;

      if (name.charAt(0) === 't') {
         putTree(x, y, 0.2, name);
      } else {
         putPoint(x, y, 0.2, name);
      }
      if (distances[name].dx !== undefined && x !== 0) {
         putLabeledLine(x, y, dx, false, dx);
      }
      if (distances[name].dy !== undefined && y !== 0) {
         putLabeledLine(x, y, dy, true, dy);
      }
   }
}