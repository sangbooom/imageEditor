/**
 * Created by user on 2020-06-22.
 */

var imageEditorBtnZoom = function(){

    this.zoomInBtn;
    this.zoomOutBtn;
    this.zoomValue = 1;
}

$.extend(imageEditorBtnZoom, imageEditorBtnBase );

imageEditorBtnZoom.prototype = {

    init : function(){
        this.zoomValue = 1;

        this.zoomInBtn = document.querySelector("#zoomInBtn");
        this.zoomOutBtn = document.querySelector("#zoomOutBtn");

        this.registEvent();
    }

    , registEvent : function(){
        var _this = this;

        $('#zoomInBtn').on("click", function(){
            _this.zoomValue = bm.ImageEditorCanvasCon.zoomIncrease();
            _this.setZoomText();
        });

        $('#zoomOutBtn').on("click", function(){
            _this.zoomValue = bm.ImageEditorCanvasCon.zoomDecrease();
            _this.setZoomText();
        });
    }
    
    ,setZoomText : function () {
        $("#imageEditorZoomText").text( parseInt( this.zoomValue * 100 ) + "%" );
    }

    , removeEvent: function () {
        $( this.zoomInBtn, this.zoomOutBtn).off("click");
    }

    , destroy : function() {

    }

}