/**
 * Created by user on 2020-06-22.
 */

var imageEditorBtnBrightness = function () {
    this.imageEditorCanvas;
    this.imageEditor;

    this.init();
}

imageEditorBtnBrightness.prototype = {

    init : function(){
        this.imageEditorCanvas = imageEditorCanvas;
        this.imageEditor = imageEditor;

        this.registEvent();
    }
    , registEvent : function () {
        var _this = this;

        $('#brightness').on('input',function() {
            var w = $('#width').val();
            var h = $('#height').val();

            _this.imageEditorCanvas.ctx.drawImage(_this.imageEditor.currentImg, 0, 0, w, h); //editImg 로 하는지 currentImg로 하는지,,,,,

            _this.setBrightness();
        });
    }

    , setBrightness: function () {
        var imgData = this.imageEditorCanvas.ctx.getImageData(0, 0, this.imageEditorCanvas.canvas.width, this.imageEditorCanvas.canvas.height);
        var brightness = parseInt($('#brightness').val());
        var filteredData = this.getBrightness(imgData, brightness);
        this.imageEditorCanvas.ctx.putImageData(filteredData, 0, 0);
    }

    , getBrightness: function (imgData, value) {
        var d = imgData.data;
        this.imageEditorCanvas.ctx.clearRect(0, 0, $('#width').val(), $('#height').val());

        for(var i=0; i< d.length; i+=4) {
            d[i] += 255 * (value / 100);
            d[i+1] += 255 * (value / 100);
            d[i+2] += 255 * (value / 100);
        }

        return imgData;
    }


    , destroy : function(){

    }
    , removeEvent : function(){

    }

}