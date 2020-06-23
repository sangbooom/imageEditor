/**
 * Created by user on 2020-06-23.
 */
var imageEditorBtnReset = function () {
    this.imageEditor;
    this.imageEditorCanvas;
    this.imageEditorBtnSize;

    this.init();
}

imageEditorBtnReset.prototype = {
    init : function () {
        this.imageEditor = imageEditor;
        this.imageEditorCanvas = imageEditorCanvas;
        imageEditorBtnSize.prototype.isSync;

        this.registEvent();
    }

    , registEvent : function () {
        var _this = this;

        $('#resetBtn').on('click', function() {
            _this.resetImage();
        });
    }

    , resetImage: function(){

        $('#canvas').attr('width', this.imageEditor.imgW);
        $('#canvas').attr('height', this.imageEditor.imgH);
        this.imageEditorCanvas.ctx.drawImage(this.imageEditorCanvas.img, 0, 0);
        $('#width').val(this.imageEditor.imgW);
        $('#height').val(this.imageEditor.imgH);

        $('#brightness').val(0);
        $('#contrast').val(0);
        $('#blur').val(0);
        $('#sharpen').val(0);
        $('.range_bg').css('background',"");

        //ImageEditorBtnSize 에서 isSync 변수를 가져와서 사용해야된다,,! 어떻게 접근해야 하나
        if( !imageEditorBtnSize.prototype.isSync ) {
            imageEditorBtnSize.prototype.isSync = !imageEditorBtnSize.prototype.isSync;
            $('#height').attr('disabled', imageEditorBtnSize.prototype.isSync );
        }
        this.zoomValue = 100;
        $('#imageRatio').text( this.zoomValue + "%");

    }

    , removeEvent : function () {

    }

    , destroy : function () {

    }

}