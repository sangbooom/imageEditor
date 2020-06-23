/**
 * Created by user on 2020-06-23.
 */

var imageEditorBtnCrop = function(){
    this.imageEditorCanvas;
    this.imageEditor;

    this.boundInfo;
    this.prevX;
    this.prevY;
    this.mouseMoveType;

    this.init();
}

imageEditorBtnCrop.prototype = {

    init : function () {
        this.imageEditorCanvas = imageEditorCanvas;
        this.imageEditor = imageEditor;

        this.boundInfo = {};
        this.mouseMoveType = null;
        this.prevX = 0;
        this.prevY = 0;

        this.registEvent();
    }

    , registEvent : function () {
        var _this = this;

        $('#crop').on('click', function() {
            _this.ImageCrop();
        });

        $('.cropBox').on('mousedown', function(e) {
            var w = parseInt($('#width').val(),10);
            var h = parseInt($('#height').val(),10);

            _this.boundInfo = $('#canvas')[0].getBoundingClientRect();

            console.log(_this.boundInfo);
            _this.prevX = e.clientX;
            _this.prevY = e.clientY;

            if($(e.target).hasClass("cropBox")) {
                _this.mouseMoveType = "move";
            } else {
                _this.mouseMoveType = "crop";
            }

            $(window).on('mousemove', {target: e.target, prevX: e.offsetX, prevY: e.offsetY}, _this.onMouseMove);

            $('.cropBox').on('mouseup', function() {
                $(window).off('mousemove');
                $('.cropBox').off('mouseup');
            });
        });

    }

    , ImageCrop : function () {
        var _this = this;

        $('.cropBox').css({
            "width": parseInt($('#width').val(),10) + "px",
            "height": parseInt($('#height').val(),10) + "px",
            "display": "inline-block"
        });

        $('#cropBtn').css("display","inline-block");

        $('#cropBtn').on('click', function(){
            var rect = $('.cropBox')[0].getBoundingClientRect();

            var currentImageData = _this.imageEditorCanvas.ctx.getImageData( rect.x - _this.boundInfo.x , rect.y - _this.boundInfo.y , rect.width, rect.height);

            $('#canvas').attr("width", rect.width + "px");
            $('#canvas').attr("height", rect.height + "px");

            _this.imageEditorCanvas.ctx.putImageData(currentImageData, 0,0 );
            _this.imageEditor.currentImg.src = _this.imageEditorCanvas.canvas.toDataURL();

            $('.cropBox').css("left", _this.boundInfo.x + (_this.boundInfo.width - rect.width) / 2 + "px");
            $('.cropBox').css("top", _this.boundInfo.y + (_this.boundInfo.height - rect.height) / 2 + "px");

            $('#width').val(rect.width);
            $('#height').val(rect.height);

            $('.cropBox').css({ "display": "none"});
            $('#cropBtn').css({ "display": "none"});

        });
    }

    , onMouseMove: function(e) {
        var rect = $('.cropBox')[0].getBoundingClientRect();

        if(this.mouseMoveType == "move") { // move
            var moveX = e.clientX - this.prevX;
            var moveY = e.clientY - this.prevY;

            $('.cropBox').css({
                left: $('.cropBox').offset().left + moveX,
                top: $('.cropBox').offset().top + moveY
            });

            if( rect.left < this.boundInfo.left) {
                $('.cropBox').css({left: this.boundInfo.left});
            }
            if( rect.left + rect.width > this.boundInfo.right) {
                $('.cropBox').css({left: this.boundInfo.left + ( this.boundInfo.width - rect.width )});
            }
            if( rect.top < this.boundInfo.top) {
                $('.cropBox').css({top: this.boundInfo.top});
            }
            if( rect.top + rect.height > this.boundInfo.bottom) {
                $('.cropBox').css({top: this.boundInfo.top + ( this.boundInfo.height - rect.height )});
            }
            this.prevX = e.clientX;
            this.prevY = e.clientY;

        } else { // crop
            var currentResizer = e.data.target;

            var moveX = ( e.clientX - this.prevX );
            var moveY = ( e.clientY - this.prevY );

            var minSize = 50;

            if(currentResizer.classList.contains("bottom-right")) {

                $('.cropBox').css({ left: rect.left, top: rect.top });
                if( rect.left + rect.width > this.boundInfo.right ){
                    $('.cropBox').css({width: rect.width -1 });
                } else if( rect.width + moveX  > minSize ){
                    $('.cropBox').css({width: rect.width + moveX });
                }

                if( rect.top + rect.height > this.boundInfo.bottom ){
                    $('.cropBox').css({height: rect.height -1 });
                } else if( rect.height + moveY > minSize){
                    $('.cropBox').css({height: rect.height + moveY });
                }

            } else if (currentResizer.classList.contains("bottom-left")) {

                $('.cropBox').css({top: rect.top });

                if( this.boundInfo.left + rect.width > this.boundInfo.right - (this.boundInfo.right - rect.right ) ){
                    $('.cropBox').css({ left: this.boundInfo.left });
                    $('.cropBox').css({ width: rect.width - 1 });
                } else if( rect.width - moveX  > minSize){
                    $('.cropBox').css({ width: rect.width - moveX });
                    $('.cropBox').css({ left: rect.left + moveX });
                }

                if( this.boundInfo.top + rect.height > this.boundInfo.bottom - (rect.top - this.boundInfo.top) ){
                    $('.cropBox').css({ height : rect.height - 1 });
                } else if( rect.height + moveY > minSize){
                    $('.cropBox').css({ height: rect.height + moveY });
                }

            } else if (currentResizer.classList.contains("top-right")) {

                $('.cropBox').css({ left: rect.left });

                if( rect.width + moveX  > minSize){
                    $('.cropBox').css({width: rect.width + moveX });
                }
                if( rect.height - moveY > minSize){
                    $('.cropBox').css({top: rect.top + moveY });
                    $('.cropBox').css({height: rect.height - moveY });
                }

            } else if (currentResizer.classList.contains("top-left")) {
                if( rect.width - moveX > minSize) {
                    $('.cropBox').css({ width : rect.width - moveX });
                    $('.cropBox').css({ left: rect.left + moveX});
                }
                if( rect.height - moveY > minSize) {
                    $('.cropBox').css({ height: rect.height - moveY });
                    $('.cropBox').css({top: rect.top + moveY });
                }
            }
            this.prevX = e.clientX;
            this.prevY = e.clientY;
        }
    }

    , destroy : function () {

    }

    , removeEvent : function () {

    }
}