/**
 * Created by user on 2020-06-17.
 */

var ImageEditorBtnType = {};
ImageEditorBtnType.IMAGE_EDITOR_BUTTON_SIZE = "IMAGE_EDITOR_BUTTON_SIZE";


var ImageEditorBtnBase = function( elementId ){

    this.id = elementId;

    this.value;
    this.element;

    this.onChange = null;
    this.init();

}


ImageEditorBtnBase.prototype = {

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