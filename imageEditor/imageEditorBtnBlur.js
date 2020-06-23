/**
 * Created by user on 2020-06-23.
 */
var imageEditorBtnBlur = function () {
    this.imageEditorCanvas;
    this.convolution;
    this.init();
}

imageEditorBtnBlur.prototype = {
    init : function () {
        this.imageEditorCanvas = imageEditorCanvas;
        this.convolution = imageEditorBtnSharpen.prototype.convolution;
        this.registEvent();
    }

    , registEvent : function () {
        var _this = this;

        $('#blur').on('input', function(){
            var imgData = _this.imageEditorCanvas.ctx.getImageData(0,0, _this.imageEditorCanvas.canvas.width, _this.imageEditorCanvas.canvas.height);
            var filteredData = _this.setFilterBlur(imgData, 90);

            _this.imageEditorCanvas.ctx.putImageData(filteredData, 0 , 0);
        });
    }
    , setFilterBlur: function (imgData, value) {
        var offset = 1/(value/10);
        return this.convolution(imgData,
            [ offset, offset, offset,
                offset, offset, offset,
                offset, offset, offset ], 0);
    }

    , removeEvent : function () {

    }

    , destroy : function () {

    }

}