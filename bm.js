/**
 * User: kjh
 * Date: 13. 3. 13
 * Time: 오전 10:47
 * WEVEN 프레임워크의 프론트앤드 개발용 bm 프레임워크.
 * bm 패키지로 사용되는 모든 소스는 bluestream의 저작권이 있으므로 무단 사용 및 재 배포를 금합니다.
 * 개발 및 납품에 사용된 소스에 한해 유지보수 및 개선 프로젝트 수준의 사용은 가능합니다.
 */


/* common */
Array.prototype.indexOf = function( element ){
    var len = this.length;
    for( var i=0; i<len; i++ ){
        if( this[ i ] === element ) return i;
    }
    return -1;
    // var i = this.length;
    // while( i-- ) if( this[ i ] === element ) return i;
    // return -1;
};

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                    res.push(val);
            }
        }
        return res;
    };
}



/* package define */
bm = {
    isMobile : /iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson|LG|SAMSUNG|Samsung/i.test(navigator.userAgent)

    ,__isWindowLoad : false
    ,__onLoad : []
    ,__onLoadHandler : function(){
        this.isLoad = true;
        var len = this.__onLoad.length;
        while( len-- ) this.__onLoad.pop()();
        this.__onLoad.length = 0;
    }

    ,isLoad : false
    ,onLoad : function(fn){
        if( this.isLoad ){
            fn();
            return;
        }
        this.__onLoad.push( fn );
    }
}

window.onload = function(){
    bm.__isWindowLoad = true;
    bm.__onLoadHandler();
}


//SNS 보내기 및 북마크 스크립트 시작
function openSNSWin(openUrl)
{
    var winObj;
    winObj = window.open(openUrl,"sendNewsWin","width=1024, height=800");
}

function snsSend( media, sns_url, sns_title )
{
    var sns_sendUrl = '' ;

    if ( sns_sendUrl != '' ) openSNSWin(sns_sendUrl)  ;
    switch(media)
    {
        case "twitter":
            sns_sendUrl = "http://twitter.com/home?"
                + "status="+ encodeURIComponent(sns_title)
                + "+"
                + encodeURIComponent(sns_url) ;
            break;
        case "metoday":
            sns_sendUrl = "http://me2day.net/posts/new?"
                + "new_post[body]=" + encodeURIComponent(sns_title)
                + ":" + encodeURIComponent(sns_url)
            break;
        case "naver":
            sns_sendUrl = "http://bookmark.naver.com/post?ns=1"
                + "&title=" + encodeURIComponent(sns_title)
                + "&url="+encodeURIComponent(sns_url) ;
            break;
        case "google":
            sns_sendUrl = "http://www.google.com/bookmarks/mark?op=add"
                + "&title=" + encodeURIComponent(sns_title)
                +"&bkmk="+encodeURIComponent(sns_url) ;
            break;
        case "facebook":
            sns_sendUrl = "http://www.facebook.com/sharer.php?"
                + "u="+ encodeURIComponent(sns_url)
                + "&t=" + encodeURIComponent(sns_title) ;
            break;
        case "band":
            sns_sendUrl = "http://www.band.us/plugin/share?body=" + encodeURIComponent( sns_title + "\n" + sns_url);
            break;
        case "kas":
            sns_sendUrl = "https://story.kakao.com/share?url=" + sns_url + "&text=" + sns_title + "\n";
            break;
    }

    if( sns_sendUrl != '' ){
        openSNSWin(sns_sendUrl);
    }


    return false;
}
