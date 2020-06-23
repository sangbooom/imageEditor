/**
 * Created by user on 2020-06-17.
 */

var imageEditorBtnSize = function(){

    this.imageEditorCanvas;

    this.widthInput;
    this.heightInput;

    this.appliedWidth;
    this.appliedHeight;

    this.widthApplyBtn;
    this.heightApplyBtn;

    this.onChange;

    this.init();

}

$.extend(imageEditorBtnSize, imageEditorBtnBase );

imageEditorBtnSize.prototype = {

    init : function () {
        this.imageEditorCanvas = imageEditorCanvas;
        this.widthInput = document.querySelector("#width");
        this.heightInput = document.querySelector("#height");

        this.widthApplyBtn = document.querySelector( "#show_width" );
        this.heightApplyBtn = document.querySelector( "#show_height" );

        this.widthInput.value = this.imageEditorCanvas.img.width;
        this.heightInput.value = this.imageEditorCanvas.img.height;

        imageEditorBtnSize.prototype.isSync = true;
        this.onChange = null;

        this.appliedWidth = this.widthInput.value;
        this.appliedHeight = this.heightInput.value;

        $('#height').attr('disabled', imageEditorBtnSize.prototype.isSync);

        this.registEvent();
    }

    , loadImage : function (width, height) {
        var _this = this;
        var img = new Image();
        img.src = this.imageEditorCanvas.canvas.toDataURL();
        $(img).on('load', function(){
            $(_this.imageEditorCanvas.canvas).attr('width', width);
            $(_this.imageEditorCanvas.canvas).attr('height', height);
            _this.imageEditorCanvas.ctx.drawImage(img, 0, 0, width, height);
        });
    }

    , reSize : function () {
        var currentWidth = this.widthInput.value;
        var currentHeight = this.heightInput.value;
        var newHeight;

        if( imageEditorBtnSize.prototype.isSync ){
            var newHeight = (this.imageEditorCanvas.img.width > this.imageEditorCanvas.img.height) ?
            currentWidth * ( this.imageEditorCanvas.img.naturalHeight / this.imageEditorCanvas.img.naturalWidth ) :
            currentHeight * ( this.imageEditorCanvas.img.naturalWidth / this.imageEditorCanvas.img.naturalHeight );

            this.setSize( currentWidth, Math.round(newHeight) );
        } else {
            this.setSize( currentWidth, currentHeight );
        }
    }

    , setSize : function ( width, height ) {
        this.appliedWidth = width;
        this.appliedHeight = height;

        this.widthInput.value = width;
        this.heightInput.value = height;

        this.loadImage(width, height);
    }

    , registEvent : function () {
        var _this = this;

        $( this.widthInput).on("click", function(){
            $(this).select();
        });

        $( this.heightInput).on("click", function(){
            $(this).select();
        });

        $( this.widthInput).keydown(function(key){
           if(key.keyCode == "13") { // || ( key.keyCode >= 48 && key.keyCode <= 57 ) 숫자  , 그리고 image rotate랑 잘 봐바 졸리다
               _this.reSize();
           } else {
               alert("숫자만 입력해주세요");
           }
        });

        $( this.heightInput).keydown(function(key){
            if(key.keyCode == 13) _this.reSize();
        });

        $( this.widthApplyBtn ).on("click", function (e) {
            _this.reSize();
            if( _this.onChange ) _this.onChange( e ); //
        });


        $( this.heightApplyBtn ).on("click", function (e) {
            var currentWidth = _this.widthInput.value;
            var currentHeight =_this.heightInput.value;

            if( !imageEditorBtnSize.prototype.isSync ){
                _this.setSize( currentWidth, currentHeight );
            }
            if( _this.onChange ) _this.onChange( e ); //
        });


        $("#toggle").on("click", function(){
            imageEditorBtnSize.prototype.isSync = !imageEditorBtnSize.prototype.isSync;

            $('#height').attr('disabled', imageEditorBtnSize.prototype.isSync);
        })
    }

    , removeEvent : function () {

    }

    , destroy : function () {

    }
}