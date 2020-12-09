        const el = document.querySelector(".item");

        var img = new Image();
        img.src = "http://placehold.it/320x100";        
        img.addEventListener('load',function(){
            var ctx = document.getElementById('canvas').getContext("2d");
            ctx.drawImage(img,(canvas.width-img.width)/2,(canvas.height-img.height)/2,img.width,img.height);            
        })

        var targetImg = {
            limitLeft : 150 ,
            limitTop : 110 ,
            limitRight : 470,
            limitBottom : 220,
            maxWidth : 320,
            minWidth : 50,
            maxHeight : 100,
            minHeight : 100,
        }

        var isResizing = false;
        
        var limitLeft = el.offsetLeft;
        var limitTop = el.offsetTop;
        
        el.addEventListener("mousedown", mousedown);

        function mousedown(e) {
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);

        var prevX = e.clientX;
        var prevY = e.clientY;
        
        function mousemove(e) {
            if (!isResizing) {
            var newX = prevX - e.clientX;
            var newY = prevY - e.clientY;

            const rect = el.getBoundingClientRect();
            //console.log(rect);
            // if(rect.left < 152){
            //     console.log("1");
            //     //el.style.left = limitLeft + "px";
            //     mouseup();
            //     e.preventDefault();
            // }
            // if(rect.top < 111){
            //     //el.style.top = limitTop + "px";
            //     mouseup();
            //     e.preventDefault();
            // }
            el.style.left = rect.left - newX + "px";
            el.style.top = rect.top - newY + "px";

            prevX = e.clientX;
            prevY = e.clientY;
            }
        }

        function mouseup() {
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseup", mouseup);
            }
        }

        const resizers = document.querySelectorAll(".resizer");
        var currentResizer;

        for (var resizer of resizers) {
        resizer.addEventListener("mousedown", mousedown);

        function mousedown(e) {
            currentResizer = e.target;
            isResizing = true;

            var prevX = e.clientX;
            var prevY = e.clientY;

            window.addEventListener("mousemove", mousemove);
            window.addEventListener("mouseup", mouseup);

            function mousemove(e) {
            const rect = el.getBoundingClientRect();
                console.log(rect);
            // if(rect.left < 152){
            //     console.log("1");
            //     //el.style.left = limitLeft + "px";
            //     mouseup();
                
            // }
            // if(rect.top < 111){
            //     //el.style.top = limitTop + "px";
            //     mouseup();
            // }
            if (currentResizer.classList.contains("se")) {
                if( rect.right > targetImg.limitRight ){
                    el.style.width = (targetImg.maxWidth - (el.left - targetImg.limitLeft) ) + "px";
                } else {
                    el.style.width = rect.width - (prevX - e.clientX) + "px";

                }
                if( rect.height > targetImg.maxHeight ){
                    el.style.height = targetImg.maxHeight + "px";
                } else {
                    el.style.height = rect.height - (prevY - e.clientY) + "px";

                }
            } else if (currentResizer.classList.contains("sw")) {
                if( rect.width < 320){
                    el.style.width = rect.width + (prevX - e.clientX) + "px";
                }
                if( rect.height > 100){
                    el.style.height = rect.height - (prevY - e.clientY) + "px";
                }
                el.style.left = rect.left - (prevX - e.clientX) + "px";
            } else if (currentResizer.classList.contains("ne")) {
                el.style.width = rect.width - (prevX - e.clientX) + "px";
                el.style.height = rect.height + (prevY - e.clientY) + "px";
                el.style.top = rect.top - (prevY - e.clientY) + "px";
            } else {
                el.style.width = rect.width + (prevX - e.clientX) + "px";
                el.style.height = rect.height + (prevY - e.clientY) + "px";
                el.style.top = rect.top - (prevY - e.clientY) + "px";
                el.style.left = rect.left - (prevX - e.clientX) + "px";
            }

            prevX = e.clientX;
            prevY = e.clientY;
            }

            function mouseup() {
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseup", mouseup);
            isResizing = false;
            }
        }
    }
