/**
 * Created by user on 2020-06-17.
 */

var imageEditorBtnCon = {
    btnList : {}

    ,init : function ( imgWidth, imgHeight ) {

        // 가로 px 버튼
        var editorBtn = new imageEditorBtnSize();
        //editorBtn.setValue( imgWidth, imgHeight );
        var editorBtn2 = new imageEditorBtnRotate();
        var editorBtn3 = new imageEditorBtnFlip();
        var editorBtn4 = new imageEditorBtnBrightness();
        var editorBtn5 = new imageEditorBtnZoom();
        var editorBtn6 = new imageEditorBtnCrop();
        var editorBtn7 = new imageEditorBtnBlur();
        var editorBtn8 = new imageEditorBtnContrast();
        var editorBtn9 = new imageEditorBtnSharpen();
        var editorBtn10 = new imageEditorBtnApply();
        var editorBtn11 = new imageEditorBtnReset();

        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_SIZE] = editorBtn;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_ROTATE] = editorBtn2;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_FLIP] = editorBtn3;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_BRIGHTNESS] = editorBtn4;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_ZOOM] = editorBtn5;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_CROP] = editorBtn6;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_BLUR] = editorBtn7;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_CONTRAST] = editorBtn8;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_SHARPEN] = editorBtn9;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_APPLY] = editorBtn10;
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_RESET] = editorBtn11;


        this.registEvent();

    }

    ,registEvent : function () {
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_SIZE].onChange = function( e ){ //이부분 모르겠음.
            console.log( this );
        }
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_ROTATE].onChange = function( e ){
            console.log( this );
        }
    }

    ,removeEvent : function () {

    }

    ,destroy : function () {

    }
}