var imageEditor = {

    imageEditorCanvas : null
    ,imageEditorBtnCon : null


    ,init : function ( img ) {

        this.imageEditorCanvas = imageEditorCanvas;
        this.imageEditorCanvas.init( "#canvas", img );
        var imgWidth = this.imageEditorCanvas.getProp( "width" );
        var imgHeight = this.imageEditorCanvas.getProp( "height" );

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
    img.src = '../img/facility_3.png';
    img.onload = function(){
        imageEditor.init( img );
    }

    //imageEditor.init( $("#editTargetImg") );


});
