var imageEditor = {

    canvas: null
    , ctx: null
    , editImg: null
    , toggleBtn: false

    , init: function() {
        canvas = $('#canvas')[0];
        ctx = canvas.getContext('2d');
        editImg = new Image();
        this.loadImage('../img/facility_3.png');
        this.registEvent();
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
    }

    , loadImage: function(path) {
        var _this = this;
        editImg.src = path;
        editImg.onload = function(){
            // 만약 이미지를 그대로 넣으면 캔버스보다 큰 이미지가 들어올 경우 짤리게 된다.
            // 이미지 width나 height가 클 경우 캔버스에 맞춰서 그리도록 사전에 처리를 해주는 알고리즘
            /*editImg.height *= canvas.offsetWidth / editImg.width;
            editImg.width = canvas.offsetWidth;

            if(editImg.height > canvas.offsetHeight){
                editImg.width *= canvas.offsetHeight / editImg.height;
                editImg.height = canvas.offsetHeight;
            }*/
            canvas.width = editImg.width;
            canvas.height = editImg.height;

            ctx.drawImage(editImg, 0, 0, editImg.width, editImg.height);
            $('#width').val(editImg.width);
            $('#height').val(editImg.height);
            /*
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(imgData,0,0)*/
        };
    }

    , reSize: function(type) {
        var w = parseInt($('#width').val(),10);
        if(type == "show_width") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if(this.toggleBtn) {
                var ratio_h = Math.round(w * ( editImg.naturalHeight / editImg.naturalWidth ));
                canvas.width = w;
                canvas.height = w * ( editImg.naturalHeight / editImg.naturalWidth );
                $('#height').val( ratio_h );

                ctx.drawImage(editImg, 0, 0, w, ratio_h );
                return ;
            }
            editImg.width = w;
            $('#canvas')[0].width = editImg.width;
            $('#canvas')[0].height = $('#height').val();
            ctx.drawImage(editImg, 0, 0, w, $('#canvas')[0].height);

        } else if(type == "show_height") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var h = parseInt($('#height').val(),10);
            editImg.height = h;
            $('#canvas')[0].height = editImg.height;
            ctx.drawImage(editImg, 0, 0, w, h);
        }
    }

    , enterKeyDown: function(type,key) {
        var w = parseInt($('#width').val(),10);
        if (type == "width" && key.keyCode == 13) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if(this.toggleBtn) {
                var ratio_h = Math.round(w * ( editImg.naturalHeight / editImg.naturalWidth ));
                canvas.width = w;
                canvas.height = w * ( editImg.naturalHeight / editImg.naturalWidth );
                $('#height').val( ratio_h );

                ctx.drawImage(editImg, 0, 0, w, ratio_h );
                return ;
            }
            editImg.width = w;
            $('#canvas')[0].width = editImg.width;
            $('#canvas')[0].height = $('#height').val();
            ctx.drawImage(editImg, 0, 0, w, $('#canvas')[0].height);

        } else if (type == "height" && key.keyCode == 13) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var h = parseInt($('#height').val(),10);
            editImg.height = h;
            $('#canvas')[0].height = editImg.height;
            ctx.drawImage(editImg, 0, 0, w, h);
        }
    }
    , setSize: function(type) {
    }

    , onToggle: function(){
        this.toggleBtn = !this.toggleBtn;
        if(this.toggleBtn) {
            $('#asd input').attr('disabled', this.toggleBtn);
        } else {
            $('#asd input').attr('disabled', this.toggleBtn);
        }
    }

    , setRotation: function(type) {
    }

    , setFlip: function(type0, type1) {
    }

    , setTransform: function() {
    }

    , getTransform: function(property) {
    }

    , letCrop: function(){
    }

    , setFilterBlur: function () {
    }

    , setFilterBright: function () {
    }

    , setFilterContrast: function(){
    }

    , setZooming: function (type) {
    }
    , getZooming: function () {
    }

    , reset: function(){
    }
}

$(function() {
    imageEditor.init();
});
