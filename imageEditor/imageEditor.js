/**
 * Created by user psb on 2020-06-17.
 */
bm.imageEditor = {

    ImageEditorCanvasCon : null
    , btnList : {}
    , dataURL : null

    ,init : function ( img ) {

        this.ImageEditorCanvasCon = bm.ImageEditorCanvasCon;
        this.ImageEditorCanvasCon.init( "#canvas", img );

        this.createBtn();
        this.registEvent();
    }

    ,createBtn : function () {

        // 가로 px 버튼
        var editorBtn = new imageEditorBtnSize( imageEditorBtnType.IMAGE_EDITOR_BUTTON_SIZE );
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 좌 90도, 우 90도 회전 버튼
        editorBtn = new imageEditorBtnRotate( imageEditorBtnType.IMAGE_EDITOR_BUTTON_ROTATE );
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 좌우, 상하 반전 버튼
        editorBtn = new imageEditorBtnFlip(imageEditorBtnType.IMAGE_EDITOR_BUTTON_FLIP);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 잘라내기 버튼
        editorBtn = new imageEditorBtnCrop(imageEditorBtnType.IMAGE_EDITOR_BUTTON_CROP);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 확대 축소 버튼
        editorBtn = new imageEditorBtnZoom(imageEditorBtnType.IMAGE_EDITOR_BUTTON_ZOOM);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 밝기 버튼
        editorBtn = new imageEditorBtnBrightness(imageEditorBtnType.IMAGE_EDITOR_BUTTON_BRIGHTNESS);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 대비 조절 버튼
        editorBtn = new imageEditorBtnContrast(imageEditorBtnType.IMAGE_EDITOR_BUTTON_CONTRAST);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 블러 버튼
        editorBtn = new imageEditorBtnBlur(imageEditorBtnType.IMAGE_EDITOR_BUTTON_BLUR);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 선명도 버튼
        editorBtn = new imageEditorBtnSharpen(imageEditorBtnType.IMAGE_EDITOR_BUTTON_SHARPEN);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();





        /*
        // 적용 버튼
        editorBtn = new imageEditorBtnApply(imageEditorBtnType.IMAGE_EDITOR_BUTTON_APPLY);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();

        // 리셋 버튼
        editorBtn = new imageEditorBtnReset(imageEditorBtnType.IMAGE_EDITOR_BUTTON_RESET);
        this.btnList[ editorBtn.type ] = editorBtn;
        this.btnList[ editorBtn.type].init();
        */
    }
    
    ,registEvent : function () {
        var _this = this;

        this.ImageEditorCanvasCon.onChange = function( type, data ){
            if( type == "rotate" ){

                var sizeInfo = _this.ImageEditorCanvasCon.getSize();
                _this.btnList[imageEditorBtnType.IMAGE_EDITOR_BUTTON_SIZE].setValue( sizeInfo.width, sizeInfo.height );

            }else if( type == "resize" ){

            }else if( type == "flip" ){

            }
        }

    }

    ,removeEvent : function () {
        
    }
    
    ,destroy : function () {
        
    }
}

$(function() {
    var img = new Image();
    img.src = '../img/facility_3.png';
    img.addEventListener("load", function(e){
        e.target.removeEventListener( "load", arguments.callee );
        bm.imageEditor.init( img );
    })
    //imageEditor.init( $("#editTargetImg") );

});
