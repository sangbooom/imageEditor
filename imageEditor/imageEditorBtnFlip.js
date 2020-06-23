/**
 * Created by user on 2020-06-19.
 */

var imageEditorBtnFlip = function(){
    this.imageEditorCanvas;

    this.init();
}

//$.extend(imageEditorBtnFlip, ImageEditorBtnBase);

imageEditorBtnFlip.prototype = {
    
    init : function() {
        this.imageEditorCanvas = imageEditorCanvas;

        this.registEvent();
    }

    , registEvent : function() {
        var _this = this;

        $('#x_flip').on("click",function(){
           _this.flip("x_flip");
        });

        $('#y_flip').on("click",function(){
            _this.flip("y_flip");
        });
    }

    , flip : function(dir) {
        var _this = this;
        var img = new Image();
        img.src = this.imageEditorCanvas.canvas.toDataURL();
        $(img).on('load', function() {
            var w = $('#width').val();
            var h = $('#height').val();
            _this.imageEditorCanvas.ctx.clearRect(0, 0, w, h);
            if(dir == "x_flip"){
                _this.imageEditorCanvas.ctx.setTransform(-1,0,0,1,0,0);
                _this.imageEditorCanvas.ctx.drawImage(img, -img.width, 0, w, h);
            } else {
                _this.imageEditorCanvas.ctx.setTransform(1,0,0,-1,0,0);
                _this.imageEditorCanvas.ctx.drawImage(img, 0, -img.height, w, h);
            }
        });
    }

    , captureImage : function() {

    }
    
    , removeEvent : function () {
        
    }
    
    ,destroy : function () {
        
    }




}