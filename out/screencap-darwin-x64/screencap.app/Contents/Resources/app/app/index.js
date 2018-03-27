(function(){
    const $ = require('jquery');
    const util = require('./util');

    let video = $('video').get(0);

    // 页面渲染
    function render(type, has_radio, fn){
        $('.screen_list').empty();

        if(type === 'window' || type === 'screen'){
            util.getSources(type, function(sources){
                util.getVideo(sources[0].id, false, function(stream){
                    renderVideo(stream);
                    fn && fn(true);
                });
                if(sources.length > 1){
                    renderScreenList(sources);
                }
            });
        }else{
            util.getVideo(null, !!has_radio, function(stream){
                renderVideo(stream);
                fn && fn(true);
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

    // 视频存储
    let saveVideo;

    // 视频渲染
    function renderVideo(stream){
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
        saveVideo = new util.Record(stream);
    }

    $(document).on('click', '.screen_list li:not(.active)',function(){
        var id = $(this).data('id');
        var $this= $(this);
        util.getVideo(id, false, function(stream){
            renderVideo(stream);
            $this.addClass('active').siblings('.active').removeClass('active');
        });
    }).on('click', '.btn_switch',function(){
        saveVideo.stop();
        setTimeout(function(){
            saveVideo.getBuffer(buffer => {
                util.showSaveDialog(buffer);
                saveVideo = new util.Record(video.srcObject);
            });
        }, 0);
    }).on('click', '.oper_item:not(.active)',function(){
        var $this = $(this);
        var id = $(this).data('id');
        render(id, id === 'camera', flag => {
            if(flag){
                $this.addClass('active').siblings('.active').removeClass('active');
            }
        });
    });

    $('.oper_item').eq(0).trigger('click');
})();