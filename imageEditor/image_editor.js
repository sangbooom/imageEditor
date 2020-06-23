/**
 * Created by user psb on 2020-06-17.
 */
var imageEditor = {

    imageEditorCanvas : null
    ,imageEditorBtnCon : null
    , currentImg: null
    , imgW: 0
    , imgH: 0

    ,init : function ( img ) {
        this.imageEditorCanvas = imageEditorCanvas;
        this.imageEditorCanvas.init( "#canvas", img );
        var imgWidth = this.imageEditorCanvas.getProp( "width" );
        var imgHeight = this.imageEditorCanvas.getProp( "height" );

        this.imgW = imgWidth;
        this.imgH = imgHeight;

        this.currentImg = new Image();
        this.currentImg.src = this.imageEditorCanvas.canvas.toDataURL();

        this.imageEditorBtnCon = imageEditorBtnCon;
        this.imageEditorBtnCon.init( imgWidth, imgHeight );

        this.registEvent();
    }
    
    ,registEvent : function () {

    }
    
    ,removeEvent : function () {
        
    }
    
    ,destroy : function () {
        
    }
}


$(function() {

    var img = new Image();
    img.src = '../여기서해라/123.jpeg';
    img.onload = function(){
        imageEditor.init( img );
    }

    //imageEditor.init( $("#editTargetImg") );

});
