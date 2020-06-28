/**
 * Created by user on 2020-06-23.
 */
var imageEditorBtnReset = function () {

}

$.extend(imageEditorBtnSharpen, imageEditorBtnBase );

imageEditorBtnReset.prototype = {
    init : function () {

        this.registEvent();
    }

    , registEvent : function () {
        var _this = this;

        $('#imageEditorResetBtn').on('click', function() {
            _this.resetImage();
        });
    }

    , resetImage: function(){

        $('#canvas').attr('width', this.imgW);
        $('#canvas').attr('height', this.imageEditor.imgH);
        this.imageEditorCanvas.ctx.drawImage(this.imageEditorCanvas.img, 0, 0);
        $('#width').val(this.imageEditor.imgW);
        $('#height').val(this.imageEditor.imgH);

        $('#brightness').val(0);
        $('#contrast').val(0);
        $('#blur').val(0);
        $('#sharpen').val(0);

        $('.range_bg').css('background',"");

        if( !imageEditorBtnSize.prototype.isSync ) {
            imageEditorBtnSize.prototype.isSync = !imageEditorBtnSize.prototype.isSync;
            $('#height').attr('disabled', imageEditorBtnSize.prototype.isSync );
        }
        imageEditorBtnZoom.prototype.zoomValue = 100;
        $('#imageRatio').text( imageEditorBtnZoom.prototype.zoomValue + "%");

    }

    , removeEvent : function () {

    }

    , destroy : function () {

    }

}