var GraphicsCore = {};
GraphicsCore.setPixel = function (imageData, index, r, g, b, a)
{
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

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

        $(this.canvas).attr('width', Math.round( this.currentWidth*this.zoomValue )); //캔버스 넓이 높이를 초기 이미지넓이 높이로 변경
        $(this.canvas).attr('height', Math.round( this.currentHeight*this.zoomValue ) );
        this.ctx.drawImage(this.img, 0, 0, Math.round( this.currentWidth*this.zoomValue ), Math.round( this.currentHeight*this.zoomValue ));

        if( this.onChange ) this.onChange( "resize", this.getSize() );
    }

    , rotateImage : function (dir) {

        var newWidth = this.currentHeight;
        this.currentHeight = this.currentWidth;
        this.currentWidth = newWidth;

        $(this.canvas).attr('width', Math.round( this.currentWidth*this.zoomValue ) );
        $(this.canvas).attr('height', Math.round( this.currentHeight*this.zoomValue ) );

        this.ctx.save();
        this.ctx.translate(Math.round( this.currentWidth*this.zoomValue / 2 ), Math.round( this.currentHeight*this.zoomValue / 2 ));
        if(dir == "left") {
            this.ctx.rotate(-Math.PI / 2);
        } else {
            this.ctx.rotate(Math.PI / 2);
        }
        this.ctx.translate(-Math.round( this.currentHeight*this.zoomValue / 2 ), -Math.round( this.currentWidth*this.zoomValue / 2 ));
        this.ctx.drawImage( this.img, 0, 0, Math.round( this.currentHeight*this.zoomValue ), Math.round( this.currentWidth*this.zoomValue ));
        this.ctx.restore();

        this.img.src = this.canvas.toDataURL();
        if( this.onChange ) this.onChange( "rotate", this.getSize() );
    }

    ,cropImage : function (rect) {
        var canvasBoundingRect = this.canvas.getBoundingClientRect();
        var currentImageData = this.ctx.getImageData( rect.x - canvasBoundingRect.x , rect.y - canvasBoundingRect.y, rect.width, rect.height);

        $('#canvas').attr("width", rect.width + "px");
        $('#canvas').attr("height", rect.height + "px");

        this.ctx.putImageData(currentImageData, 0,0 );

        this.img.src = this.canvas.toDataURL();
        this.currentWidth = rect.width;
        this.currentHeight = rect.height;
        this.zoomValue = 1;

        //this.drawImage( rect.width, rect.height );
        //this.ctx.drawImage(this.img, 0, 0,  rect.width, rect.height );


        if( this.onChange ) this.onChange( "crop", this.getSize() );


    }


    /**
     * 이미지 좌우, 상하 반전
     * @param dir
     */
    , flipImage : function (dir) {

        this.ctx.save();
        if(dir == "horizontal"){
            this.ctx.setTransform(-1,0,0,1,0,0);
            this.ctx.drawImage(this.img, -Math.round( this.currentWidth*this.zoomValue ), 0, Math.round( this.currentWidth*this.zoomValue ), Math.round( this.currentHeight*this.zoomValue ));
        } else {
            this.ctx.setTransform(1,0,0,-1,0,0);
            this.ctx.drawImage(this.img, 0, -Math.round( this.currentHeight*this.zoomValue ), Math.round( this.currentWidth*this.zoomValue ), Math.round( this.currentHeight*this.zoomValue ) );
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
     * 이미지의 절대 좌표
     * @returns {{left: *, top: *}}
     */
    ,getOffset : function () {
        return { left : this.canvas.offsetLeft , top : this.canvas.offsetTop };
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

        var imgData = this.ctx.getImageData(0, 0, Math.round( this.currentWidth*this.zoomValue ), Math.round( this.currentHeight*this.zoomValue ) );    
        var filteredData;
        
        filteredData = imgData; 
           
        filteredData = this.getFilterBlur(imgData, Math.round( this.currentWidth*this.zoomValue ), Math.round( this.currentHeight*this.zoomValue ), parseInt($('#imageEditorBlurRange').val()), false );
        filteredData = this.getFilterBrightness(imgData, parseInt($('#imageEditorBrightnessRange').val()) -100 );
        filteredData = this.getFilterContrast(imgData, parseInt($('#imageEditorContrastRange').val()) );
        if( filterType == "sharpen") filteredData = this.getFilterSharpen(imgData, parseInt($('#imageEditorSharpenRange').val()) );

        if( filteredData ){
            this.ctx.putImageData(filteredData, 0, 0);
        }
    }


    , getFilterBrightness: function (pixels, value) {
        var d = pixels.data;
        
        for(var i=0; i< d.length; i+=4) {
            d[i] += 255 * (value / 100);
            d[i+1] += 255 * (value / 100);
            d[i+2] += 255 * (value / 100);
        }
        return pixels;
    }

    , getFilterContrast: function(pixels, contrast) {
        var d = pixels.data;
        contrast *= 2.55;
        var factor = (255 + contrast) / (255.01 - contrast);

        for(var i=0;i<d.length;i+=4)
        {
            d[i] = factor * (d[i] - 128) + 128;
            d[i+1] = factor * (d[i+1] - 128) + 128;
            d[i+2] = factor * (d[i+2] - 128) + 128;
        }
        return pixels;
    }


    , getFilterBlur: function (pixels, width, height, value, alphaChannel) {
        var mul_table = [
            512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
            454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
            482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
            437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
            497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
            320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
            446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
            329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
            505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
            399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
            324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
            268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
            451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
            385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
            332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
            289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];


        var shg_table = [
            9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
            17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
            19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
            20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
            21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
            21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
            22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
            22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
            23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
            23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
            23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
            23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
            24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
            24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
            24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
            24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

        if ( alphaChannel )
            return stackBlurCanvasRGBA( pixels, value );
        else
            return stackBlurCanvasRGB( pixels, value );


        function stackBlurCanvasRGBA( imgData, radius )
        {
            var pixels = imgData.data;

            if ( isNaN(radius) || radius < 1 ) return;
            radius |= 0;

            var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
                r_out_sum, g_out_sum, b_out_sum, a_out_sum,
                r_in_sum, g_in_sum, b_in_sum, a_in_sum,
                pr, pg, pb, pa, rbs;

            var div = radius + radius + 1;
            var w4 = width << 2;
            var widthMinus1  = width - 1;
            var heightMinus1 = height - 1;
            var radiusPlus1  = radius + 1;
            var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;

            var stackStart = { r : 0 , g : 0 , b : 0 , a : 0 , next : null };
            var stack = stackStart;
            for ( i = 1; i < div; i++ )
            {
                stack = stack.next = { r : 0 , g : 0 , b : 0 , a : 0 , next : null };
                if ( i == radiusPlus1 ) var stackEnd = stack;
            }
            stack.next = stackStart;
            var stackIn = null;
            var stackOut = null;

            yw = yi = 0;

            var mul_sum = mul_table[radius];
            var shg_sum = shg_table[radius];

            for ( y = 0; y < height; y++ )
            {
                r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

                r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
                g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
                b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
                a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );

                r_sum += sumFactor * pr;
                g_sum += sumFactor * pg;
                b_sum += sumFactor * pb;
                a_sum += sumFactor * pa;

                stack = stackStart;

                for( i = 0; i < radiusPlus1; i++ )
                {
                    stack.r = pr;
                    stack.g = pg;
                    stack.b = pb;
                    stack.a = pa;
                    stack = stack.next;
                }

                for( i = 1; i < radiusPlus1; i++ )
                {
                    p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
                    r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
                    g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
                    b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
                    a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;

                    r_in_sum += pr;
                    g_in_sum += pg;
                    b_in_sum += pb;
                    a_in_sum += pa;

                    stack = stack.next;
                }


                stackIn = stackStart;
                stackOut = stackEnd;
                for ( x = 0; x < width; x++ )
                {
                    pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
                    if ( pa != 0 )
                    {
                        pa = 255 / pa;
                        pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
                        pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                        pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
                    } else {
                        pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
                    }

                    r_sum -= r_out_sum;
                    g_sum -= g_out_sum;
                    b_sum -= b_out_sum;
                    a_sum -= a_out_sum;

                    r_out_sum -= stackIn.r;
                    g_out_sum -= stackIn.g;
                    b_out_sum -= stackIn.b;
                    a_out_sum -= stackIn.a;

                    p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

                    r_in_sum += ( stackIn.r = pixels[p]);
                    g_in_sum += ( stackIn.g = pixels[p+1]);
                    b_in_sum += ( stackIn.b = pixels[p+2]);
                    a_in_sum += ( stackIn.a = pixels[p+3]);

                    r_sum += r_in_sum;
                    g_sum += g_in_sum;
                    b_sum += b_in_sum;
                    a_sum += a_in_sum;

                    stackIn = stackIn.next;

                    r_out_sum += ( pr = stackOut.r );
                    g_out_sum += ( pg = stackOut.g );
                    b_out_sum += ( pb = stackOut.b );
                    a_out_sum += ( pa = stackOut.a );

                    r_in_sum -= pr;
                    g_in_sum -= pg;
                    b_in_sum -= pb;
                    a_in_sum -= pa;

                    stackOut = stackOut.next;

                    yi += 4;
                }
                yw += width;
            }


            for ( x = 0; x < width; x++ )
            {
                g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

                yi = x << 2;
                r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
                g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
                b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
                a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);

                r_sum += sumFactor * pr;
                g_sum += sumFactor * pg;
                b_sum += sumFactor * pb;
                a_sum += sumFactor * pa;

                stack = stackStart;

                for( i = 0; i < radiusPlus1; i++ )
                {
                    stack.r = pr;
                    stack.g = pg;
                    stack.b = pb;
                    stack.a = pa;
                    stack = stack.next;
                }

                yp = width;

                for( i = 1; i <= radius; i++ )
                {
                    yi = ( yp + x ) << 2;

                    r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
                    g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
                    b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
                    a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;

                    r_in_sum += pr;
                    g_in_sum += pg;
                    b_in_sum += pb;
                    a_in_sum += pa;

                    stack = stack.next;

                    if( i < heightMinus1 )
                    {
                        yp += width;
                    }
                }

                yi = x;
                stackIn = stackStart;
                stackOut = stackEnd;
                for ( y = 0; y < height; y++ )
                {
                    p = yi << 2;
                    pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
                    if ( pa > 0 )
                    {
                        pa = 255 / pa;
                        pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
                        pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
                        pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
                    } else {
                        pixels[p] = pixels[p+1] = pixels[p+2] = 0;
                    }

                    r_sum -= r_out_sum;
                    g_sum -= g_out_sum;
                    b_sum -= b_out_sum;
                    a_sum -= a_out_sum;

                    r_out_sum -= stackIn.r;
                    g_out_sum -= stackIn.g;
                    b_out_sum -= stackIn.b;
                    a_out_sum -= stackIn.a;

                    p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

                    r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
                    g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
                    b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
                    a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));

                    stackIn = stackIn.next;

                    r_out_sum += ( pr = stackOut.r );
                    g_out_sum += ( pg = stackOut.g );
                    b_out_sum += ( pb = stackOut.b );
                    a_out_sum += ( pa = stackOut.a );

                    r_in_sum -= pr;
                    g_in_sum -= pg;
                    b_in_sum -= pb;
                    a_in_sum -= pa;

                    stackOut = stackOut.next;

                    yi += width;
                }
            }

            return imgData;

        }


        function stackBlurCanvasRGB( imgData, radius )
        {
            if ( isNaN(radius) || radius < 1 ) return;
            radius |= 0;

            var pixels = imgData.data;

            var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
                r_out_sum, g_out_sum, b_out_sum,
                r_in_sum, g_in_sum, b_in_sum,
                pr, pg, pb, rbs;

            var div = radius + radius + 1;
            var w4 = width << 2;
            var widthMinus1  = width - 1;
            var heightMinus1 = height - 1;
            var radiusPlus1  = radius + 1;
            var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;

            var stackStart = { r : 0 , g : 0 , b : 0 , a : 0 , next : null };
            var stack = stackStart;
            for ( i = 1; i < div; i++ )
            {
                stack = stack.next = { r : 0 , g : 0 , b : 0 , a : 0 , next : null };
                if ( i == radiusPlus1 ) var stackEnd = stack;
            }
            stack.next = stackStart;
            var stackIn = null;
            var stackOut = null;

            yw = yi = 0;

            var mul_sum = mul_table[radius];
            var shg_sum = shg_table[radius];

            for ( y = 0; y < height; y++ )
            {
                r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

                r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
                g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
                b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );

                r_sum += sumFactor * pr;
                g_sum += sumFactor * pg;
                b_sum += sumFactor * pb;

                stack = stackStart;

                for( i = 0; i < radiusPlus1; i++ )
                {
                    stack.r = pr;
                    stack.g = pg;
                    stack.b = pb;
                    stack = stack.next;
                }

                for( i = 1; i < radiusPlus1; i++ )
                {
                    p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
                    r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
                    g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
                    b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;

                    r_in_sum += pr;
                    g_in_sum += pg;
                    b_in_sum += pb;

                    stack = stack.next;
                }


                stackIn = stackStart;
                stackOut = stackEnd;
                for ( x = 0; x < width; x++ )
                {
                    pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
                    pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
                    pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;

                    r_sum -= r_out_sum;
                    g_sum -= g_out_sum;
                    b_sum -= b_out_sum;

                    r_out_sum -= stackIn.r;
                    g_out_sum -= stackIn.g;
                    b_out_sum -= stackIn.b;

                    p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

                    r_in_sum += ( stackIn.r = pixels[p]);
                    g_in_sum += ( stackIn.g = pixels[p+1]);
                    b_in_sum += ( stackIn.b = pixels[p+2]);

                    r_sum += r_in_sum;
                    g_sum += g_in_sum;
                    b_sum += b_in_sum;

                    stackIn = stackIn.next;

                    r_out_sum += ( pr = stackOut.r );
                    g_out_sum += ( pg = stackOut.g );
                    b_out_sum += ( pb = stackOut.b );

                    r_in_sum -= pr;
                    g_in_sum -= pg;
                    b_in_sum -= pb;

                    stackOut = stackOut.next;

                    yi += 4;
                }
                yw += width;
            }


            for ( x = 0; x < width; x++ )
            {
                g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

                yi = x << 2;
                r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
                g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
                b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);

                r_sum += sumFactor * pr;
                g_sum += sumFactor * pg;
                b_sum += sumFactor * pb;

                stack = stackStart;

                for( i = 0; i < radiusPlus1; i++ )
                {
                    stack.r = pr;
                    stack.g = pg;
                    stack.b = pb;
                    stack = stack.next;
                }

                yp = width;

                for( i = 1; i <= radius; i++ )
                {
                    yi = ( yp + x ) << 2;

                    r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
                    g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
                    b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;

                    r_in_sum += pr;
                    g_in_sum += pg;
                    b_in_sum += pb;

                    stack = stack.next;

                    if( i < heightMinus1 )
                    {
                        yp += width;
                    }
                }

                yi = x;
                stackIn = stackStart;
                stackOut = stackEnd;
                for ( y = 0; y < height; y++ )
                {
                    p = yi << 2;
                    pixels[p]   = (r_sum * mul_sum) >> shg_sum;
                    pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
                    pixels[p+2] = (b_sum * mul_sum) >> shg_sum;

                    r_sum -= r_out_sum;
                    g_sum -= g_out_sum;
                    b_sum -= b_out_sum;

                    r_out_sum -= stackIn.r;
                    g_out_sum -= stackIn.g;
                    b_out_sum -= stackIn.b;

                    p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

                    r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
                    g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
                    b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));

                    stackIn = stackIn.next;

                    r_out_sum += ( pr = stackOut.r );
                    g_out_sum += ( pg = stackOut.g );
                    b_out_sum += ( pb = stackOut.b );

                    r_in_sum -= pr;
                    g_in_sum -= pg;
                    b_in_sum -= pb;

                    stackOut = stackOut.next;

                    yi += width;
                }
            }

            return imgData;
        }

    }




    , getFilterSharpen: function(dstData, mix){
        var ctx = this.ctx;
        var w = Math.round( this.currentWidth*this.zoomValue );
        var h = Math.round( this.currentHeight*this.zoomValue );

        console.log( w, h )

        var weights =  [0, -1, 0,  -1, 5, -1,  0, -1, 0],
            katet = Math.round(Math.sqrt(weights.length)),
            half = (katet * 0.5) |0,
            dstData = ctx.createImageData(w, h),
            dstBuff = dstData.data,
            srcBuff = ctx.getImageData(0, 0, w, h).data,
            y = h;

        while(y--) {

            x = w;

            while(x--) {

                var sy = y,
                    sx = x,
                    dstOff = (y * w + x) * 4,
                    r = 0, g = 0, b = 0, a = 0;

                for (var cy = 0; cy < katet; cy++) {
                    for (var cx = 0; cx < katet; cx++) {

                        var scy = sy + cy - half;
                        var scx = sx + cx - half;

                        if (scy >= 0 && scy < h && scx >= 0 && scx < w) {

                            var srcOff = (scy * w + scx) * 4;
                            var wt = weights[cy * katet + cx];

                            r += srcBuff[srcOff] * wt;
                            g += srcBuff[srcOff + 1] * wt;
                            b += srcBuff[srcOff + 2] * wt;
                            a += srcBuff[srcOff + 3] * wt;
                        }
                    }
                }

                dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
                dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
                dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix)
                dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
            }
        }

        return dstData;
        //ctx.putImageData(dstData, 0, 0);

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