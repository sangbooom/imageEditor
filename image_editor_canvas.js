var imageEditor = {

    canvas: null
    , ctx: null
    , editImg: null
    , toggleBtn: false
    , toggleXflip: false
    , toggleYflip: false
    , angle: 0
    , zoom: 1.0
    , rotating: false
    , cw : null
    , ch : null

    , init: function() {
        this.canvas = $('#canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.editImg = new Image();

        this.setCanvas('../img/facility_3.png');
    }

    , registEvent: function() {
        var _this = this;

        $('#show_width').on('click', function () {
            _this.reSize("show_width");
        });

        $('#show_height').on('click', function () {
            _this.reSize("show_height");
        });

        $("#width").keydown(function(key) {
            _this.enterKeyDown("width", key);
        });

        $("#height").keydown(function(key) {
            _this.enterKeyDown("height", key);
        });

        $('#toggle').on('click', function(){
            _this.onToggle();
        });

        $('#left').on('click', function () {
            _this.angle -= 90;
            _this.setRotation();
        });

        $('#right').on('click', function () {
            _this.angle += 90;
            _this.setRotation(_this.angle);
        });

        $('#x_flip').on('click', function() {
            _this.setFlip("x_flip");
        });

        $('#y_flip').on('click', function() {
            _this.setFlip("y_flip");
        });

        $('#brightness').on('input', function(){
            _this.setFilterBright();
        });

        $('#zoom_in').on("click", function () {
            _this.zoom = ((_this.zoom*10)+1)/10;
            _this.Zoom("zoom_in");
        });

        $('#zoom_out').on("click", function () {
            _this.zoom = ((_this.zoom*10)-1)/10;
            _this.Zoom("zoom_out");
        });
    }

    , setCanvas: function(path) {
        var _this = this;
        _this.editImg.src = path;
        _this.editImg.onload = function(){
            _this.ctx.drawImage(_this.editImg, (_this.canvas.width - _this.editImg.width) / 2,(_this.canvas.height - _this.editImg.height) / 2);
            $('#width').val(_this.editImg.width);
            $('#height').val(_this.editImg.height);

            _this.registEvent();
        };
    }

    , reSize: function(type) {
        var w = parseInt($('#width').val(),10);
        if(type == "show_width") {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if(this.toggleBtn) {
                var ratio_h = Math.round(w * ( this.editImg.naturalHeight / this.editImg.naturalWidth )); //이미지의 원본크기

                this.canvas.width = w;
                this.canvas.height = w * ( this.editImg.naturalHeight / this.editImg.naturalWidth );
                $('#height').val( ratio_h );

                this.ctx.drawImage(this.editImg, 0, 0, w, ratio_h );
                return ;
            }
            this.editImg.width = w;
            $('#canvas')[0].width = this.editImg.width;
            $('#canvas')[0].height = $('#height').val();
            if( ( Math.abs(this.angle) / 90 ) % 2 == 0 ? 1 : 0 ){
                this.ctx.drawImage(this.editImg, 0, 0, $('#canvas')[0].height,w);
            } else {
                this.ctx.drawImage(this.editImg, 0, 0, w, $('#canvas')[0].height);
            }


        } else if(type == "show_height") {
            //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            var h = parseInt($('#height').val(),10);
            this.editImg.height = h;
            $('#canvas')[0].height = this.editImg.height;
            this.ctx.drawImage(this.editImg, 0, 0, w, h);
        }
    }

    , enterKeyDown: function(type,key) {
        var w = parseInt($('#width').val(),10);
        if (type == "width" && key.keyCode == 13) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if(this.toggleBtn) {
                var ratio_h = Math.round(w * ( this.editImg.naturalHeight / this.editImg.naturalWidth ));
                this.canvas.width = w;
                this.canvas.height = w * ( this.editImg.naturalHeight / this.editImg.naturalWidth );
                $('#height').val( ratio_h );

                this.ctx.drawImage(this.editImg, 0, 0, w, ratio_h );
                return ;
            }
            this.editImg.width = w;
            $('#canvas')[0].width = this.editImg.width;
            $('#canvas')[0].height = $('#height').val();
            this.ctx.drawImage(this.editImg, 0, 0, w, $('#canvas')[0].height);

        } else if (type == "height" && key.keyCode == 13) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            var h = parseInt($('#height').val(),10);
            this.editImg.height = h;
            $('#canvas')[0].height = this.editImg.height;
            this.ctx.drawImage(this.editImg, 0, 0, w, h);
        }
    }

    , onToggle: function(){
        this.toggleBtn = !this.toggleBtn;
        if(this.toggleBtn) {
            $('#asd input').attr('disabled', this.toggleBtn);
        } else {
            $('#asd input').attr('disabled', this.toggleBtn);
        }
    }

    , clearCanvas: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
