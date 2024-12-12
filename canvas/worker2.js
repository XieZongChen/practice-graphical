onmessage = function (evt) {
  var canvas = evt.data.canvas;
  var gl = canvas.getContext('webgl');
  gl.clearColor(0.0, 0.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.commit();
};
