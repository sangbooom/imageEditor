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

    this.gapTop;
    this.gapLeft;
}

$.extend(imageEditorBtnCrop, imageEditorBtnBase );


imageEditorBtnCrop.prototype = {

    init : function () {

        this.cropBtn = $('#imageEditorShowCropBoxBtn');
        this.cropConfirmBtn = $('#imageEditorCropConfirmBtn');

        this.cropLayer = $("#imageEditorCropLayer")[0];
        this.cropLayer.x = this.cropLayer.offsetLeft;
        this.cropLayer.y = this.cropLayer.offsetTop;
        

        this.resizerBtnTopRight = $(this.cropLayer).find('.resizer.top-right');
        this.resizerBtnTopLeft = $(this.cropLayer).find('.resizer.top-left');
        this.resizerBtnBottomRight = $(this.cropLayer).find('.resizer.bottom-right');
        this.resizerBtnBottomLeft = $(this.cropLayer).find('.resizer.bottom-left');

        this.gapLeft = parseInt( $(this.resizerBtnTopLeft).css("left") );
        this.gapTop = parseInt( $(this.resizerBtnTopLeft).css("top") );

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
        $(this.cropLayer).find( ".resizer").each( function(){
            mouseAdapter( this).onDrag( onDraggingFn, onDragUpFn, onDragStartFn );
        })

        var _extraX, _extraY, _target, moveX, moveY;
        var l, t, w, h;

        function onDraggingFn( e ){

            e.stopImmediatePropagation();

            moveX = e.clientX - _extraX;
            moveY = e.clientY - _extraY;

            l = parseInt( _this.cropLayer.offsetLeft );
            t = parseInt( _this.cropLayer.offsetTop );
            w = parseInt( _this.cropLayer.offsetWidth );
            h = parseInt( _this.cropLayer.offsetHeight );

            if( $(_target).hasClass( "top-left" ) ){

                l = l + moveX;
                t = t + moveY;
                w = w + -moveX;
                h = h + -moveY;

            }else if( $(_target).hasClass( "top-right" ) ){

                t = t + moveY;
                w = w + moveX;
                h = h + -moveY;

            }else if( $(_target).hasClass( "bottom-left" ) ){

                l = l + moveX;
                w = w + -moveX;
                h = h + moveY;

            }else if( $(_target).hasClass( "bottom-right" ) ){
                w = w + moveX;
                h = h + moveY;
            }

            $(_this.cropLayer).css( { left: l, top: t, width: w, height: h });

            _extraX = e.clientX;
            _extraY = e.clientY;
        }

        function onDragUpFn( e ){

        }

        function onDragStartFn( e ){
            e.stopImmediatePropagation();

            _target = e.currentTarget;

            _extraX = e.clientX;
            _extraY = e.clientY;
        }


        $(this.cropConfirmBtn).on("click", function () {
            bm.ImageEditorCanvasCon.cropImage( _this.cropLayer.getBoundingClientRect() );
            _this.removeEventForCrop();
            _this.hideCropLayer();
            _this.hideCropConfirmBtn();
        });
    }

    ,removeEventForCrop : function () {

        mouseAdapter(this.cropLayer).dragStop();
        $(this.cropLayer).find( ".resizer").each( function(){
            mouseAdapter( this).offDrag();
        })

        $(this.cropConfirmBtn).off();
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
        var offset = bm.ImageEditorCanvasCon.getOffset();
        $(this.cropLayer).css({
            "width": defaultSize.width + "px",
            "height": defaultSize.height + "px",
            "left": offset.left,
            "top": offset.top,
            "display": "inline-block"
        });

        this.cropLayer.x = this.cropLayer.offsetLeft;
        this.cropLayer.y = this.cropLayer.offsetTop;
    }

    /**
     * 잘라내기 영역 숨기기
     */
    ,hideCropLayer : function () {
        $(this.cropLayer).hide();
    }

    , destroy : function () {
        $( this.cropBtn ).off("click");
    }

    , removeEvent : function () {

    }
}