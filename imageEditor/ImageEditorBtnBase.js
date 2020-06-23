/**
 * Created by user on 2020-06-17.
 */

var imageEditorBtnType = {};
imageEditorBtnType.IMAGE_EDITOR_BUTTON_SIZE = "IMAGE_EDITOR_BUTTON_SIZE";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_ROTATE = "IMAGE_EDITOR_BUTTON_ROTATE";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_FLIP = "IMAGE_EDITOR_BUTTON_FLIP";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_BRIGHTNESS = "IMAGE_EDITOR_BUTTON_BRIGHTNESS";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_ZOOM = "IMAGE_EDITOR_BUTTON_ZOOM";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_CROP = "IMAGE_EDITOR_BUTTON_CROP";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_BLUR = "IMAGE_EDITOR_BUTTON_BLUR";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_CONTRAST = "IMAGE_EDITOR_BUTTON_CONTRAST";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_SHARPEN = "IMAGE_EDITOR_BUTTON_SHARPEN";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_APPLY = "IMAGE_EDITOR_BUTTON_APPLY";
imageEditorBtnType.IMAGE_EDITOR_BUTTON_RESET = "IMAGE_EDITOR_BUTTON_RESET";


var imageEditorBtnBase = function( elementId ){

    this.id = elementId;

    this.value;
    this.element;

    this.onChange = null;
    console.log(this);
    this.init();

}


imageEditorBtnBase.prototype = {

    init : function () {
        this.element = document.querySelector( this.id );
        this.registEvent();
    }

    ,registEvent : function () {
        var _this = this;
    }

    ,removeEvent : function () {

    }

    ,destroy : function () {

    }
}