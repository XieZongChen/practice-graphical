registerLayout(
  'my-grid',
  class {
    static get inputProperties() {
      return ['--grid-column-width', '--grid-row-height'];
    }

    layout(children, edges, constraints, styleMap) {
      const columnWidth = styleMap.get('--grid-column-width').value;
      const rowHeight = styleMap.get('--grid-row-height').value;
      let x = 0;
      let y = 0;

      for (const child of children) {
        const childStyle = child.styleMap;
        const gridColumn = childStyle.get('grid-column').value;
        const gridRow = childStyle.get('grid-row').value;
        const width = (gridColumn.end - gridColumn.start) * columnWidth;
        const height = (gridRow.end - gridRow.start) * rowHeight;

        child.layoutNextFragment({
          inlineSize: width,
          blockSize: height,
          x: x,
          y: y,
        });

        x += width;
        if (x >= edges.borderBox.right) {
          x = 0;
          y += height;
        }
      }
    }
  }
);
