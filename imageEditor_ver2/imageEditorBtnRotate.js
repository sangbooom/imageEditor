/**
 * Created by user on 2020-06-18.
 */
var imageEditorBtnRotate = function() {

    this.leftBtn;
    this.rightBtn;
}

$.extend(imageEditorBtnRotate, imageEditorBtnBase );

imageEditorBtnRotate.prototype = {
    init : function() {

        this.leftBtn = document.querySelector("#imageEditorRotateLeftBtn");
        this.rightBtn = document.querySelector("#imageEditorRotateRightBtn");

        this.registEvent();
    }

    , registEvent : function() {
        var _this = this;

        $( this.leftBtn ).on("click",function(){
            bm.ImageEditorCanvasCon.rotateImage( "left" );
        });

        $( this.rightBtn ).on("click",function(){
            bm.ImageEditorCanvasCon.rotateImage( "right" );
        });
    }

    , removeEvent : function() {
        $( this.leftBtn, this.rightBtn).off( "click" );
    }

    ,destroy : function () {

    }
}