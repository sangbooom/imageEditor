/**
 * Created by user on 2020-06-19.
 */

var imageEditorBtnFlip = function(){

    this.horizontalBtn;
    this.verticalBtn;
}

$.extend(imageEditorBtnFlip, imageEditorBtnBase );


imageEditorBtnFlip.prototype = {
    
    init : function() {

        this.horizontalBtn = document.querySelector("#imageEditorHorizontalBtn");
        this.verticalBtn = document.querySelector("#imageEditorVerticalBtn");

        this.registEvent();
    }

    , registEvent : function() {
        var _this = this;

        $( this.horizontalBtn ).on("click",function(){
            bm.ImageEditorCanvasCon.flipImage( "horizontal" );
        });

        $( this.verticalBtn ).on("click",function(){
            bm.ImageEditorCanvasCon.flipImage( "vertical" );
        });
    }


    , removeEvent : function () {
        $( this.horizontalBtn, this.verticalBtn ).off("click");
    }
    
    ,destroy : function () {
        
    }




}