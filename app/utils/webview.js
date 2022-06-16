export default {
    data() {
        return {
            xturl: '',
            playurl: '',
            webv: '',
        };
    },

    //  import webvplay from '@/utils/webview.js';
    //export default {
    //mixins: [webvplay],
    methods: {
       xttrueurl(e) {
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
				   this.playurl=e.url
                   console.log(e.url);
				   uni.hideToast();
				    this.webv.loadURL('');
				    this.webv.clear();
               }
           }
       },
        xtplayurl(url, matchrule = '!!!') {
			this.playurl=''
            uni.setStorageSync('matchrule', matchrule);
            uni.showToast({
                title: '嗅探中...',
                duration: 30000,
                icon: 'loading'
            });
			
            this.webv.loadURL(url);
            // this.webv.overrideUrlLoading({ mode: 'reject' }, function(e) {});
            this.webv.overrideResourceRequest([{ match: '.*jpg|.*js|.*png|.*css|.*gif|.*php|.*SVG', redirect: '' }])
            this.webv.overrideUrlLoading({
                mode: 'allow',
                match: '.*(mp4|m3u8|flv|url=|video).*'
            }, function(e) {
                // console.log(e.url);
            });
            this.webv.listenResourceLoading({
                match: '.*(mp4|m3u8|flv|url=|video).*'
            }, this.xttrueurl)
            let that = this;
			setTimeout(function(){
				if(that.playurl==""){
					 uni.hideToast();
					 uni.showToast({
					             title: '嗅探超时！',
					             duration: 1000
					         });
				}
			},20000)
            // let alltime = 0;
            // let obj = setInterval(function() {
            //     let urlPlay = uni.getStorageSync('playurl');
            //     alltime = alltime + 2000;
            //     if (alltime < 30000 && urlPlay != '') {
            //         uni.hideToast();
            //         that.playurl = urlPlay;
            //         that.webv.loadURL('');
            //         that.webv.clear();
            //         clearInterval(obj);
            //     }
            //     if (alltime > 30000) {
            //         uni.hideToast();
            //         uni.showToast({
            //             title: '嗅探超时！',
            //             duration: 1000
            //         });
            //         that.webv.loadURL('');
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
