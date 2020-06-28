/**
 * Created by user on 2020-06-17.
 */
bm.ImageEditorCanvasCon = {
    canvas : null
    ,ctx : null
    ,currentWidth : 0
    ,currentHeight : 0
    ,img : null
    ,naturalImg : null
    ,zoomValue : 1

    ,onChange : null

    ,init : function ( canvasId, img ) {
        this.canvas = $(canvasId)[0];
        this.ctx = this.canvas.getContext('2d');
        this.img = img;

        this.naturalImg = new Image();
        this.naturalImg.src = this.canvas.toDataURL();

        this.drawImage( this.img.width, this.img.height );
        this.registEvent();
    }

    /**
     * 이미지 그리기
     * @param w
     * @param h
     */
    , drawImage: function ( w, h ) {
        if( w === 0 || w ){
            this.currentWidth = w;
        }

        if( h === 0 || h ){
            this.currentHeight = h;
        }

        $(this.canvas).attr('width', this.currentWidth*this.zoomValue); //캔버스 넓이 높이를 초기 이미지넓이 높이로 변경
        $(this.canvas).attr('height', this.currentHeight*this.zoomValue );
        this.ctx.drawImage(this.img, 0, 0, this.currentWidth*this.zoomValue, this.currentHeight*this.zoomValue);

        if( this.onChange ) this.onChange( "resize", this.getSize() );
    }

    , rotateImage : function (dir) {

        var newWidth = this.currentHeight;
        this.currentHeight = this.currentWidth;
        this.currentWidth = newWidth;

        $(this.canvas).attr('width', this.currentWidth*this.zoomValue  );
        $(this.canvas).attr('height', this.currentHeight*this.zoomValue );

        this.ctx.save();
        this.ctx.translate(this.currentWidth*this.zoomValue / 2, this.currentHeight*this.zoomValue / 2);
        if(dir == "left") {
            this.ctx.rotate(-Math.PI / 2);
        } else {
            this.ctx.rotate(Math.PI / 2);
        }
        this.ctx.translate(-this.currentHeight*this.zoomValue / 2, -this.currentWidth*this.zoomValue / 2);
        this.ctx.drawImage( this.img, 0, 0, this.currentHeight*this.zoomValue, this.currentWidth*this.zoomValue);
        this.ctx.restore();

        this.img.src = this.canvas.toDataURL();
        if( this.onChange ) this.onChange( "rotate", this.getSize() );
    }


    /**
     * 이미지 좌우, 상하 반전
     * @param dir
     */
    , flipImage : function (dir) {

        this.ctx.save();
        if(dir == "horizontal"){
            this.ctx.setTransform(-1,0,0,1,0,0);
            this.ctx.drawImage(this.img, -this.currentWidth*this.zoomValue, 0, this.currentWidth*this.zoomValue, this.currentHeight*this.zoomValue);
        } else {
            this.ctx.setTransform(1,0,0,-1,0,0);
            this.ctx.drawImage(this.img, 0, -this.currentHeight*this.zoomValue, this.currentWidth*this.zoomValue, this.currentHeight*this.zoomValue );
        }
        this.ctx.restore();

        this.img.src = this.canvas.toDataURL();
        if( this.onChange ) this.onChange( "flip", this.getSize() );
    }

    ,zoomIncrease : function () {
        this.zoomValue *= 10;
        this.zoomValue++;
        this.zoomValue /= 10;

        this.drawImage();

        return this.zoomValue;
    }

    ,zoomDecrease : function () {
        this.zoomValue *= 10;
        this.zoomValue--;
        if( this.zoomValue <= 0 ) this.zoomValue = 1;
        this.zoomValue /= 10;

        this.drawImage();

        return this.zoomValue;
    }

    ,setZoom : function ( val ) {
        this.zoomValue = val;
        this.drawImage();

        return this.zoomValue;
    }

    /**
     * 캔버스 객체 반환
     * @returns {null}
     */
    ,getCanvas : function () {
        return this.canvas;
    }

    ,getProp : function (propName ) {
        return this.img[ propName ];
    }

    /**
     * 현재 이미지 사이즈
     * @returns {{width: *, height: *}}
     */
    ,getSize : function () {
        return { width : this.canvas.width , height : this.canvas.height };
    }

    /**
     * 이미지 원본 사이즈
     * @returns {{naturalWidth: (*|number), naturalHeight: (*|number)}}
     */
    ,getNaturalSize : function () {
        return { width : this.img.naturalWidth , height : this.img.naturalHeight };
    }


    ,registEvent : function () {
        var _this = this;

        $(this.canvas).on( "mousewheel", function(e){
            if(e.ctrlKey){

                e.preventDefault();
                e.stopImmediatePropagation();

                var event = e.originalEvent;
                var delta = 0;

                if (event.detail) {
                    delta = event.detail * -40;
                }else{
                    delta = event.wheelDelta;
                };

                if( delta > 0 ){
                    _this.zoomIncrease();
                }else{
                    _this.zoomDecrease();
                }

            }
        })
    }

    , filterControl : function ( filterType, filterValue ) {

        console.log( filterValue );
        this.drawImage();

        var imgData = this.ctx.getImageData(0, 0, this.currentWidth, this.currentHeight );
        var filteredData;
        switch ( filterType ){
            case "brightness" : filteredData = this.getFilterBrightness(imgData, filterValue ); break;
            case "contrast" : filteredData = this.getFilterContrast(imgData, filterValue ); break;
            case "blur" : filteredData = this.getFilterBlur(imgData, filterValue ); break;
            case "sharpen" : filteredData = this.getFilterSharpen(imgData, filterValue ); break;
        }

        this.ctx.putImageData(filteredData, 0, 0);
        //this.img.src = this.canvas.toDataURL(); //다른 필터들도 적용시켜야됨
    }


    , getFilterBrightness: function (imgData, value) {
        var d = imgData.data;
        this.ctx.clearRect(0, 0, this.currentWidth, this.currentHeight);

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

    , getFilterBlur: function (imgData, value) {
        var offset = 1/(value/10);
        return this.convolution(imgData,
            [ offset, offset, offset,
                offset, offset, offset,
                offset, offset, offset ], 0);
    }

    , getFilterSharpen: function(imgData){
        return this.convolution(imgData,
            [ 0, -1,  0,
                -1, 5, -1,
                0, -1,  0 ], 0);
    }

    , convolution: function(imgData, weights, opaque) {
        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side / 2);
        var src = imgData.data;
        var sw = imgData.width;
        var sh = imgData.height;
        var w = sw;
        var h = sh;
        var output = this.ctx.getImageData(0, 0, w, h);
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

    ,removeEvent : function () {

    }

    ,destroy : function () {

    }
}