var imageEditor = {
    canvas: null
    , ctx: null
    , editImg: null
    , toggleBtn: false
    , zoomValue : 100
    , cutWidth : 0
    , cutHeight : 0
    , imgInfo :{}
    , dataURL : null
    , mouseMoveType: null
    , boundInfo: {}
    , prevX: 0
    , prevY: 0
    , imgW: 0
    , imgH: 0


    , currentImg: null

    , init: function() {
        this.canvas = $('#canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.editImg = new Image();
        this.loadImage('../img/facility_3.png');
    }

    , loadImage: function(path) {
        var _this = this;

        $(_this.editImg).on('load', function(){
            _this.imgW = _this.editImg.width; //imgW, imgH 각각 초기 이미지 넓이 높이로 초기화
            _this.imgH = _this.editImg.height;
            $('#canvas').attr('width', _this.imgW); //캔버스 넓이 높이를 초기 이미지넓이 높이로 변경
            $('#canvas').attr('height', _this.imgH);
            _this.ctx.drawImage(_this.editImg, 0, 0);
            $('#width').val(_this.imgW);
            $('#height').val(_this.imgH);
            $(_this.editImg).off('load');

            _this.registEvent();
        });
        _this.editImg.src = path;
    }

    , registEvent: function() {
        var _this = this;

        $('#show_width').on('click', function () {
            _this.reSize();
        });

        $('#show_height').on('click', function () {
            _this.reSize();
        });

        $("#width").on('focus', function() {
            $(this).select();
        });

        $("#height").on('focus', function() {
            $(this).select();
        });

        $("#width").keydown(function(key) {
            if(key.keyCode == "13") _this.reSize();
        });

        $("#height").keydown(function(key) {
            if(key.keyCode == "13") _this.reSize();
        });

        $('#toggle').on('click', function() {
            _this.onToggle();
        });

        $('#left').on('click', function () {
            _this.setRotation("left");
        });

        $('#right').on('click', function () {
            _this.setRotation("right");
        });

        $('#x_flip').on('click', function() {
            _this.setFlip("x_flip");
        });

        $('#y_flip').on('click', function() {
            _this.setFlip("y_flip");
        });

        $('#crop').on('click', function() {
            _this.crop();
        });

        $('#brightness').on('input',function(){
            var w = $('#width').val();
            var h = $('#height').val();

            _this.ctx.drawImage(_this.editImg, 0, 0, w, h);

            _this.setFilterBright();

            var _this = this;
            var img2 = new Image();
            img2.src = imageEditor.canvas.toDataURL();
            $(img2).on('load', function() {
                var w = $('#width').val();
                var h = $('#height').val();
                imageEditor.ctx.setTransform(1,0,0,1,0,0);
                imageEditor.ctx.drawImage(img2, 0, 0, w, h); //이걸 바꿔야됨

                imageEditor.setFilterBright();
            });
        });

        $('#contrast').on('input', function(){
            var w = $('#width').val();
            var h = $('#height').val();

            console.log(_this.currentImg);

            //_this.clearCanvas();

            _this.ctx.drawImage(_this.currentImg, 0, 0, w, h);

            //_this.setFilterContrast();
        });

        $('#blur').on('input', function(){
            var imgData = _this.ctx.getImageData(0,0, _this.canvas.width, _this.canvas.height);
            var filteredData = _this.setFilterBlur(imgData, 90);

            _this.ctx.putImageData(filteredData, 0 , 0);
        });

        $('#sharpen').on('input', function() {
            var imgData = _this.ctx.getImageData(0,0, _this.canvas.width, _this.canvas.height);
            var filteredData = _this.sharpen(imgData);

            _this.ctx.putImageData(filteredData, 0 , 0);
        });

        $('#zoom_in').on('click', function () {
            _this.zoom("zoom_in");
        });

        $('#zoom_out').on('click', function () {
            _this.zoom("zoom_out");
        });

        $('#imageReturn').on('click', function() {
            _this.reset();
        });

        $('.cropBox').on('mousedown', function(e) {
            var w = parseInt($('#width').val(),10);
            var h = parseInt($('#height').val(),10);

            _this.boundInfo = $('#canvas')[0].getBoundingClientRect();

            _this.prevX = e.clientX;
            _this.prevY = e.clientY;

            if($(e.target).hasClass("cropBox")) {
                _this.mouseMoveType = "move";
            } else {
                _this.mouseMoveType = "crop";
            }

            $(window).on('mousemove', {target: e.target, prevX: e.offsetX, prevY: e.offsetY}, _this.onMouseMove);

            $('.cropBox').on('mouseup', function() {
                $(window).off('mousemove');
                $('.cropBox').off('mouseup');
            });
        });

        $('#imageSave').on("click", function(){
            _this.saveImage();
        });
    }

    , controlImage: function(type, dir) {
        var _this = this;
        this.currentImg = new Image();
        this.currentImg.src = this.canvas.toDataURL();
        $(this.currentImg).on('load', function() {
            var w = $('#width').val();
            var h = $('#height').val();

            switch(type) {
                case "resize":
                    $('#canvas').attr('width', w);
                    $('#canvas').attr('height', h);
                    //_this.ctx.imageSmoothingQuality = "high";
                    //_this.ctx.imageSmoothingEnabled = false;
                    _this.ctx.drawImage(this.currentImg, 0, 0, w, h);
                    break;

                case "rotation":
                    $('#canvas').attr('width', w);
                    $('#canvas').attr('height', h);
                    _this.ctx.translate(w / 2, h / 2);
                    if(dir == "left") {
                        _this.ctx.rotate(-Math.PI / 2);
                    } else {
                        _this.ctx.rotate(Math.PI / 2);
                    }
                    _this.ctx.translate(-h / 2, -w / 2);


                    _this.ctx.drawImage(this, 0, 0, h, w);
                    break;

                case "flip":
                    _this.clearCanvas();
                    if(dir == "x_flip"){
                        _this.ctx.setTransform(-1,0,0,1,0,0);
                        _this.ctx.drawImage(this, -this.width, 0, w, h);
                    } else {
                        _this.ctx.setTransform(1,0,0,-1,0,0);
                        _this.ctx.drawImage(this, 0, -this.height, w, h);
                    }
                    break;

                case "zoom":     //canvas image quality에 대해 찾아보기
                    _this.clearCanvas();
                    var scale = ( dir == "zoom_in" ? 1.1 : 0.9 );
                    var currentW = Math.round($('#width').val() * scale);
                    var currentH = Math.round($('#height').val() * scale);
                    $('#width').val(currentW);
                    $('#height').val(currentH);
                    $('#canvas').attr('width', currentW);
                    $('#canvas').attr('height', currentH);
                    _this.ctx.setTransform(scale,0,0,scale,0,0);
                    _this.ctx.drawImage(img, 0, 0, w, h);
                    $('#imageRatio').text( (_this.zoomValue += ( dir == "zoom_in" ? ((scale*10)-1) : -((scale*10)+1) ) ) + "%");
                    break;
            }
            $(this).off('load');
        });
    }

    , onMouseMove: function(e) {
        var rect = $('.cropBox')[0].getBoundingClientRect();

        if(imageEditor.mouseMoveType == "move") { // move
            var moveX = e.clientX - imageEditor.prevX;
            var moveY = e.clientY - imageEditor.prevY;

            // console.log("moveX : ", moveX);
            // console.log("moveY : ", moveY);

            $('.cropBox').css({
                left: $('.cropBox').offset().left + moveX,
                top: $('.cropBox').offset().top + moveY
            });

            if( rect.left < imageEditor.boundInfo.left) {
                $('.cropBox').css({left: imageEditor.boundInfo.left});
            }
            if( rect.left + rect.width > imageEditor.boundInfo.right) {
                $('.cropBox').css({left: imageEditor.boundInfo.left + ( imageEditor.boundInfo.width - rect.width )});
            }
            if( rect.top < imageEditor.boundInfo.top) {
                $('.cropBox').css({top: imageEditor.boundInfo.top});
            }
            if( rect.top + rect.height > imageEditor.boundInfo.bottom) {
                $('.cropBox').css({top: imageEditor.boundInfo.top + ( imageEditor.boundInfo.height - rect.height )});
            }
            imageEditor.prevX = e.clientX;
            imageEditor.prevY = e.clientY;

        } else { // crop
            var currentResizer = e.data.target;

            var moveX = ( e.clientX - imageEditor.prevX );
            var moveY = ( e.clientY - imageEditor.prevY );

            var minSize = 50;

            if(currentResizer.classList.contains("bottom-right")) {

                $('.cropBox').css({ left: rect.left, top: rect.top });

                if( rect.left + rect.width > imageEditor.boundInfo.right ){
                    $('.cropBox').css({width: rect.width -1 });
                } else if( rect.width + moveX  > minSize ){
                    $('.cropBox').css({width: rect.width + moveX });
                }

                if( rect.top + rect.height > imageEditor.boundInfo.bottom ){
                    $('.cropBox').css({height: rect.height -1 });
                } else if( rect.height + moveY > minSize){
                    $('.cropBox').css({height: rect.height + moveY });
                }

            } else if (currentResizer.classList.contains("bottom-left")) {

                $('.cropBox').css({top: rect.top });

                if( imageEditor.boundInfo.left + rect.width > imageEditor.boundInfo.right - (imageEditor.boundInfo.right - rect.right ) ){
                    $('.cropBox').css({ left: imageEditor.boundInfo.left });
                    $('.cropBox').css({ width: rect.width - 1 });
                } else if( rect.width - moveX  > minSize){
                    $('.cropBox').css({ width: rect.width - moveX });
                    $('.cropBox').css({ left: rect.left + moveX });
                }

                if( imageEditor.boundInfo.top + rect.height > imageEditor.boundInfo.bottom - (rect.top - imageEditor.boundInfo.top) ){
                    $('.cropBox').css({ height : rect.height - 1 });
                } else if( rect.height + moveY > minSize){
                    $('.cropBox').css({ height: rect.height + moveY });
                }

            } else if (currentResizer.classList.contains("top-right")) {

                $('.cropBox').css({ left: rect.left });

                if( true){
                    //여기부터
                } else if( rect.width + moveX  > minSize){
                    $('.cropBox').css({width: rect.width + moveX });
                }
                if( rect.height - moveY > minSize){
                    $('.cropBox').css({top: rect.top + moveY });
                    $('.cropBox').css({height: rect.height - moveY });
                }

            } else if (currentResizer.classList.contains("top-left")) {
                if( rect.width - moveX > minSize) {
                    $('.cropBox').css({ width : rect.width - moveX });
                    $('.cropBox').css({ left: rect.left + moveX});
                }
                if( rect.height - moveY > minSize) {
                    $('.cropBox').css({ height: rect.height - moveY });
                    $('.cropBox').css({top: rect.top + moveY });
                }
            }
            imageEditor.prevX = e.clientX;
            imageEditor.prevY = e.clientY;
        }
    }

    , reSize: function() {
        this.controlImage("resize");
        return;
    }

    , onToggle: function(){
        this.toggleBtn = !this.toggleBtn;
        $('#apply input').attr('disabled', this.toggleBtn);
    }

    , clearCanvas: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //_this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height); // 원래 상태 지우기
        //_this.ctx.clearRect(-_this.canvas.height / 2, -_this.canvas.width / 2, _this.canvas.height, _this.canvas.width); //rotate시 지우기
        //_this.ctx.clearRect(-_this.canvas.width, 0, _this.canvas.width, _this.canvas.height); //좌우 반전시 지우기
        //_this.ctx.clearRect(0, -_this.canvas.height, _this.canvas.width, _this.canvas.height); //상하 반전시 지우기
        return;
    }

    , setRotation: function(dir) { // 좌우측 로테이션
        var w = $('#width').val();
        var h = $('#height').val();
        $('#width').val(h);
        $('#height').val(w);

        this.controlImage("rotation", dir);
        return;
    }

    , setFlip: function(dir) {

        this.controlImage("flip", dir);
        return;
    }

    , crop: function(dir){
        var _this = this;

        $('.cropBox').css({
            "width": parseInt($('#width').val(),10) + "px",
            "height": parseInt($('#height').val(),10) + "px",
            "display": "inline-block"
        });

        $('#imageCrop').css("display","inline-block");

        if(_this.angleCount % 2 == 1){
            this.imgInfo.maxWidth = parseInt($('#height').val(),10);
            this.imgInfo.maxHeight = parseInt($('#width').val(),10);
        } else {
            this.imgInfo.maxWidth = parseInt($('#width').val(),10);
            this.imgInfo.maxHeight = parseInt($('#height').val(),10);
        }

        $('#imageCrop').on('click', function(){
            var rect = $('.cropBox')[0].getBoundingClientRect();

            var currentImageData = _this.ctx.getImageData( rect.x - _this.boundInfo.x , rect.y - _this.boundInfo.y , rect.width, rect.height);

            $('#canvas').attr("width", rect.width + "px");
            $('#canvas').attr("height", rect.height + "px");

            _this.ctx.putImageData(currentImageData, 0,0 );

            $('.cropBox').css("left", _this.boundInfo.x + (_this.boundInfo.width - rect.width) / 2 + "px");
            $('.cropBox').css("top", _this.boundInfo.y + (_this.boundInfo.height - rect.height) / 2 + "px");


        });
    }

    , convolution: function(imgData, weights, opaque) {
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);
        var src = imgData.data;
        var sw = imgData.width;
        var sh = imgData.height;
        var w = sw;
        var h = sh;
        var output = this.ctx.getImageData(0, 0, w, h); //this.ctx.createImageData(w, h);
        var dst = output.data;
        var alphaFac = opaque ? 1 : 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var sy = y;
                var sx = x;
                var dstOff = (y * w + x) * 4;
                var r = 0, g = 0, b = 0, a = 0;
                for (var cy = 0; cy < side; cy++) {
                    for (var cx = 0; cx < side; cx++) {
                        var scy = sy + cy - halfSide;
                        var scx = sx + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcOff = (scy * sw + scx) * 4;
                            var wt = weights[cy * side + cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                            a += src[srcOff + 3] * wt;
                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff + 1] = g;
                dst[dstOff + 2] = b;
                dst[dstOff + 3] = a + alphaFac * (255 - a);
            }
        }
        return output;
    }

    , sharpen: function(imgData){
        return this.convolution(imgData,
            [ 0, -1,  0,
                -1, 5, -1,
                0, -1,  0 ], 0);
    }

    , setFilterBlur: function (imgData, value) {
        var offset = 1/(value/10);
        return this.convolution(imgData,
            [ offset, offset, offset,
                offset, offset, offset,
                offset, offset, offset ], 0);
    }

    , setFilterBright: function () {
        var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var brightness = parseInt($('#brightness').val());
        var filteredData = this.getFilterBright(imgData, brightness);
        this.ctx.putImageData(filteredData, 0, 0);
    }

    , getFilterBright: function (imgData, value) {
        var d = imgData.data;
        this.clearCanvas();

        for(var i=0; i< d.length; i+=4) {
            d[i] += 255 * (value / 100);
            d[i+1] += 255 * (value / 100);
            d[i+2] += 255 * (value / 100);
        }

        return imgData;
    }

    , getFilterContrast: function(imgData, contrast) {
        var d = imgData.data;
        contrast *= 2.55;
        var factor = (255 + contrast) / (255.01 - contrast);

        for(var i=0;i<d.length;i+=4)
        {
            d[i] = factor * (d[i] - 128) + 128;
            d[i+1] = factor * (d[i+1] - 128) + 128;
            d[i+2] = factor * (d[i+2] - 128) + 128;
        }
        return imgData;
    }

    , setFilterContrast: function(){
        var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var filteredData = this.getFilterContrast(imgData, parseInt($('#contrast').val(),10) );
        this.ctx.putImageData(filteredData, 0, 0);
    }



    , zoom: function(dir) {
        this.controlImage("zoom",dir);

        return ;
    }

    , reset: function(){
        this.clearCanvas();
        this.imgW = this.editImg.width;
        this.imgH = this.editImg.height;
        $('#canvas').attr('width', this.imgW);
        $('#canvas').attr('height', this.imgH);
        this.ctx.drawImage(this.editImg, 0, 0);
        $('#width').val(this.imgW);
        $('#height').val(this.imgH);

        this.zoomValue = 100;
        $('#imageRatio').text( this.zoomValue + "%");

    }

    , saveImage: function () {
        var _this = this;
        var imgData = _this.ctx.getImageData(0, 0, $('#width').val(), $('#height').val());

        _this.ctx.putImageData(imgData,0 ,0);

        _this.dataURL = _this.canvas.toDataURL();
        console.log(_this.dataURL);
        document.getElementById("sendImage").src = _this.dataURL;

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
}

$(function() {
    imageEditor.init();
});
