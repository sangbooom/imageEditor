var imageEditor = {

    init: function () {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');

        var editImg = new Image();
        editImg.onload = function(){
            canvas.width = 400;
            canvas.height = 266;
            ctx.drawImage(editImg, 0, 0, editImg.width, editImg.height,0,0,400,266);
        };
        editImg.src = '../img/facility_3.png';
    }
    , registEvent: function() {
        var _this = this;

        $('#show_width').on('click', function () {
            _this.reSize();
        });

    }
    , reSize: function() {

        $('#width').val(editImg.width);

        var h = editImg.height;
        $('#height').val(h);
    }

}

$(function(){
    imageEditor.init();
});
