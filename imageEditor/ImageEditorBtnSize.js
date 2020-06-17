/**
 * Created by user on 2020-06-17.
 */

var ImageEditorBtnSize = function(){

    this.widthInput;
    this.heightInput;

    this.appiedWidth;
    this.appiedheight;

    this.isSync = true;
    this.widthApplyBtn;
    this.heightApplyBtn;

    this.onChange = null;

    this.init();

}

$.extend(ImageEditorBtnSize, ImageEditorBtnBase );

ImageEditorBtnSize.prototype = {

    init : function () {

        this.widthInput = document.querySelector("#width");
        this.heightInput = document.querySelector("#height");

        this.widthApplyBtn = document.querySelector( "#show_width" );
        this.heightApplyBtn = document.querySelector( "#show_height" );


        this.registEvent();
    }

    ,registEvent : function () {
        var _this = this;

        $( this.widthApplyBtn ).on("click", function (e) {

            var currentWidth = _this.widthInput.value;
            var currentHeight =_this.heightInput.value;
            var newHeight;
            if( _this.isSync ){

                var scale = currentWidth / _this.appiedWidth;
                newHeight = currentHeight * scale;
            }

            _this.setSize( currentWidth, newHeight );

            if( _this.onChange ) _this.onChange( e );
        });


        $( this.heightApplyBtn ).on("click", function (e) {

            if( _this.isSync ){

            }

            if( _this.onChange ) _this.onChange( e );
        });


        $("#toggle").on("click", function(){
            _this.isSync = !_this.isSync;
        })
    }


    ,setSize : function (width, height ) {
        this.appiedWidth = width;
        this.appiedheight = height;

        this.widthInput.value = width;
        this.heightInput.value = height;
    }

    ,removeEvent : function () {

    }

    ,destroy : function () {

    }
}