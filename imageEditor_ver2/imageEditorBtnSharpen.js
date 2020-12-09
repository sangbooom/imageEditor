/**
 * Created by user on 2020-06-22.
 */
var imageEditorBtnSharpen = function () {

    this.sharpenValue = 0;
    this.sharpenMaxValue = 2;
    this.sharpenRange;

}

$.extend(imageEditorBtnSharpen, imageEditorBtnBase );

imageEditorBtnSharpen.prototype = {

    init : function(){

        this.sharpenRange = $("#imageEditorSharpenRange");
        this.registEvent();

    }

    , registEvent : function () {

        var _this = this;
        $( this.sharpenRange ).on("input",function() {
            _this.sharpenValue = this.value;
            bm.ImageEditorCanvasCon.filterControl("sharpen", _this.sharpenValue );
        });
    }


    /**
     *  선명도 값 입력 ( 0 ~ 2 )
     * @param val
     */
    ,setValue : function ( val ) {
        val = Math.min( val, this.sharpenMaxValue );
        val = Math.max( val, 0 );

        this.sharpenValue = val;
        $( this.sharpenRange).val( this.sharpenValue );
    }

    /**
     * 선명도
     * @returns {number}
     */
    ,getValue : function(){
        return this.sharpenValue;
    }

    , removeEvent : function(){
        $(this.sharpenRange).off("input");
    }

    , destroy : function(){

    }

}
