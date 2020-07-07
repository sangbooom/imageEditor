/**
 * Created by user on 2020-06-23.
 */
var imageEditorBtnApply = function () {


}

imageEditorBtnApply.prototype = {
    init : function () {

        this.dataURL = null;

        this.registEvent();
    }

    , registEvent : function () {

        $('#imageEditorApplyBtn').on("click", function(){
            bm.ImageEditorCanvasCon.applyImage();
        });
    }

    , applyImage: function () {
        var imgData = this.ctx.getImageData(0, 0, $('#imageEditorWidthField').val(), $('#imageEditorHeightField').val());

        this.ctx.putImageData(imgData,0 ,0);

        this.dataURL = this.canvas.toDataURL();
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
        $('#imageEditorApplyBtn').off("click");
    }

    , destroy : function () {

    }

}