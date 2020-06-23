/**
 * Created by user on 2020-06-22.
 */

var imageEditorBtnZoom = function(){
    this.imageEditorCanvas;
    this.imageEditor;
    this.zoomValue;

    this.init();
}

imageEditorBtnZoom.prototype = {

    init : function(){
        this.imageEditorCanvas = imageEditorCanvas;
        this.imageEditor = imageEditor;
        this.zoomValue = 100;

        this.registEvent();
    }

    , registEvent : function(){
        var _this = this;
        $('#zoom_in').on('click', function(){
           _this.zoomImage("zoom_in");
        });

        $('#zoom_out').on('click', function(){
            _this.zoomImage("zoom_out");
        });
    }

    , zoomImage : function(dir) {
        var _this = this;
        var img = new Image();
        img.src = this.imageEditorCanvas.canvas.toDataURL();
        $(img).on('load', function() {
            _this.imageEditorCanvas.ctx.clearRect(0, 0, parseInt($('#width').val(), 10), parseInt($('#height').val(), 10));
            var w = $('#width').val();
            var h = $('#height').val();
            var scale = ( dir == "zoom_in" ? 1.1 : 0.9 );
            var currentW = Math.round(w * scale);
            var currentH = Math.round(h * scale);
            $('#width').val(currentW);
            $('#height').val(currentH);
            $('#canvas').attr('width', currentW);
            $('#canvas').attr('height', currentH);
            _this.imageEditorCanvas.ctx.setTransform(scale, 0, 0, scale, 0, 0);
            _this.imageEditorCanvas.ctx.drawImage(this, 0, 0, w, h);
            $('#imageRatio').text((_this.zoomValue += ( dir == "zoom_in" ? ((scale * 10) - 1) : -((scale * 10) + 1) ) ) + "%");
        });
    }

    , destroy : function() {

    }

    , removeEvent: function () {

    }
}