var imageEditor = {
    toggleBtn: false
    , zoomValue : 100
    , cutWidth : 0
    , cutHeight : 0
    , imgInfo :{}
    , dataURL : null
    , mouseMoveType: null
    , boundInfo: null
    , prevX: 0
    , prevY: 0
    , imgW: 0
    , imgH: 0

    , controlImage: function(type, dir) {
        var _this = this;
        var img = new Image();
        img.src = setCanvas.canvas.toDataURL();
        $(img).on('load', function() {
            var w = $('#width').val();
            var h = $('#height').val();

            switch(type) {
                case "resize":
                    $('#canvas').attr('width', w);
                    $('#canvas').attr('height', h);
                    setCanvas.ctx.drawImage(img, 0, 0, w, h);
                    break;

                case "rotation":
                    $('#canvas').attr('width', w);
                    $('#canvas').attr('height', h);
                    setCanvas.ctx.translate(w / 2, h / 2);
                    if(dir == "left") {
                        setCanvas.ctx.rotate(-Math.PI / 2);
                    } else {
                        setCanvas.ctx.rotate(Math.PI / 2);
                    }

                    setCanvas.ctx.drawImage(img, -h / 2, -w / 2, h, w);
                    break;

                case "flip":
                    _this.clearCanvas();
                    if(dir == "x_flip"){
                        setCanvas.ctx.setTransform(-1,0,0,1,0,0);
                        setCanvas.ctx.drawImage(img, -img.width, 0, w, h);
                    } else {
                        setCanvas.ctx.setTransform(1,0,0,-1,0,0);
                        setCanvas.ctx.drawImage(img, 0, -img.height, w, h);
                    }
                    break;

                case "zoom":     //canvas image zoom quality에 대해 찾아보기
                    _this.clearCanvas();
                    var scale = ( dir == "zoom_in" ? 1.1 : 0.9 );
                    var currentW = Math.round($('#width').val() * scale);
                    var currentH = Math.round($('#height').val() * scale);
                    $('#width').val(currentW);
                    $('#height').val(currentH);
                    $('#canvas').attr('width', currentW);
                    $('#canvas').attr('height', currentH);
                    setCanvas.ctx.setTransform(scale,0,0,scale,0,0);
                    setCanvas.ctx.drawImage(img, 0, 0, w, h);
                    $('#imageRatio').text( (_this.zoomValue += ( dir == "zoom_in" ? ((scale*10)-1) : -((scale*10)+1) ) ) + "%");
                    break;
            }
            $(img).off('load');
        });
    }

    , onMouseMove: function(e) {
        if(imageEditor.mouseMoveType == "move") { // move
            var moveX = e.clientX - imageEditor.prevX;
            var moveY = e.clientY - imageEditor.prevY;

            // console.log("moveX : ", moveX);
            // console.log("moveY : ", moveY);

            $('.cropBox').css({
                left: $('.cropBox').offset().left + moveX,
                top: $('.cropBox').offset().top + moveY
            });
            imageEditor.prevX = e.clientX;
            imageEditor.prevY = e.clientY;

            if($('.cropBox').offset().left < imageEditor.boundInfo.l) {
                $('.cropBox').css({left: imageEditor.boundInfo.l});
            }
            if($('.cropBox').offset().left + $('.cropBox').width() > imageEditor.boundInfo.r) {
                $('.cropBox').css({left: imageEditor.boundInfo.l + ($('#width').val() - $('.cropBox').width())});
            }
            if($('.cropBox').offset().top < imageEditor.boundInfo.t) {
                $('.cropBox').css({top: imageEditor.boundInfo.t});
            }
            if($('.cropBox').offset().top + $('.cropBox').height() > imageEditor.boundInfo.b) {
                $('.cropBox').css({top: imageEditor.boundInfo.t + ($('#height').val() - $('.cropBox').height())});
            }
        } else { // crop
            var currentResizer = e.data.target;


            if(currentResizer.classList.contains("bottom-right")) {
                var w = parseInt($('#width').val(),10) + ( e.clientX - imageEditor.prevX );
                var h = parseInt($('#height').val(),10) + ( e.clientY - imageEditor.prevY );
                $('.cropBox').css({left: $('.cropBox').offset().left });
                $('.cropBox').css({top: $('.cropBox').offset().top });

                if(w > 50 || w < $('#width').val()) {
                    $('.cropBox').css({width: ( e.clientX - imageEditor.boundInfo.l ) });
                }
                if(h > 50 || h < $('#height').val()) {
                    $('.cropBox').css({height: ( e.clientY - imageEditor.boundInfo.t ) });
                }
                //if(h > 50 && h < imageEditor.imgInfo.maxHeight - ( imageEditor.boundInfo.top - imageEditor.imgInfo.top )) {
                //    el.style.height = h + "px";
                //}
                //if(imageEditor.boundInfo.left > imageEditor.imgInfo.left){
                //    el.style.left = imageEditor.boundInfo.left + "px";
                //}
                //if(imageEditor.boundInfo.top > imageEditor.imgInfo.top){
                //    el.style.top = imageEditor.boundInfo.top + "px";
                //}

            } else if (currentResizer.classList.contains("bottom-left")) {
                var w = parseInt($('#width').val(),10) - ( e.clientX - imageEditor.prevX );
                var h = parseInt($('#height').val(),10) + ( e.clientY - imageEditor.prevY );
                $('.cropBox').css({left: $('.cropBox').offset().left });
                $('.cropBox').css({top: $('.cropBox').offset().top });

                if(w > 50 || w < $('#width').val()) {
                    $('.cropBox').css({width: parseInt($('#width').val(),10) - ( e.clientX - imageEditor.prevX ) });
                }
                if(h > 50 || h < $('#height').val()) {
                    $('.cropBox').css({height: parseInt($('#height').val(),10) + (e.clientY - imageEditor.prevY ) });
                }
                //if(imageEditor.boundInfo.top > imageEditor.imgInfo.top){
                //    el.style.top = imageEditor.boundInfo.top + "px";
                //}
                //if(imageEditor.boundInfo.left > imageEditor.imgInfo.left) {
                //    el.style.left = imageEditor.boundInfo.left - (prevX - e.offsetX) + "px";
                //}
            } else if (currentResizer.classList.contains("top-right")) {
                var w = imageEditor.boundInfo.width  - (imageEditor.prevX - e.offsetX);
                var h = imageEditor.boundInfo.height + (imageEditor.prevY - e.offsetY);
                if(w > imageEditor.imgInfo.minWidth && w < imageEditor.imgInfo.maxWidth - ( imageEditor.boundInfo.left - imageEditor.imgInfo.left)) {
                    el.style.width = w + "px";
                }
                if(h > imageEditor.imgInfo.minHeight && h < imageEditor.imgInfo.maxHeight - ( imageEditor.imgInfo.bottom - imageEditor.boundInfo.bottom )) {
                    el.style.height = h + "px";
                }
                if(imageEditor.boundInfo.top > imageEditor.imgInfo.top) {
                    el.style.top = imageEditor.boundInfo.y - (imageEditor.prevY - e.offsetY) + "px";
                }
                if(imageEditor.boundInfo.left > imageEditor.imgInfo.left){
                    el.style.left = imageEditor.boundInfo.left + "px";
                }
            } else if (currentResizer.classList.contains("top-left")) {
                var w = imageEditor.boundInfo.width + (imageEditor.prevX - e.offsetX);
                var h = imageEditor.boundInfo.height + (imageEditor.prevY - e.offsetY);
                if(w > imageEditor.imgInfo.minWidth && w < imageEditor.imgInfo.maxWidth - ( imageEditor.imgInfo.right - imageEditor.boundInfo.right )) {
                    el.style.width = w + "px";
                }
                if(h > imageEditor.imgInfo.minHeight && h < imageEditor.imgInfo.maxHeight - ( imageEditor.imgInfo.bottom - imageEditor.boundInfo.bottom )) {
                    el.style.height = h + "px";
                }
                if(imageEditor.boundInfo.top > imageEditor.imgInfo.top) {
                    el.style.top = imageEditor.boundInfo.top - (imageEditor.prevY - e.offsetY) + "px";
                }
                if(imageEditor.boundInfo.left > imageEditor.imgInfo.left){
                    el.style.left = imageEditor.boundInfo.left - (prevX - e.offsetX) + "px";
                }

                imageEditor.prevX = e.clientX;
                imageEditor.prevY = e.clientY;

                //if(imageEditor.boundInfo.top + imageEditor.boundInfo.height > imageEditor.imgInfo.bottom){
                //    console.log("b");
                //    el.style.top = 545 + (imageEditor.prevY - e.offsetY) + "px";
                //}
                //if(imageEditor.boundInfo.left + imageEditor.boundInfo.width > imageEditor.imgInfo.right){
                //    console.log("r");
                //    el.style.left = 720 + (imageEditor.prevX - e.offsetX) + "px";
                //}
            }
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
        setCanvas.ctx.clearRect(0, 0, setCanvas.canvas.width, setCanvas.canvas.height);
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

        //this.imgInfo.minWidth = 50;
        //this.imgInfo.minHeight = 50;
        //this.imgInfo.left = $('.cropBox')[0].offsetLeft; //(1160 - $('.cropBox')[0].offsetWidth) / 2;
        //this.imgInfo.top = $('.cropBox')[0].offsetTop; //(792 - $('.cropBox')[0].offsetHeight) / 2;
        //this.imgInfo.right = $('.cropBox')[0].offsetLeft + $('.cropBox').width();
        //this.imgInfo.bottom = $('.cropBox')[0].offsetTop + $('.cropBox').height();

        $('#imageCrop').on('click', function(){
            var x = $('.cropBox').offset().left - $('#canvas').offset().left;
            var y = $('.cropBox').offset().top - $('#canvas').offset().top;
            var w = $('.cropBox').width();
            var h = $('.cropBox').height();

            console.log("x: " + x + "/ y: " + y);

            var currentImageData = setCanvas.ctx.getImageData(x, y, w, h);
            setCanvas.ctx.clearRect(0, 0, setCanvas.canvas.width, setCanvas.canvas.height); // 원래 상태 지우기
            setCanvas.ctx.clearRect(-setCanvas.canvas.height / 2, -setCanvas.canvas.width / 2, setCanvas.canvas.height, setCanvas.canvas.width); //rotate시 지우기
            setCanvas.ctx.clearRect(-setCanvas.canvas.width, 0,setCanvas.canvas.width, setCanvas.canvas.height); //좌우 반전시 지우기
            setCanvas.ctx.clearRect(0, -setCanvas.canvas.height, setCanvas.canvas.width, setCanvas.canvas.height); //상하 반전시 지우기
            setCanvas.ctx.putImageData(currentImageData, (setCanvas.canvas.width - w) / 2, (setCanvas.canvas.height - h) / 2);
            $('.cropBox').css("left", (setCanvas.canvas.width - w) / 2 + "px");
            $('.cropBox').css("top", (setCanvas.canvas.height - h) / 2 + "px");


            /*
             _this.clearCanvas();

             if(_this.angleCount % 2 == 1){
             _this.cutWidth = $('.cropBox')[0].offsetWidth;
             _this.cutHeight = $('.cropBox')[0].offsetHeight;

             $('#width').val(_this.cutHeight);
             $('#height').val(_this.cutWidth);

             _this.ctx.drawImage(_this.editImg
             , $('.cropBox')[0].offsetTop - _this.imgInfo.top
             , $('.cropBox')[0].offsetLeft - _this.imgInfo.left
             , $('.cropBox')[0].offsetHeight
             , $('.cropBox')[0].offsetWidth
             , -$('.cropBox')[0].offsetHeight / 2
             , -$('.cropBox')[0].offsetWidth / 2
             , $('.cropBox')[0].offsetHeight
             , $('.cropBox')[0].offsetWidth);
             } else {
             _this.cutWidth = $('.cropBox')[0].offsetWidth;
             _this.cutHeight = $('.cropBox')[0].offsetHeight;

             $('#width').val(_this.cutWidth);
             $('#height').val(_this.cutHeight);

             _this.ctx.drawImage(_this.editImg
             , $('.cropBox')[0].offsetLeft - _this.imgInfo.left
             , $('.cropBox')[0].offsetTop - _this.imgInfo.top
             , $('.cropBox')[0].offsetWidth
             , $('.cropBox')[0].offsetHeight
             , -$('.cropBox')[0].offsetWidth / 2
             , -$('.cropBox')[0].offsetHeight / 2
             , $('.cropBox')[0].offsetWidth
             , $('.cropBox')[0].offsetHeight);
             */
            //}

            //$('#imageCrop').css("display","none");
            //$('.cropBox').css("display","none");
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
        var output = setCanvas.ctx.getImageData(0, 0, w, h); //this.ctx.createImageData(w, h);
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

    , getFilterBright: function (imgData, value, type) {
        var d = imgData.data;
        this.clearCanvas();

        var value = (parseInt($('#brightness').val(),10) * 30);
        for(var i=0; i< d.length; i+=4) {
            d[i] += value;
            d[i+1] += value;
            d[i+2] += value;
        }

        return imgData;
    }

    , setFilterBright: function (type) {
        var imgData = setCanvas.ctx.getImageData(0, 0, setCanvas.canvas.width, setCanvas.canvas.height);
        var filteredData = this.getFilterBright(imgData, 100 , type);
        setCanvas.ctx.putImageData(filteredData, 0, 0);
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
        var imgData = setCanvas.ctx.getImageData(0, 0, setCanvas.canvas.width, setCanvas.canvas.height);
        var filteredData = this.getFilterContrast(imgData, parseInt($('#contrast').val(),10) );
        setCanvas.ctx.putImageData(filteredData, 0, 0);
    }

    , zoom: function(dir) {
        this.controlImage("zoom",dir);

        return ;
    }

    , reset: function(){
        this.clearCanvas();
        this.imgW = setCanvas.editImg.width;
        this.imgH = setCanvas.editImg.height;
        $('#canvas').attr('width', this.imgW);
        $('#canvas').attr('height', this.imgH);
        setCanvas.ctx.drawImage(setCanvas.editImg, 0, 0);
        $('#width').val(this.imgW);
        $('#height').val(this.imgH);

        this.zoomValue = 100;
        $('#imageRatio').text( this.zoomValue + "%");

    }

    , saveImage: function () {
        var _this = this;
        var imgData = setCanvas.ctx.getImageData(0, 0, $('#width').val(), $('#height').val());

        setCanvas.ctx.putImageData(imgData,0 ,0);

        _this.dataURL = setCanvas.canvas.toDataURL();
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