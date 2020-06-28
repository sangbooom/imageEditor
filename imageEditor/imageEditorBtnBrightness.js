/**
 * Created by user on 2020-06-22.
 */
var imageEditorBtnBrightness = function () {

    this.brightnessValue = 0;
    this.brightnessRange;

}

$.extend(imageEditorBtnBrightness, imageEditorBtnBase );

imageEditorBtnBrightness.prototype = {

    init : function(){

        this.brightnessRange = $("#imageEditorBrightnessRange");
        this.registEvent();

    }

    , registEvent : function () {

        var _this = this;
        $( this.brightnessRange ).on("input",function() {
            _this.brightnessValue = this.value - 100;
            bm.ImageEditorCanvasCon.filterControl("brightness", _this.brightnessValue );
        });
    }


    /**
     *  밝기 값 입력 ( -100 ~ 100 )
     * @param val
     */
    ,setValue : function ( val ) {
        val = Math.min( val, 100 );
        val = Math.max( val, -100 );

        this.brightnessValue = val;
        $( this.brightnessRange).val( this.brightnessValue + 100 );
    }

    /**
     * 밝기
     * @returns {number}
     */
    ,getValue : function(){
        return this.brightnessValue - 100;
    }

    , removeEvent : function(){
        $('#brightnessField').off("input");
    }

    , destroy : function(){

    }

}
