/**
 * Created by user on 2020-06-17.
 */

var imageEditorBtnCon = {
    btnList : {}

    ,init : function ( imgWidth, imgHeight ) {

        // 가로 px 버튼
        var editorBtn = new ImageEditorBtnSize( "#width", "#show_width" );
        editorBtn.setValue( imgWidth, imgHeight );
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_SIZE] = editorBtn;

        this.registEvent();

    }

    ,registEvent : function () {
        this.btnList[ImageEditorBtnType.IMAGE_EDITOR_BUTTON_SIZE].onChange = function( e ){
            console.log( this );
        }
    }

    ,removeEvent : function () {

    }

    ,destroy : function () {

    }
}