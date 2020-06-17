var setCanvas = {

    canvas: null
    , ctx: null
    , editImg: null

    , init: function () {
        this.canvas = $('#canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.editImg = new Image();

        this.loadImage('../img/facility_3.png');
    }

    , loadImage: function (path) {
        var _this = this;

        $(_this.editImg).on('load', function () {
            _this.imgW = _this.editImg.width; //imgW, imgH 각각 초기 이미지 넓이 높이로 초기화
            _this.imgH = _this.editImg.height;
            $('#canvas').attr('width', _this.imgW); //캔버스 넓이 높이를 초기 이미지넓이 높이로 변경
            $('#canvas').attr('height', _this.imgH);
            _this.ctx.drawImage(_this.editImg, 0, 0);
            $('#width').val(_this.imgW);
            $('#height').val(_this.imgH);
            $(_this.editImg).off('load');

            Events();
        });
        _this.editImg.src = path;
    }
}