/**
 * Created by user on 2020-06-23.
 */

var imageEditorBtnCrop = function(){

    this.boundInfo = {};
    this.mouseMoveType = null;
    this.prevX = 0;
    this.prevY = 0;

    this.cropBtn;
    this.cropConfirmBtn;

    this.cropLayer;

    this.resizerBtnTopRight;
    this.resizerBtnTopLeft;
    this.resizerBtnBottomRight;
    this.resizerBtnBottomLeft;
}

$.extend(imageEditorBtnCrop, imageEditorBtnBase );


imageEditorBtnCrop.prototype = {

    init : function () {

        this.cropBtn = $('#imageEditorShowCropBoxBtn');
        this.cropConfirmBtn = $('#imageEditorCropConfirmBtn');

        this.cropLayer = $("#imageEditorCropLayer")[0];

        this.resizerBtnTopRight = $(this.cropLayer).find('.resizer.top-right');
        this.resizerBtnTopLeft = $(this.cropLayer).find('.resizer.top-left');
        this.resizerBtnBottomRight = $(this.cropLayer).find('.resizer.bottom-right');
        this.resizerBtnBottomLeft = $(this.cropLayer).find('.resizer.bottom-left');

        this.registEvent();
    }

    , registEvent : function () {

        var _this = this;
        $( this.cropBtn ).on("click", function() {
            //bm.ImageEditorCanvasCon.ImageCrop();

            _this.showCropLayer();
            _this.showCropConfirmBtn();
            _this.registEventForCrop();

        });
    }

    ,registEventForCrop : function () {
        var _this = this;

        mouseAdapter(this.cropLayer).dragStart();


        $(this.cropConfirmBtn).on("click", function () {
            //var rect = $('.cropBox')[0].getBoundingClientRect();
            //
            //var currentImageData = _this.ctx.getImageData( rect.x - _this.boundInfo.x , rect.y - _this.boundInfo.y , rect.width, rect.height);
            //
            //$('#canvas').attr("width", rect.width + "px");
            //$('#canvas').attr("height", rect.height + "px");
            //
            //_this.ctx.putImageData(currentImageData, 0,0 );
            //_this.img.src = _this.canvas.toDataURL();
            //
            //$('.cropBox').css("left", _this.boundInfo.x + (_this.boundInfo.width - rect.width) / 2 + "px");
            //$('.cropBox').css("top", _this.boundInfo.y + (_this.boundInfo.height - rect.height) / 2 + "px");
            //
            //$('#imageEditorWidthField').val(rect.width);
            //$('#imageEditorHeightField').val(rect.height);
            //
            //$('.cropBox').css("display", "none");
            //$('#imageEditorCropBtn').css("display", "none");
        });





    }

    ,removeEventForCrop : function () {

        mouseAdapter(this.cropLayer).dragStop();

        $(this.cropConfirmBtn).off("click");
    }

    /**
     * 자르기 버튼 보이기
     */
    ,showCropConfirmBtn : function () {
        $(this.cropConfirmBtn).show();
    }

    /**
     * 자르기 버튼 숨기기
     */
    ,hideCropConfirmBtn : function () {
        $(this.cropConfirmBtn).hide();
    }
    
    /**
     * 잘라내기 영역 나타내기
     */
    ,showCropLayer : function () {
        var defaultSize = bm.ImageEditorCanvasCon.getSize();
        $('.cropBox').css({
            "width": defaultSize.width + "px",
            "height": defaultSize.height + "px",
            "display": "inline-block"
        });
    }

    /**
     * 잘라내기 영역 숨기기
     */
    ,hideCropLayer : function () {
        $('.cropBox').hide();
    }


    //, ImageCrop : function () {
    //
    //
    //
    //    $('.cropBox').on('mousedown', function(e) {
    //        _this.boundInfo = $('#canvas')[0].getBoundingClientRect();
    //
    //        console.log(_this.boundInfo);
    //        _this.prevX = e.clientX;
    //        _this.prevY = e.clientY;
    //
    //        if($(e.target).hasClass("cropBox")) {
    //            _this.mouseMoveType = "move";
    //        } else {
    //            _this.mouseMoveType = "crop";
    //        }
    //
    //        $(window).on('mousemove', {target: e.target, prevX: e.offsetX, prevY: e.offsetY}, _this.onMouseMove); // 마우스가 객체 위를 떠나도 계속 그 객체타켓으로 움직이게 하고싶어서
    //
    //        $('.cropBox').on('mouseup', function() {
    //            $(window).off('mousemove');
    //            $('.cropBox').off('mouseup');
    //        });
    //    });
    //}
    //
    //, onMouseMove: function(e) {
    //    var rect = $('.cropBox')[0].getBoundingClientRect();
    //
    //    if(this.mouseMoveType == "move") { // move
    //        var moveX = e.clientX - this.prevX;
    //        var moveY = e.clientY - this.prevY;
    //
    //        $('.cropBox').css({
    //            left: $('.cropBox').offset().left + moveX,
    //            top: $('.cropBox').offset().top + moveY
    //        });
    //
    //        if( rect.left < this.boundInfo.left) {
    //            $('.cropBox').css({left: this.boundInfo.left});
    //        }
    //        if( rect.left + rect.width > this.boundInfo.right) {
    //            $('.cropBox').css({left: this.boundInfo.left + ( this.boundInfo.width - rect.width )});
    //        }
    //        if( rect.top < this.boundInfo.top) {
    //            $('.cropBox').css({top: this.boundInfo.top});
    //        }
    //        if( rect.top + rect.height > this.boundInfo.bottom) {
    //            $('.cropBox').css({top: this.boundInfo.top + ( this.boundInfo.height - rect.height )});
    //        }
    //        this.prevX = e.clientX;
    //        this.prevY = e.clientY;
    //
    //    } else { // crop
    //        var currentResizer = e.data.target;
    //
    //        var moveX = ( e.clientX - this.prevX );
    //        var moveY = ( e.clientY - this.prevY );
    //
    //        var minSize = 50;
    //
    //        if(currentResizer.classList.contains("bottom-right")) {
    //
    //            $('.cropBox').css({ left: rect.left, top: rect.top });
    //            if( rect.left + rect.width > this.boundInfo.right ){
    //                $('.cropBox').css({width: rect.width -1 });
    //            } else if( rect.width + moveX  > minSize ){
    //                $('.cropBox').css({width: rect.width + moveX });
    //            }
    //
    //            if( rect.top + rect.height > this.boundInfo.bottom ){
    //                $('.cropBox').css({height: rect.height -1 });
    //            } else if( rect.height + moveY > minSize){
    //                $('.cropBox').css({height: rect.height + moveY });
    //            }
    //
    //        } else if (currentResizer.classList.contains("bottom-left")) {
    //
    //            $('.cropBox').css({top: rect.top });
    //
    //            if( this.boundInfo.left + rect.width > this.boundInfo.right - (this.boundInfo.right - rect.right ) ){
    //                $('.cropBox').css({ left: this.boundInfo.left });
    //                $('.cropBox').css({ width: rect.width - 1 });
    //            } else if( rect.width - moveX  > minSize){
    //                $('.cropBox').css({ width: rect.width - moveX });
    //                $('.cropBox').css({ left: rect.left + moveX });
    //            }
    //
    //            if( this.boundInfo.top + rect.height > this.boundInfo.bottom - (rect.top - this.boundInfo.top) ){
    //                $('.cropBox').css({ height : rect.height - 1 });
    //            } else if( rect.height + moveY > minSize){
    //                $('.cropBox').css({ height: rect.height + moveY });
    //            }
    //
    //        } else if (currentResizer.classList.contains("top-right")) {
    //
    //            $('.cropBox').css({ left: rect.left });
    //
    //            if( rect.width + moveX  > minSize){
    //                $('.cropBox').css({width: rect.width + moveX });
    //            }
    //            if( rect.height - moveY > minSize){
    //                $('.cropBox').css({top: rect.top + moveY });
    //                $('.cropBox').css({height: rect.height - moveY });
    //            }
    //
    //        } else if (currentResizer.classList.contains("top-left")) {
    //            if( rect.width - moveX > minSize) {
    //                $('.cropBox').css({ width : rect.width - moveX });
    //                $('.cropBox').css({ left: rect.left + moveX});
    //            }
    //            if( rect.height - moveY > minSize) {
    //                $('.cropBox').css({ height: rect.height - moveY });
    //                $('.cropBox').css({top: rect.top + moveY });
    //            }
    //        }
    //        this.prevX = e.clientX;
    //        this.prevY = e.clientY;
    //    }
    //}


    , destroy : function () {
        $( this.cropBtn ).off("click");
    }

    , removeEvent : function () {

    }
}