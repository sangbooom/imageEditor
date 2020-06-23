/**
 * Created by user on 2020-06-18.
 */
var imageEditorBtnRotate = function() {
    this.imageEditorCanvas;

    this.init();
}

//$.extend(ImageEditorBtnRotate, ImageEditorBtnBase );

imageEditorBtnRotate.prototype = {
    init : function() {
        this.imageEditorCanvas = imageEditorCanvas;
        this.registEvent();
    }

    , registEvent : function() {
        var _this = this;

        $('#left').on("click",function(){
            _this.sizeSwap();
            _this.rotateImage("left");
        });

        $('#right').on("click",function(){
            _this.sizeSwap();
            _this.rotateImage("right");
        });
    }

    , sizeSwap : function() {
        var width = $('#width').val();
        var height = $('#height').val();
        $('#height').val(width);
        $('#width').val(height);
    }

    , rotateImage : function (dir) {
        var _this = this;
        var img = new Image();
        img.src = this.imageEditorCanvas.canvas.toDataURL();
        $(img).on('load', function(){
            var currentWidth = $('#width').val();
            var currentHeight = $('#height').val();

            $(_this.imageEditorCanvas.canvas).attr('width', currentWidth);
            $(_this.imageEditorCanvas.canvas).attr('height', currentHeight);

            _this.imageEditorCanvas.ctx.translate(currentWidth / 2, currentHeight / 2);
            if(dir == "left") {
                _this.imageEditorCanvas.ctx.rotate(-Math.PI / 2);
            } else {
                _this.imageEditorCanvas.ctx.rotate(Math.PI / 2);
            }
            _this.imageEditorCanvas.ctx.drawImage(img, -currentHeight / 2, -currentWidth / 2, currentHeight, currentWidth);
        });
    }

    , removeEvent : function() {

    }

    ,destroy : function () {

    }
}