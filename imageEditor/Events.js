var Events = function(){

    $('#show_width').on('click', function () {
        imageEditor.reSize();
    });

    $('#show_height').on('click', function () {
        imageEditor.reSize();
    });

    $("#width").on('focus', function() {
        $(this).select();
    });

    $("#height").on('focus', function() {
        $(this).select();
    });

    $("#width").keydown(function(key) {
        if(key.keyCode == "13") imageEditor.reSize();
    });

    $("#height").keydown(function(key) {
        if(key.keyCode == "13") imageEditor.reSize();
    });

    $('#toggle').on('click', function() {
        imageEditor.onToggle();
    });

    $('#left').on('click', function () {
        imageEditor.setRotation("left");
    });

    $('#right').on('click', function () {
        imageEditor.setRotation("right");
    });

    $('#x_flip').on('click', function() {
        imageEditor.setFlip("x_flip");
    });

    $('#y_flip').on('click', function() {
        imageEditor.setFlip("y_flip");
    });

    $('#crop').on('click', function() {
        imageEditor.crop();
    });

    $('#sharpen').on('input', function() {
        var imgData = setCanvas.ctx.getImageData(0,0, setCanvas.canvas.width, setCanvas.canvas.height);
        var filteredData = imageEditor.sharpen(imgData);

        setCanvas.ctx.putImageData(filteredData, 0 , 0);
    });

    $('#brightness').on('input',function(){
        imageEditor.setFilterBright();
    });

    $('#plus').on('click',function(){
        imageEditor.setFilterBright("plus");
    });

    $('#minus').on('click',function(){
        imageEditor.setFilterBright("minus");
    });

    $('#blur').on('input', function(){
        var imgData = setCanvas.ctx.getImageData(0,0, setCanvas.canvas.width, setCanvas.canvas.height);
        var filteredData = imageEditor.setFilterBlur(imgData, 90);

        setCanvas.ctx.putImageData(filteredData, 0 , 0);
    });

    $('#contrast').on('click', function(){
        imageEditor.setFilterContrast();
    });

    $('#zoom_in').on('click', function () {
        imageEditor.zoom("zoom_in");
    });

    $('#zoom_out').on('click', function () {
        imageEditor.zoom("zoom_out");
    });

    $('#imageReturn').on('click', function() {
        imageEditor.reset();
    });

    $('.cropBox').on('mousedown', function(e) {
        var w = parseInt($('#width').val(),10);
        var h = parseInt($('#height').val(),10);

        imageEditor.boundInfo = {
            l: ( $('#img_con')[0].clientWidth - w ) / 2 ,
            t: $('#img_con')[0].offsetTop + ( $('#img_con')[0].offsetHeight - h ) / 2 ,
            r: ( $('#img_con')[0].clientWidth - w ) / 2 + w ,
            b: $('#img_con')[0].offsetTop + ( $('#img_con')[0].offsetHeight - h ) / 2 + h
        };

        imageEditor.prevX = e.clientX;
        imageEditor.prevY = e.clientY;

        if($(e.target).hasClass("cropBox")) {
            imageEditor.mouseMoveType = "move";
        } else {
            imageEditor.mouseMoveType = "crop";
        }

        $(window).on('mousemove', {target: e.target, prevX: e.offsetX, prevY: e.offsetY}, imageEditor.onMouseMove);

        $('.cropBox').on('mouseup', function() {
            $(window).off('mousemove');
            $('.cropBox').off('mouseup');
        })  ;
    });

    $('#imageSave').on("click", function(){
        imageEditor.saveImage();
    });
}