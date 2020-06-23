/**
 * Created by user on 2020-06-17.
 */
var imageEditorCanvas = {
    canvas : null
    ,ctx : null
    ,img : null

    ,init : function ( canvasId, img ) {
        this.canvas = $(canvasId)[0];
        this.ctx = this.canvas.getContext('2d');
        this.img = img;

        this.drawImage();
        this.registEvent();
    }

    , drawImage: function () {
        $(this.canvas).attr('width', this.img.width); //캔버스 넓이 높이를 초기 이미지넓이 높이로 변경
        $(this.canvas).attr('height', this.img.height);
        this.ctx.drawImage(this.img, 0, 0);
    }

    ,getProp : function (propName ) {
        return this.img[ propName ];
    }

    ,registEvent : function () {

    }

    ,removeEvent : function () {

    }

    ,destroy : function () {

    }
}