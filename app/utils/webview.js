export default {
    data() {
        return {
            xturl: '',
            playurl: '',
            webv: '',
            videoContext: null,
        };
    },
    
  //  import webvplay from '@/utils/webview.js';
//export default {
    //mixins: [webvplay],
    methods: {
        async addvideo() {
            this.videoContext = plus.video.createVideoPlayer('videoContext', {
                src: this.playurl,
                top: '100px',
                left: '0px',
                width: '100%',
                height: '200px',
                position: 'absolute',
                autoplay: true,
                codec: 'hardware',
                httpCache: true,
                playStrategy: 3
            });
        },
        xtcallback(e) {
			console.log(e.url);
            if (
                e.url.indexOf('?url=') == -1 &&
                e.url.indexOf('beiyong') == -1 &&
                e.url.indexOf('SVG') == -1 &&
                e.url.indexOf('update') == -1 &&
                e.url.indexOf('51.la/') == -1 &&
                !e.url.endsWith('.js') &&
                e.url.indexOf('.png') == -1 &&
                e.url.indexOf('.css') == -1 &&
                e.url.indexOf('gif') == -1 &&
                e.url.indexOf('.php') == -1 &&
                !e.url.endsWith('.jpg') &&
                e.url.indexOf('umuuid') == -1
            ) {
                let matchrule = uni.getStorageSync('matchrule');
                let re = new RegExp(matchrule, 'g')
                let t = re.exec(e.url);
                if (!t) {
                    this.playurl = e.url;
                    console.log(this.playurl);
                }
            }
        },
         getplayurl(url, matchrule = '!!!') {
            uni.setStorageSync('matchrule', matchrule);
            // uni.showToast({
            //     title: '嗅探中...',
            //     duration: 30000,
            //     icon: 'loading'
            // });
            this.webv.clear(); //清除之前的加载
            uni.setStorageSync('playurl', '');
            this.webv.loadURL(url);
			console.log(url)
            // this.webv.overrideUrlLoading({ mode: 'reject' }, function(e) {});
            this.webv.overrideUrlLoading({
                mode: 'allow',
                match: '.*(mp4|m3u8|flv|url=|video).*'
            }, function(e) {
				                    // console.log(e.url);
			});
            this.webv.listenResourceLoading({
                match: '.*(mp4|m3u8|flv|url=|video).*'
            }, function(e){
				if (
				    e.url.indexOf('?url=') == -1 &&
				    e.url.indexOf('beiyong') == -1 &&
				    e.url.indexOf('SVG') == -1 &&
				    e.url.indexOf('update') == -1 &&
				    e.url.indexOf('51.la/') == -1 &&
				    !e.url.endsWith('.js') &&
				    e.url.indexOf('.png') == -1 &&
				    e.url.indexOf('.css') == -1 &&
				    e.url.indexOf('gif') == -1 &&
				    e.url.indexOf('.php') == -1 &&
				    !e.url.endsWith('.jpg') &&
				    e.url.indexOf('umuuid') == -1
				) {
				    let matchrule = uni.getStorageSync('matchrule');
				    let re = new RegExp(matchrule, 'g')
				    let t = re.exec(e.url);
				    if (!t) {
						console.log(1111111)
						console.log(e.url)
				        this.playurl = e.url;
				        console.log(this.playurl);
				    }
				}
			})
            // let that = this;
            // let alltime = 0;
            // let obj = setInterval(function() {
            //     let urlPlay = uni.getStorageSync('playurl');
            //     alltime = alltime + 2000;
            //     if (alltime < 20000 && urlPlay != '') {
            //         uni.hideToast();
            //         that.playurl = urlPlay;
            //         that.webv.clear();
            //         clearInterval(obj);
            //     }
            //     if (alltime > 20000) {
            //         uni.hideToast();
            //         uni.showToast({
            //             title: '嗅探超时！',
            //             duration: 1000
            //         });
            //         that.webv.clear();
            //         clearInterval(obj);
            //     }
            // }, 2000);
        },
        preweb() {
            this.webv = plus.webview.create('', 'xtwebview', {
                plusrequire: 'none', //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
                'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
                disablePlus: true,
                hardwareAccelerated: true,
                blockNetworkImage: true,
                cachemode: "noCache",
                render: "onscreen"
            });
        }
    },

    onLoad: function() {
        this.preweb();
    },
    onUnload: function() {
        this.webv.close();
    }
}
