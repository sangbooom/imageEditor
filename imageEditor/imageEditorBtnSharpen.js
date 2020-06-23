/**
 * Created by user on 2020-06-23.
 */
var imageEditorBtnSharpen = function () {
    this.imageEditor;
    this.imageEditorCanvas;

    this.init();
}

imageEditorBtnSharpen.prototype = {
    init : function () {
        this.imageEditor = imageEditor;
        this.imageEditorCanvas = imageEditorCanvas;

        this.registEvent();
    }

    , registEvent : function () {
        var _this = this;

        $('#sharpen').on('input', function() {
            var imgData = _this.imageEditorCanvas.ctx.getImageData(0,0, _this.imageEditorCanvas.canvas.width, _this.imageEditorCanvas.canvas.height);
            var filteredData = _this.sharpen(imgData);

            _this.imageEditorCanvas.ctx.putImageData(filteredData, 0 , 0);
        });
    }

    , convolution: function(imgData, weights, opaque) {
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);
        var src = imgData.data;
        var sw = imgData.width;
        var sh = imgData.height;
        var w = sw;
        var h = sh;
        var output = this.imageEditorCanvas.ctx.getImageData(0, 0, w, h);
        var dst = output.data;
        var alphaFac = opaque ? 1 : 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var sy = y;
                var sx = x;
                var dstOff = (y * w + x) * 4;
                var r = 0, g = 0, b = 0, a = 0;
                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {
                        var scy = sy + cy - halfSide;
                        var scx = sx + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcOff = (scy * sw + scx) * 4;
                            var wt = weights[cy * side + cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff + 1] = g;
                dst[dstOff + 2] = b;
                dst[dstOff + 3] = a + alphaFac * (255 - a);
            }
        }
        return output;
    }

    , sharpen: function(imgData){
        return this.convolution(imgData,
            [ 0, -1,  0,
                -1, 5, -1,
                0, -1,  0 ], 0);
    }

    , removeEvent : function () {

    }

    , destroy : function () {

    }

}