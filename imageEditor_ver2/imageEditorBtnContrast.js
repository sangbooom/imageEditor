/**
 * Created by user on 2020-06-22.
 */
var imageEditorBtnContrast = function () {

    this.contrastValue = 0;
    this.contrastRange;

}

$.extend(imageEditorBtnContrast, imageEditorBtnBase );

imageEditorBtnContrast.prototype = {

    init : function(){

        this.contrastRange = $("#imageEditorContrastRange");
        this.registEvent();

    }

    , registEvent : function () {

        var _this = this;
        $( this.contrastRange ).on("input",function() {
            _this.contrastValue = this.value;
            bm.ImageEditorCanvasCon.filterControl("contrast", _this.contrastValue );
        });
    }


    /**
     *  대비 값 입력 ( -100 ~ 100 )
     * @param val
     */
    ,setValue : function ( val ) {

        val = Math.min( val, 50 );
        val = Math.max( val, 0 );

        this.contrastValue = val;
        $( this.contrastRange).val( this.contrastValue );
    }

    /**
     * 대비
     * @returns {number}
     */
    ,getValue : function(){
        return this.contrastValue;
    }

    , removeEvent : function(){
        $(this.contrastRange).off("input");
    }

    , destroy : function(){

    }

}
