/**
 * Created by user on 2020-06-23.
 */
var imageEditorBtnContrast = function () {
    this.imageEditorCanvas;
    this.imageEditor;

    this.init();
}

imageEditorBtnContrast.prototype = {
    init : function () {
        this.imageEditorCanvas = imageEditorCanvas;
        this.imageEditor = imageEditor;

        this.registEvent();
    }

    , registEvent : function () {
        var _this = this;

        $('#contrast').on('input', function() {
            var w = $('#width').val();
            var h = $('#height').val();

            _this.imageEditorCanvas.ctx.drawImage(_this.imageEditor.currentImg, 0, 0, w, h);

            _this.setFilterContrast();
        });
    }

    , getFilterContrast: function(imgData, contrast) {
        var d = imgData.data;
        contrast *= 2.55;
        var factor = (255 + contrast) / (255.01 - contrast);

        for(var i=0;i<d.length;i+=4)
        {
            d[i] = factor * (d[i] - 128) + 128;
            d[i+1] = factor * (d[i+1] - 128) + 128;
            d[i+2] = factor * (d[i+2] - 128) + 128;
        }
        return imgData;
    }

    , setFilterContrast: function(){
        var imgData = this.imageEditorCanvas.ctx.getImageData(0, 0, this.imageEditorCanvas.canvas.width, this.imageEditorCanvas.canvas.height);
        var filteredData = this.getFilterContrast(imgData, parseInt($('#contrast').val(),10) );
        this.imageEditorCanvas.ctx.putImageData(filteredData, 0, 0);
    }

    , removeEvent : function () {

    }

    , destroy : function () {

    }

}