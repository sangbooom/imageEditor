/**
 * Created by user on 2020-06-22.
 */
var imageEditorBtnBlur = function () {

    this.blurValue = 0;
    //this.blurMaxValue = 10;
    this.blurRange;

}

$.extend(imageEditorBtnBlur, imageEditorBtnBase );

imageEditorBtnBlur.prototype = {

    init : function(){

        this.blurRange = $("#imageEditorBlurRange");
        this.registEvent();

    }

    , registEvent : function () {

        var _this = this;
        $( this.blurRange ).on("input",function() {
            _this.blurValue = this.value - 255;
            bm.ImageEditorCanvasCon.filterControl("blur", _this.blurValue );
        });
    }


    /**
     *  블러 값 입력 ( -255 ~ 255 )
     * @param val
     */
    ,setValue : function ( val ) {
        val = Math.min( val, 255 );
        val = Math.max( val, 0 );

        this.blurValue = val;
        $( this.blurRange).val( this.blurValue + 255 );
    }

    /**
     * 블러
     * @returns {number}
     */
    ,getValue : function(){
        return this.blurValue - 255;
    }

    , removeEvent : function(){
        $(this.blurRange).off("input");
    }

    , destroy : function(){

    }

}
