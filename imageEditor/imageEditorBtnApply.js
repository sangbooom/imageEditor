/**
 * Created by user on 2020-06-23.
 */
var imageEditorBtnApply = function () {
    this.imageEditor;
    this.imageEditorCanvas;
    this.dataURL;

    this.init();
}

imageEditorBtnApply.prototype = {
    init : function () {
        this.imageEditor = imageEditor;
        this.imageEditorCanvas = imageEditorCanvas;
        this.dataURL = null;

        this.registEvent();
    }

    , registEvent : function () {
        var _this = this;

        $('#applyBtn').on("click", function(){
            _this.applyImage();
        });
    }

    , applyImage: function () {
        var _this = this;
        var imgData = this.imageEditorCanvas.ctx.getImageData(0, 0, $('#width').val(), $('#height').val());

        this.imageEditorCanvas.ctx.putImageData(imgData,0 ,0);

        this.dataURL = this.imageEditorCanvas.canvas.toDataURL();
        console.log(this.dataURL);
        document.getElementById("sendImage").src = this.dataURL;

        /*
         $.ajax({
         type: "POST",
         url: "script.php",
         data: {
         imgBase64: _this.dataURL
         }
         }).done(function(o) {
         console.log('saved');
         });
         */
    }

    , removeEvent : function () {

    }

    , destroy : function () {

    }

}