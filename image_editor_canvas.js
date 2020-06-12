var imageEditor = {

    canvas: null
    , ctx: null
    , editImg: null
    , toggleBtn: false
    , zoom: 1.0
    , angleCount: 0
    , cutWidth : 0
    , cutHeight : 0
    , imgInfo :{}

    , init: function() {
        this.canvas = $('#canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.editImg = new Image();

        this.setCanvas('../img/facility_3.png');
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

        $('#toggle').on('click', function(){
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

        $('#brightness').each(function(){
           var inputVal = $(this).val();
            $(this).on('change', function() {
                console.log('Current Value: ',$(this).val());
                console.log('Old Value: ', inputVal);
                _this.setFilterBright($(this).val(), inputVal);
                inputVal = $(this).val();
            })
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
            _this.zoom = ((_this.zoom*10)+1)/10;
            _this.Zoom("zoom_in");
        });

        $('#zoom_out').on('click', function () {
            _this.zoom = ((_this.zoom*10)-1)/10;
            _this.Zoom("zoom_out");
        });

        $('#imageReturn').on('click', function() {
            _this.reset();
        });

        var el = document.querySelector(".select_box");
        var isResizing = false;

        el.addEventListener('mousedown', mousedown);

        function mousedown(e) {
            //if(isResizing) {
            //   return;
            //}

            el.addEventListener('mousemove',mousemove);
            el.addEventListener('mouseup',mouseup);

            var prevX = e.offsetX;
            var prevY = e.offsetY;

            function mousemove(e){
                if(!isResizing) {
                    var rect = el.getBoundingClientRect();
                    el.style.left = rect.left - (prevX - e.offsetX) + "px";
                    el.style.top = rect.top - (prevY - e.offsetY) + "px";

                    if(this.angleCount % 2 == 1) {
                        if(el.offsetLeft < _this.imgInfo.left) {
                            el.style.left = _this.imgInfo.left + "px";
                        }
                        if(el.offsetTop < _this.imgInfo.top) {
                            el.style.top = _this.imgInfo.top + "px";
                        }
                        if(el.offsetLeft +  $(el).height() > _this.imgInfo.right) {
                            el.style.left = _this.imgInfo.left + (_this.imgInfo.maxHeight - $(el).height()) + "px"
                        }
                        if(el.offsetTop +  $(el).width() > _this.imgInfo.bottom) {
                            el.style.top = _this.imgInfo.top + (_this.imgInfo.maxWidth - $(el).width()) + "px";
                        }
                    } else {
                        if(el.offsetLeft < _this.imgInfo.left) {
                            el.style.left = _this.imgInfo.left + "px";
                        }
                        if(el.offsetTop < _this.imgInfo.top) {
                            el.style.top = _this.imgInfo.top + "px";
                        }
                        if(el.offsetLeft +  $(el).width() > _this.imgInfo.right) {
                            el.style.left = _this.imgInfo.left + (_this.imgInfo.maxWidth - $(el).width()) + "px"
                        }
                        if(el.offsetTop +  $(el).height() > _this.imgInfo.bottom) {
                            el.style.top = _this.imgInfo.top + (_this.imgInfo.maxHeight - $(el).height()) + "px";
                        }
                    }
                }
                _this.cutWidth = rect.width;
                _this.cutHeight = rect.height;
            }
            function mouseup() {
                el.removeEventListener("mousemove",mousemove);
                el.removeEventListener("mouseup",mouseup);
            }
        }

        var resizers = document.querySelectorAll(".resizer");
        var currentResizer;

        resizers.forEach(function(resizer){
            resizer.addEventListener('mousedown', mousedown);
            function mousedown(e){
                e.stopPropagation();
                console.log("resizer down");
                currentResizer = e.target;
                isResizing = true;

                var prevX = e.offsetX;
                var prevY = e.offsetY;

                resizer.addEventListener("mousemove",mousemove);
                window.addEventListener("mouseup",mouseup);

                function mousemove(e) {
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
                    }

                }

                function mouseup() {
                    resizer.removeEventListener("mousemove", mousemove);
                    window.removeEventListener("mouseup", mouseup);
                    isResizing = false;
                }
            }
        })

        , $('#imageSave').on("click", function(){
            if(_this.angleCount % 2 == 1){
                var imgData = _this.ctx.getImageData(
                    (_this.canvas.width - _this.editImg.height) / 2 ,
                    (_this.canvas.height - _this.editImg.width) / 2 ,
                    _this.editImg.height ,
                    _this.editImg.width);

                _this.canvas.width = _this.editImg.height;
                _this.canvas.height = _this.editImg.width;

            } else {
                var imgData = _this.ctx.getImageData(
                    (_this.canvas.width - _this.editImg.width) / 2 ,
                    (_this.canvas.height - _this.editImg.height) / 2 ,
                    _this.editImg.width ,
                    _this.editImg.height);

                _this.canvas.width = _this.editImg.width;
                _this.canvas.height = _this.editImg.height;
            }
            _this.ctx.putImageData(imgData,0 ,0);

            var dataURL = _this.canvas.toDataURL();
            console.log(dataURL);
            document.getElementById("sendImage").src = dataURL;

            /*
             $.ajax({
             type: "POST",
             url: "script.php",
             data: {
             imgBase64: dataURL
             }
             }).done(function(o) {
             console.log('saved');
             });
            */
        });
    }

    , setCanvas: function(path) {
        var _this = this;
        _this.editImg.src = path;

        _this.editImg.onload = function(){
            _this.ctx.translate(_this.canvas.width / 2 , _this.canvas.height / 2 );
            _this.ctx.drawImage(_this.editImg, -_this.editImg.width / 2, -_this.editImg.height / 2);
            $('#width').val(_this.editImg.width);
            $('#height').val(_this.editImg.height);

            _this.registEvent();
        };
    }

    , reSize: function(type) {
        var w = $('#width').val();
        var h = $('#height').val();
        var ratio_h = Math.round( w * ( this.editImg.naturalHeight / this.editImg.naturalWidth ) );

       /* var imgData = this.ctx.getImageData(
            (this.canvas.width - this.editImg.width) / 2 ,
            (this.canvas.height - this.editImg.height) / 2 ,
            w ,
            h );

        console.log(imgData);
        */
        this.clearCanvas();
        this.editImg.width = w;
        this.editImg.height = h;

        if(isNaN(w)){ //엔터키로도 숫자아닌걸 입력했을때도 구현해야함
            alert("숫자만 입력해주세요");
            return ;
        }
        if(this.zoom != 1.0){
            this.zoom = 1.0;
            $('#imageRatio').text(Math.floor(this.zoom*100) + "%");
        }

        if(this.toggleBtn) {
            $('#height').val( ratio_h );
            this.editImg.height = ratio_h;
            this.ctx.drawImage(this.editImg, -this.editImg.width / 2, -this.editImg.height / 2 , this.editImg.width, this.editImg.height);
            return ;
        }

        //this.ctx.putImageData(imgData, (this.canvas.width - this.editImg.width) / 2 , (this.canvas.height - this.editImg.height) / 2);
        //this.ctx.scale(1.5 ,1);
        this.ctx.drawImage(this.editImg, -this.editImg.width / 2, -this.editImg.height / 2 , this.editImg.width, this.editImg.height);

    }

    , onToggle: function(){
        this.toggleBtn = !this.toggleBtn;
        $('#apply input').attr('disabled', this.toggleBtn);
    }

    , clearCanvas: function() {
        if(this.angleCount % 2 == 1){
            this.ctx.clearRect(-this.canvas.height/2, -this.canvas.width/2, this.canvas.height, this.canvas.width);
        } else {
            this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);
        }
    }

    , setRotation: function(type) { // 좌우측 로테이션
        var w = this.editImg.width;
        var h = this.editImg.height;

        this.clearCanvas();

        if(type == "left"){
            this.ctx.rotate(-Math.PI / 2);
            this.angleCount++;
        } else if(type == "right"){
            this.ctx.rotate(Math.PI / 2);
            this.angleCount++;
        }
        this.ctx.drawImage(this.editImg, -w / 2, -h / 2 , w, h);
    }


    , setFlip: function(type) {
        this.clearCanvas();

        if(type == "x_flip"){
            this.ctx.scale(-1,1);
            this.ctx.drawImage(this.editImg, -this.editImg.width / 2, -this.editImg.height / 2, this.editImg.width, this.editImg.height);
        } else if (type == "y_flip"){
            this.ctx.scale(1,-1);
            this.ctx.drawImage(this.editImg, -this.editImg.width / 2, -this.editImg.height / 2, this.editImg.width, this.editImg.height);
        }
    }

    , crop: function(){
        var _this = this;
        if(this.angleCount % 2 == 1) {
            $('.select_box').css({"width":this.editImg.height + "px","height":this.editImg.width + "px"});
        } else {
            $('.select_box').css({"width": this.editImg.width + "px", "height": this.editImg.height + "px"});
        }
        $('#imageCrop').css("display","inline-block");
        $('.select_box').css("display","inline-block");

        if(_this.angleCount % 2 == 1){
            this.imgInfo.maxWidth = parseInt($('#height').val(),10);
            this.imgInfo.maxHeight = parseInt($('#width').val(),10);
        } else {
            this.imgInfo.maxWidth = parseInt($('#width').val(),10);
            this.imgInfo.maxHeight = parseInt($('#height').val(),10);
        }
        this.imgInfo.minWidth = 50;
        this.imgInfo.minHeight = 50;
        this.imgInfo.left = $('.select_box')[0].offsetLeft;
        this.imgInfo.top = $('.select_box')[0].offsetTop;
        this.imgInfo.right = $('.select_box')[0].offsetLeft + $('.select_box').width();
        this.imgInfo.bottom = $('.select_box')[0].offsetTop + $('.select_box').height();

        $('#imageCrop').on('click', function(){
            _this.clearCanvas();

            if(_this.angleCount % 2 == 1){

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
                _this.ctx.drawImage(_this.editImg
                    , $('.select_box')[0].offsetLeft - _this.imgInfo.left
                    , $('.select_box')[0].offsetTop - _this.imgInfo.top
                    , $('.select_box')[0].offsetWidth
                    , $('.select_box')[0].offsetHeight
                    , -$('.select_box')[0].offsetWidth / 2
                    , -$('.select_box')[0].offsetHeight / 2
                    , $('.select_box')[0].offsetWidth
                    , $('.select_box')[0].offsetHeight);
            }

            $('#imageCrop').css("display","none");
            $('.select_box').css("display","none");

            _this.editImg.width = _this.cutWidth;
            _this.editImg.height = _this.cutHeight;

            $('#width').val(_this.cutWidth);
            $('#height').val(_this.cutHeight);
        });
    }

    , convolution: function(imgData, weights, opaque) {
        var side = Math.round(Math.sqrt(weights.length)); // 이미지 필터 가중치
        var halfSide = Math.floor(side / 2); // 가중치 절반 값 저장
        var src = imgData.data; // 원본 데이터
        var sw = imgData.width; // 원본 데이터 넓이
        var sh = imgData.height; // 원본 데이터 높이
        var w = sw;
        var h = sh;
        var output = this.ctx.createImageData(w, h);
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


    , getFilterBright: function (imgData, value, current, old) {
        var d = imgData.data;
        this.clearCanvas();
        for(var i=0; i< d.length; i+=4) {
            if( current > old ){
                d[i] *= 1.2;
                d[i+1] *= 1.2;
                d[i+2] *= 1.2;
            } else {
                d[i] /= 1.2;
                d[i+1] /= 1.2;
                d[i+2] /= 1.2;
            }
            //if( current > old ){
            //    d[i] += 45;
            //    d[i+1] += 45;
            //    d[i+2] += 45;
            //} else {
            //    d[i] -= 45;
            //    d[i+1] -= 45;
            //    d[i+2] -= 45;
            //}
        }
        return imgData;
    }

    , setFilterBright: function (current, old) {
        var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var filteredData = this.getFilterBright(imgData, parseInt($('#brightness').val(),10) , current , old);
        this.ctx.putImageData(filteredData, 0, 0);
    }

    , getFilterContrast: function(imgData, contrast) {
        var d = imgData.data;
        contrast *= 2.55;
        var factor = (255 + contrast) / (255.01 - contrast);

        for(var i=0;i<d.length;i+=4)
        {
            d[i] = factor * (d[i] - 128) + 128;     //r value
            d[i+1] = factor * (d[i+1] - 128) + 128; //g value
            d[i+2] = factor * (d[i+2] - 128) + 128; //b value
        }
        return imgData;
    }

    , setFilterContrast: function(){
        var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var filteredData = this.getFilterContrast(imgData, parseInt($('#contrast').val(),10) );
        this.ctx.putImageData(filteredData, 0, 0);
    }

    , Zoom: function (type) {
        this.clearCanvas();
        var h = Math.round( this.editImg.width * ( this.editImg.height / this.editImg.width ));

        if(this.zoom >= 0.1){
            if(type == "zoom_in"){
                this.editImg.width += this.editImg.width * 0.1;
                this.editImg.height +=  Math.floor( h * 0.1 );
                $('#width').val(this.editImg.width);
                $('#height').val(this.editImg.height);

            } else if(type == "zoom_out"){
                this.editImg.width -= this.editImg.width * 0.1;
                this.editImg.height -= Math.floor( h * 0.1 );
                $('#width').val(this.editImg.width);
                $('#height').val(this.editImg.height);

            }
        } else{
            alert("더이상 줄일 수 없습니다");
            this.zoom += 0.1;
        }
        this.ctx.drawImage(this.editImg ,-this.editImg.width / 2 ,-this.editImg.height / 2 ,this.editImg.width ,this.editImg.height);
        $('#imageRatio').text(Math.floor(this.zoom*100) + "%");
    }

    , reset: function(){
        this.zoom = 1.0;
        this.editImg.width = this.editImg.naturalWidth;
        this.editImg.height = this.editImg.naturalHeight;

        this.clearCanvas();

        $('#width').val(this.editImg.naturalWidth);
        $('#height').val(this.editImg.naturalHeight);

        //this.canvas.width = this.editImg.width;
        //this.canvas.height = this.editImg.height;

        this.toggleBtn = false;
        $('#apply input').attr('disabled', this.toggleBtn);

        $('#imageRatio').text(Math.floor(this.zoom*100) + "%");
        $('.range_bg').css('background',"");
        $('#brightness').val("3");
        $('#blur').val("0");
        $('#contrast').val("0");
        $('#sharpen').val("0");

        this.ctx.setTransform(1, 0, 0, 1, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.drawImage(this.editImg,-this.editImg.width / 2, -this.editImg.height / 2);
    }
}

$(function() {
    imageEditor.init();
});