/*
    , toDataURL: function(){
        var myImage = document.getElementById('myImage');
        myImage.src = this.canvas.toDataURL();
    }
*/
    , setRotation: function() {
        var _this = this;
        var mode = ( Math.abs(_this.angle) / 90 ) % 2 == 0 ? "h" : "v";

        _this.canvas.width = mode == "h" ? _this.editImg.width : _this.editImg.height;
        _this.canvas.height = mode == "h" ? _this.editImg.height : _this.editImg.width;
        _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
        _this.ctx.save();
        _this.ctx.translate(_this.canvas.width / 2, _this.canvas.height / 2);
        _this.ctx.rotate(_this.angle * Math.PI / 180);
        _this.ctx.drawImage(_this.editImg, -(_this.editImg.width) / 2, -(_this.editImg.height) / 2);
        _this.ctx.restore();

    }


    , setFlip: function(type) {
        this.clearCanvas();
        if(type == "x_flip"){
            if(!this.toggleXflip) {
                this.ctx.save();
                this.ctx.scale(-1,1);
                this.ctx.drawImage(this.editImg,-this.editImg.width,0);
                this.ctx.restore();
            } else {
                this.ctx.save();
                this.ctx.scale(1,1);
                this.ctx.drawImage(this.editImg,0,0);
                this.ctx.restore();
            }
            this.toggleXflip = !this.toggleXflip;
        } else if(type == "y_flip") {
            if(!this.toggleYflip) {
                this.ctx.save();
                this.ctx.scale(1,-1);
                this.ctx.drawImage(this.editImg,0,-this.editImg.height);
                this.ctx.restore();
            } else {
                this.ctx.save();
                this.ctx.scale(1,1);
                this.ctx.drawImage(this.editImg,0,0);
                this.ctx.restore();
            }
            this.toggleYflip = !this.toggleYflip;
        }
    }

    , setTransform: function() {
    }

    , getTransform: function(property) {
    }

    , letCrop: function(){
    }

    , setFilterBlur: function () {
    }

    , getFilterBright: function (pixels, value) {
        var d = pixels.data;
        for(var i=0; i< d.length; i+=4){
            d[i] = value;
            d[i+1] = value;
            d[i+2] = value;
        }
        return pixels;
    }
    , setFilterBright: function () {
        var pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        var filteredData = this.getFilterBright( pixels, $('#brightness').val() * 25 );

        this.ctx.save();
        this.ctx.putImageData(filteredData, 0, 0);
        this.ctx.restore();
    }

    , setFilterContrast: function(){
    }

    , setZooming: function (type) {
    }
    , Zoom: function (type) {
        if(this.zoom >= 0.1){

            this.canvas.width = this.canvas.width;
            this.canvas.height = Math.floor((this.canvas.width) * ( this.canvas.height / this.canvas.width ));
            /*
            this.canvas.width = this.canvas.width+(this.canvas.width*0.1);
            this.canvas.height = this.canvas.height+(this.canvas.height*0.1);
            */
            this.clearCanvas();
            this.ctx.save();

            this.ctx.scale(this.zoom,this.zoom);
            this.ctx.drawImage(this.editImg,0,0);

            this.ctx.restore();

        } else{
            this.zoom += 0.1;
            return ;
        }
        $('#imageRatio').text(Math.floor(this.zoom*100) + "%");
    }

    , reset: function(){
    }
}

$(function() {
    imageEditor.init();
});
