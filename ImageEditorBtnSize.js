/**
 * Created by user on 2020-06-17.
 */

var imageEditorBtnSize = function( type ){
    this.type = type;
    this.isSync = true;

    this.widthField;
    this.heightField;
    this.wApplyBtn;
    this.hApplyBtn;

    this.onChange = null;
}

$.extend(imageEditorBtnSize, imageEditorBtnBase );

imageEditorBtnSize.prototype = {

    init : function () {

        this.widthField = document.querySelector("#imageEditorWidthField");
        this.heightField = document.querySelector("#imageEditorHeightField");

        this.wApplyBtn = document.querySelector( "#imageEditorWidthApplyBtn" );
        this.hApplyBtn = document.querySelector( "#imageEditorHeightApplyBtn" );
        this.syncBtn = document.querySelector( "#imageEditorSyncBtn" );

        var currentSize =  bm.imageEditor.ImageEditorCanvasCon.getSize();
        this.setValue( currentSize.width, currentSize.height );
        this.sizeSyncLock( this.isSync );
        this.registEvent();
    }

    /**
     * 비율대로 움직일지 여부 셋팅
     * @param bool
     */
    ,sizeSyncLock : function ( bool ) {
        this.isSync = bool;
        $( this.heightField ).attr('disabled', bool );
    }

    /**
     * 비율에 맞게 높이 설정하기.
     */
    ,resetSyncSize : function () {
        var currentWidth = this.widthField.value;
        var currentHeight;
        var imgNaturalSize = bm.imageEditor.ImageEditorCanvasCon.getNaturalSize();

        if( this.isSync ) {
            currentHeight = currentWidth * ( imgNaturalSize.height / imgNaturalSize.width );
        } else {
            currentHeight = this.heightField.value;
        }

        this.setValue( currentWidth, Math.round( currentHeight ) );
    }

    /**
     * input 필드들에 size 값 적용하기
     * @param width
     * @param height
     */
    , setValue : function ( width, height ) {
        this.widthField.value = width;
        this.heightField.value = height;
    }

    /**
     * input 필드 값 반환
     */
    , getValue : function ( width, height ) {
        return { width : this.widthField.value , height : this.heightField.value };
    }

    /**
     * 이미지에 사이즈 적용하기.
     */
    ,applySize : function () {
        bm.imageEditor.ImageEditorCanvasCon.drawImage( this.widthField.value, this.heightField.value );
    }

    , checkNumber : function (key,dir) {
        if( key.keyCode != 8 && key.keyCode != 13 && ( key.keyCode < 96 || key.keyCode > 105 ) ) {
            alert("숫자만 입력해주세요");
            $(dir == "widthInput" ? this.widthInput : this.heightInput).keypress(function (e) {
                e.preventDefault();
                if( key.keyCode >= 96 || key.keyCode <= 105 ) {
                    $(this).off("keypress");
                }
            });
        } else if(key.keyCode == 13 ) {
            if( this.isSync ) this.resetSyncSize();
        }
    }
    , registEvent : function () {
        var _this = this;

        $( this.widthField, this.heightField ).on("keyup", function(key){
            this.value = this.value.replace(bm.valid.onlyNumRegex, "");
            if(key.keyCode == 13) {
                if( _this.isSync ) _this.resetSyncSize();
                _this.applySize();
            }
        });

        $( this.widthField, this.heightField ).on("click", function(){
            $(this).select();
        });

        $( this.wApplyBtn ).on("click", function (e) {
            if( _this.isSync ) _this.resetSyncSize();
            _this.applySize();
            if( _this.onChange ) _this.onChange( e );
        });

        $( this.hApplyBtn ).on("click", function (e) {
            _this.applySize();
            if( _this.onChange ) _this.onChange( e );
        });

        $(this.syncBtn).on("click", function(){
            _this.sizeSyncLock( !_this.isSync );
        })
    }


    , removeEvent : function () {
        $( this.widthField, this.heightField, this.wApplyBtn, this.hApplyBtn, this.syncBtn ).off( "click" );
        $( this.widthField, this.heightField ).off( "keyup" );
    }

    , destroy : function () {

    }
}