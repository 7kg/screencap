(function(){
    const $ = require('jquery');
    const util = require('./util');

    let video = $('video').get(0);

    // 页面渲染
    function render(type, has_radio){
        $('.screen_list').empty();

        if(type === 'window' || type === 'screen'){
            util.getSources(type, function(sources){
                util.getVideo(sources[0].id, false, function(stream){
                    renderVideo(stream);
                });
                if(sources.length > 1){
                    renderScreenList(sources);
                }
            });
        }else{
            util.getVideo(null, !!has_radio, function(stream){
                renderVideo(stream);
            });
        }
    }

    // 窗口及屏幕源列表渲染
    function renderScreenList(sources){
        let $lis = $.map(sources, function(item){
            return $(`<li data-id="${item.id}" style="background-image: url(${item.thumbnail.toDataURL()});">
                    <div class="title">${item.name}</div>
                </li>`);
        });
        $('.screen_list').append($lis);
        $('.screen_list li:eq(0)').addClass('active');
    }

    // 视频渲染
    function renderVideo(stream){
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    }

    // 视频存储
    let saveVideo;

    $(document).on('click', '.screen_list li:not(.active)',function(){
        var id = $(this).data('id');
        $(this).addClass('active').siblings('.active').removeClass('active');
        util.getVideo(id, false, function(stream){
            renderVideo(stream);
        });
    }).on('click', '.btn_switch',function(){
        if($(this).is('.stop')){
            $(this).removeClass('stop');
            saveVideo.stop();
            setTimeout(function(){
                saveVideo.getBuffer(buffer => {
                    util.showSaveDialog(buffer);
                });
            }, 0);
        }else{
            if(video.srcObject){
                $(this).addClass('stop');
            }
            saveVideo = new util.Record(video.srcObject);
        }
    }).on('click', '.oper_item:not(.active)',function(){
        $(this).addClass('active').siblings('.active').removeClass('active');
        var id = $(this).data('id');
        render(id);
    });

    $('.oper_item').eq(0).trigger('click');
})();