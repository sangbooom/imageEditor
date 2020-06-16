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
    , boundInfo: null
    , prevX: 0
    , prevY: 0
    , imgW: 0
    , imgH: 0

    , init: function() {
        this.canvas = $('#canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.editImg = new Image();

        this.loadImage('../여기서해라/2003_psb_test/img/facility_3.png');
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

        $('#sharpen').on('input', function() {
            var imgData = _this.ctx.getImageData(0,0, _this.canvas.width, _this.canvas.height);
            var filteredData = _this.sharpen(imgData);

            _this.ctx.putImageData(filteredData, 0 , 0);
        });

        $('#brightness').on('input',function(){
            _this.setFilterBright();
        });

        $('#plus').on('click',function(){
            _this.setFilterBright("plus");
        });

        $('#minus').on('click',function(){
            _this.setFilterBright("minus");
        });


        $('#blur').on('input', function(){
            var imgData = _this.ctx.getImageData(0,0, _this.canvas.width, _this.canvas.height);
            var filteredData = _this.setFilterBlur(imgData, 90);

            _this.ctx.putImageData(filteredData, 0 , 0);
        });
        

        $('#contrast').on('click', function(){
            _this.setFilterContrast();
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


        var el = document.querySelector(".select_box");
        var isResizing = false;

        $('.select_box').on('mousedown', function(e) {
           //_this.boundInfo = {l: 385, t: 330, r: 770, b: 594};
           var w = parseInt($('#width').val(),10);
           var h = parseInt($('#height').val(),10);
            _this.boundInfo = {
                l: ( $('#img_con')[0].clientWidth - w ) / 2 , 
                t: $('#img_con')[0].offsetTop + ( $('#img_con')[0].offsetHeight - h ) / 2 , 
                r: ( $('#img_con')[0].clientWidth - w ) / 2 + w , 
                b: $('#img_con')[0].offsetTop + ( $('#img_con')[0].offsetHeight - h ) / 2 + h
            };

            console.log(_this.boundInfo);
            
            _this.prevX = e.clientX;
            _this.prevY = e.clientY;

            if($(e.target).hasClass("select_box")) {
                _this.mouseMoveType = "move";
            } else {
                _this.mouseMoveType = "crop";
            }

            $(window).on('mousemove', {target: e.target, prevX: e.offsetX, prevY: e.offsetY}, _this.onMouseMove);
            $('.select_box').on('mouseup', function() {
                $(window).off('mousemove');
                $('.select_box').off('mouseup');
            })  ;
        });

        
        /*var resizers = document.querySelectorAll(".resizer");
        var currentResizer;

        resizers.forEach(function(resizer){ //resize
            //resizer.addEventListener('mousedown', mousedown);
            function mousedown(e){
                e.stopPropagation();
                console.log("resizer down");
                currentResizer = e.target;
                isResizing = true;

                var prevX = e.offsetX;
                var prevY = e.offsetY;

                resizer.addEventListener("mousemove", mousemove);
                window.addEventListener("mouseup", mouseup);

                function mousemove(e) {
                    console.log("move!!!")
                    var rect = el.getBoundingClientRect();
                    //console.log(rect);

                    if(currentResizer.classList.contains("bottom-right")) {
                        var w = rect.width - (prevX - e.offsetX);
                        var h = rect.height - (prevY - e.offsetY);

                        if(w > _this.imgInfo.minWidth && w < _this.imgInfo.maxWidth - ( rect.left - _this.imgInfo.left)) {
                            el.style.width = w + "px";
                        }
                        if(h > _this.imgInfo.minHeight && h < _this.imgInfo.maxHeight - ( rect.top - _this.imgInfo.top )) {
                            el.style.height = h + "px";
                        }
                        if(rect.left > _this.imgInfo.left){
                            el.style.left = rect.left + "px";
                        }
                        if(rect.top > _this.imgInfo.top){
                            el.style.top = rect.top + "px";
                        }

                    } else if (currentResizer.classList.contains("bottom-left")) {
                        var w = rect.width + (prevX - e.offsetX);
                        var h = rect.height - (prevY - e.offsetY);
                        if(w > _this.imgInfo.minWidth && w < _this.imgInfo.maxWidth - ( _this.imgInfo.right - rect.right)) {
                            el.style.width = w + "px";
                        }
                        if(h > _this.imgInfo.minHeight && h < _this.imgInfo.maxHeight - ( rect.top - _this.imgInfo.top )) {
                            el.style.height = h + "px";
                        }
                        if(rect.top > _this.imgInfo.top){
                            el.style.top = rect.top + "px";
                        }
                        if(rect.left > _this.imgInfo.left) {
                            el.style.left = rect.left - (prevX - e.offsetX) + "px";
                        }
                    } else if (currentResizer.classList.contains("top-right")) {
                        var w = rect.width  - (prevX - e.offsetX);
                        var h = rect.height + (prevY - e.offsetY);
                        if(w > _this.imgInfo.minWidth && w < _this.imgInfo.maxWidth - ( rect.left - _this.imgInfo.left)) {
                            el.style.width = w + "px";
                        }
                        if(h > _this.imgInfo.minHeight && h < _this.imgInfo.maxHeight - ( _this.imgInfo.bottom - rect.bottom )) {
                            el.style.height = h + "px";
                        }
                        if(rect.top > _this.imgInfo.top) {
                            el.style.top = rect.y - (prevY - e.offsetY) + "px";
                        }
                        if(rect.left > _this.imgInfo.left){
                            el.style.left = rect.left + "px";
                        }
                    } else if (currentResizer.classList.contains("top-left")) {
                        var w = rect.width + (prevX - e.offsetX);
                        var h = rect.height + (prevY - e.offsetY);
                        if(w > _this.imgInfo.minWidth && w < _this.imgInfo.maxWidth - ( _this.imgInfo.right - rect.right )) {
                            el.style.width = w + "px";
                        }
                        if(h > _this.imgInfo.minHeight && h < _this.imgInfo.maxHeight - ( _this.imgInfo.bottom - rect.bottom )) {
                            el.style.height = h + "px";
                        }
                        if(rect.top > _this.imgInfo.top) {
                            el.style.top = rect.top - (prevY - e.offsetY) + "px";
                        }
                        if(rect.left > _this.imgInfo.left){
                            el.style.left = rect.left - (prevX - e.offsetX) + "px";
                        }
                        //if(w == _this.imgInfo.minWidth){
                        //    console.log("1212");
                        //    el.style.top = rect.top - (prevY - e.offsetY) + "px";
                        //}

                        if(rect.top + rect.height > _this.imgInfo.bottom){
                            console.log("b");
                            el.style.top = 545 + (prevY - e.offsetY) + "px";
                        }
                        if(rect.left + rect.width > _this.imgInfo.right){
                            console.log("r");
                            el.style.left = 720 + (prevX - e.offsetX) + "px";
                        }
                    }

                }

                function mouseup() {
                    resizer.removeEventListener("mousemove", mousemove);
                    window.removeEventListener("mouseup", mouseup);
                    isResizing = false;
                }
            }
        })*/

        $('#imageSave').on("click", function(){
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
        });
    }

    , controlImage: function(type, dir) {
        var _this = this;
        var img = new Image();
        img.src = this.canvas.toDataURL();
        $(img).on('load', function() {
            var w = $('#width').val();
            var h = $('#height').val();

            switch(type) {
                case "resize":
                    $('#canvas').attr('width', w);
                    $('#canvas').attr('height', h);
                    _this.ctx.drawImage(img, 0, 0, w, h);
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

                    _this.ctx.drawImage(img, -h / 2, -w / 2, h, w);
                    break;

                case "flip":
                    _this.clearCanvas();
                    if(dir == "x_flip"){
                        _this.ctx.setTransform(-1,0,0,1,0,0);
                        _this.ctx.drawImage(img, -img.width, 0, w, h);
                    } else {
                        _this.ctx.setTransform(1,0,0,-1,0,0);
                        _this.ctx.drawImage(img, 0, -img.height, w, h);
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
                    _this.ctx.setTransform(scale,0,0,scale,0,0);
                    _this.ctx.drawImage(img, 0, 0, w, h);
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
            
            $('.select_box').css({
                left: $('.select_box').offset().left + moveX,
                top: $('.select_box').offset().top + moveY
            });
            imageEditor.prevX = e.clientX;
            imageEditor.prevY = e.clientY;

            if($('.select_box').offset().left < imageEditor.boundInfo.l) {
                $('.select_box').css({left: imageEditor.boundInfo.l});
            }
            if($('.select_box').offset().left + $('.select_box').width() > imageEditor.boundInfo.r) {
                $('.select_box').css({left: imageEditor.boundInfo.l + ($('#width').val() - $('.select_box').width())});
            }
            if($('.select_box').offset().top < imageEditor.boundInfo.t) {
                $('.select_box').css({top: imageEditor.boundInfo.t});
            }
            if($('.select_box').offset().top + $('.select_box').height() > imageEditor.boundInfo.b) {
                $('.select_box').css({top: imageEditor.boundInfo.t + ($('#height').val() - $('.select_box').height())});
            }
        } else { // crop
            var currentResizer = e.data.target;

            if(currentResizer.classList.contains("bottom-right")) {
                var w = rect.width - (imageEditor.prevX - e.offsetX);
                var h = rect.height - (imageEditor.prevY - e.offsetY);

                if(w > imageEditor.imgInfo.minWidth && w < imageEditor.imgInfo.maxWidth - ( rect.left - imageEditor.imgInfo.left)) {
                    el.style.width = w + "px";
                }
                if(h > imageEditor.imgInfo.minHeight && h < imageEditor.imgInfo.maxHeight - ( rect.top - imageEditor.imgInfo.top )) {
                    el.style.height = h + "px";
                }
                if(rect.left > imageEditor.imgInfo.left){
                    el.style.left = rect.left + "px";
                }
                if(rect.top > imageEditor.imgInfo.top){
                    el.style.top = rect.top + "px";
                }

            } else if (currentResizer.classList.contains("bottom-left")) {
                var w = rect.width + (imageEditor.prevX - e.offsetX);
                var h = rect.height - (imageEditor.prevY - e.offsetY);
                if(w > imageEditor.imgInfo.minWidth && w < imageEditor.imgInfo.maxWidth - ( imageEditor.imgInfo.right - rect.right)) {
                    el.style.width = w + "px";
                }
                if(h > imageEditor.imgInfo.minHeight && h < imageEditor.imgInfo.maxHeight - ( rect.top - imageEditor.imgInfo.top )) {
                    el.style.height = h + "px";
                }
                if(rect.top > imageEditor.imgInfo.top){
                    el.style.top = rect.top + "px";
                }
                if(rect.left > imageEditor.imgInfo.left) {
                    el.style.left = rect.left - (prevX - e.offsetX) + "px";
                }
            } else if (currentResizer.classList.contains("top-right")) {
                var w = rect.width  - (imageEditor.prevX - e.offsetX);
                var h = rect.height + (imageEditor.prevY - e.offsetY);
                if(w > imageEditor.imgInfo.minWidth && w < imageEditor.imgInfo.maxWidth - ( rect.left - imageEditor.imgInfo.left)) {
                    el.style.width = w + "px";
                }
                if(h > imageEditor.imgInfo.minHeight && h < imageEditor.imgInfo.maxHeight - ( imageEditor.imgInfo.bottom - rect.bottom )) {
                    el.style.height = h + "px";
                }
                if(rect.top > imageEditor.imgInfo.top) {
                    el.style.top = rect.y - (imageEditor.prevY - e.offsetY) + "px";
                }
                if(rect.left > imageEditor.imgInfo.left){
                    el.style.left = rect.left + "px";
                }
            } else if (currentResizer.classList.contains("top-left")) {
                var w = rect.width + (imageEditor.prevX - e.offsetX);
                var h = rect.height + (imageEditor.prevY - e.offsetY);
                if(w > imageEditor.imgInfo.minWidth && w < imageEditor.imgInfo.maxWidth - ( imageEditor.imgInfo.right - rect.right )) {
                    el.style.width = w + "px";
                }
                if(h > imageEditor.imgInfo.minHeight && h < imageEditor.imgInfo.maxHeight - ( imageEditor.imgInfo.bottom - rect.bottom )) {
                    el.style.height = h + "px";
                }
                if(rect.top > imageEditor.imgInfo.top) {
                    el.style.top = rect.top - (imageEditor.prevY - e.offsetY) + "px";
                }
                if(rect.left > imageEditor.imgInfo.left){
                    el.style.left = rect.left - (prevX - e.offsetX) + "px";
                }

                //if(rect.top + rect.height > imageEditor.imgInfo.bottom){
                //    console.log("b");
                //    el.style.top = 545 + (imageEditor.prevY - e.offsetY) + "px";
                //}
                //if(rect.left + rect.width > imageEditor.imgInfo.right){
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

        $('.select_box').css({
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

        this.imgInfo.minWidth = 50;
        this.imgInfo.minHeight = 50;
        this.imgInfo.left = $('.select_box')[0].offsetLeft; //(1160 - $('.select_box')[0].offsetWidth) / 2;
        this.imgInfo.top = $('.select_box')[0].offsetTop; //(792 - $('.select_box')[0].offsetHeight) / 2;
        this.imgInfo.right = $('.select_box')[0].offsetLeft + $('.select_box').width();
        this.imgInfo.bottom = $('.select_box')[0].offsetTop + $('.select_box').height();

        $('#imageCrop').on('click', function(){
            var x = $('.select_box').offset().left - $('#canvas').offset().left;
            var y = $('.select_box').offset().top - $('#canvas').offset().top;
            var w = $('.select_box').width();
            var h = $('.select_box').height();

            console.log("x: " + x + "/ y: " + y);

            var currentImageData = _this.ctx.getImageData(x, y, w, h);
            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height); // 원래 상태 지우기
            _this.ctx.clearRect(-_this.canvas.height / 2, -_this.canvas.width / 2, _this.canvas.height, _this.canvas.width); //rotate시 지우기
            _this.ctx.clearRect(-_this.canvas.width, 0, _this.canvas.width, _this.canvas.height); //좌우 반전시 지우기
            _this.ctx.clearRect(0, -_this.canvas.height, _this.canvas.width, _this.canvas.height); //상하 반전시 지우기
            _this.ctx.putImageData(currentImageData, (_this.canvas.width - w) / 2, (_this.canvas.height - h) / 2);
            $('#select_box').css("left", (_this.canvas.width - w) / 2 + "px");
            $('#select_box').css("top", (_this.canvas.height - h) / 2 + "px");



            /*
             _this.clearCanvas();

             if(_this.angleCount % 2 == 1){
             _this.cutWidth = $('.select_box')[0].offsetWidth;
             _this.cutHeight = $('.select_box')[0].offsetHeight;

             $('#width').val(_this.cutHeight);
             $('#height').val(_this.cutWidth);

             _this.ctx.drawImage(_this.editImg
             , $('.select_box')[0].offsetTop - _this.imgInfo.top
             , $('.select_box')[0].offsetLeft - _this.imgInfo.left
             , $('.select_box')[0].offsetHeight
             , $('.select_box')[0].offsetWidth
             , -$('.select_box')[0].offsetHeight / 2
             , -$('.select_box')[0].offsetWidth / 2
             , $('.select_box')[0].offsetHeight
             , $('.select_box')[0].offsetWidth);
             } else {
             _this.cutWidth = $('.select_box')[0].offsetWidth;
             _this.cutHeight = $('.select_box')[0].offsetHeight;

             $('#width').val(_this.cutWidth);
             $('#height').val(_this.cutHeight);

             _this.ctx.drawImage(_this.editImg
             , $('.select_box')[0].offsetLeft - _this.imgInfo.left
             , $('.select_box')[0].offsetTop - _this.imgInfo.top
             , $('.select_box')[0].offsetWidth
             , $('.select_box')[0].offsetHeight
             , -$('.select_box')[0].offsetWidth / 2
             , -$('.select_box')[0].offsetHeight / 2
             , $('.select_box')[0].offsetWidth
             , $('.select_box')[0].offsetHeight);
             */
            //}

            //$('#imageCrop').css("display","none");
            //$('.select_box').css("display","none");
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

    ,sharpen: function(imgData){
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
        var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var filteredData = this.getFilterBright(imgData, 100 , type);
        this.ctx.putImageData(filteredData, 0, 0);
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
}

$(function() {
    imageEditor.init();
});
