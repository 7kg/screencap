const {desktopCapturer} = require('electron')
const { remote: { dialog } } = require('electron');
const fs = require('fs');


/**
 * [getSources 获取窗口或屏幕源]
 * @param  {String}   types window(窗口), screen(屏)
 * @param  {Function} fn    回调
 */
function getSources(types, fn){
    let prev_title = document.title;
    let temp_title = +new Date + '';
    document.title = temp_title;

    desktopCapturer.getSources({ types: [types] }, function(error, sources) {
        if (error) throw error;
        let result = sources.filter(item => item.name !== temp_title);
        document.title = prev_title;
        fn && fn(result);
    });
}

function getVideo(sources_id, has_audio, fn){
    let opts = {
        audio: false,
        video: true
    };
    if(sources_id){
        opts.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources_id
            }
        }
    }
    if(has_audio){
        opts.audio = true;
    }
    navigator.mediaDevices.getUserMedia(opts).then(stream => {
        fn && fn(stream);
    }, err => {
        if(err.name == 'DevicesNotFoundError'){
            alert('未发现到摄像设备!');
        }else{
            alert(err.name || err.message || '操作失败');
        }
    });
}


class Record{
    constructor(stream){
        if(!stream){
            alert('暂无可录制源!');
            return;
        }
        this.chunk = [];
        this.recorder = new MediaRecorder(stream, {mimeType : 'video/webm'});
        this.recorder.ondataavailable = e => {
            this.chunk.push(e.data);
        };
        this.recorder.start();
    }
    stop(){
        this.recorder.stop();
    }
    getBuffer(fn){
        let blob = new Blob(this.chunk, {type: 'video/webm'});
        let fr = new FileReader();
        fr.onload = () => {
            let bf = new Buffer(fr.result);
            fn && fn(bf);
        };
        fr.readAsArrayBuffer(blob);
    }
}

function showSaveDialog(buffer){
    dialog.showSaveDialog({
        filters: [{ name: `web file`, extensions: ['webm'] }]
    }, fileName => {
        if(fileName){
            fs.writeFile(fileName, buffer, err => {
                if(err) alert("An error ocurred creating the file " + err.message);
            });
        }
    });
}
module.exports = {
    getSources: getSources,
    getVideo: getVideo,
    Record: Record,
    showSaveDialog: showSaveDialog
};
