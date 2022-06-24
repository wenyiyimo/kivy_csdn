<script>
import db from '@/utils/database.js';
import http from '@/utils/http.js.';
export default {
	globalData: {
		downurl: '',
		downindex: 0,
		downloadlists: [],
		m3u8len: 0, //m3u8长度
		hasdownlen: 0, //已经下载的长度
		hasdown: [], //已经下载完成的片段路径
		m3u8data: [], //m3u8片段信息
		webview: '',
		m3u8href: []
	},
	onLaunch: function() {
		db.initdb();
		uni.setKeepScreenOn({
			keepScreenOn: true
		});
		this.prewebview();
		this.globalData.downloadlists = uni.getStorageInfoSync('downloadlists');
		this.startDown();
		let sWidth = uni.getSystemInfoSync().screenWidth;
		let sHeight = uni.getSystemInfoSync().screenHeight;
		if (sWidth > sHeight) {
			plus.screen.lockOrientation('landscape');
		} else {
			plus.screen.lockOrientation('portrait');
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		prewebview() {
			this.globalData.webview = plus.webview.create('', 'xtwebview', {
				plusrequire: 'none', //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
				'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
				disablePlus: true,
				hardwareAccelerated: true,
				blockNetworkImage: true,
				cachemode: 'noCache',
				render: 'onscreen'
			});
		},
		//开始下载
		async startdown() {
			for (let i = 0; i < this.globalData.downloadlists.length; i++) {
				if ((this.globalData.downloadlists[i][3] == '开始') | '等待中') {
					this.globalData.downloadlists[i][3] = '嗅探中';
					this.globalData.downindex = i;
					this.getdownurl(this.globalData.downloadlists[i][2]);
					return;
				}
			}
			this.globalData.webview.close();
		},
		async getdownurl(url) {
			let temp = this.globalData.downurl;
			this.globalData.webview.loadURL(url);
			// this.webv.overrideUrlLoading({ mode: 'reject' }, function(e) {});
			this.globalData.webview.overrideResourceRequest([
				{
					match: '.*jpg|.*js|.*png|.*css|.*gif|.*php|.*SVG',
					redirect: ''
				}
			]);
			this.globalData.webview.overrideUrlLoading(
				{
					mode: 'allow',
					match: '.*(mp4|m3u8|flv|url=|video).*'
				},
				function(e) {
					// console.log(e.url);
				}
			);
			this.globalData.webview.listenResourceLoading(
				{
					match: '.*(mp4|m3u8|flv|url=|video).*'
				},
				this.truedownurl
			);
			let that = this;
			setTimeout(function() {
				if (that.globalData.downurl == temp) {
					that.globalData.downloadlists[that.globalData.downindex][3] = '嗅探失败';
					uni.setStorageSync('downloadlists', that.globalData.downloadlists);
					that.globalData.webview.loadURL('');
					that.globalData.webview.clear();
					that.startdown();
				}
			}, 30000);
		},
		async truedownurl(e) {
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
				let flag = await this.judgexturl(e.url);
				if (flag.flag) {
					this.globalData.downurl = e.url;
					console.log(e.url);
					this.judgedownurl(e.url);
					this.globalData.webview.loadURL('');
					this.globalData.webview.clear();
				}
			}
		},
		async judgexturl(url) {
			let extrakey = uni.getStorageSync('extrakey');
			for (let i of extrakey) {
				if (url.indexOf(i) != -1) {
					return {
						flag: false
					};
				}
			}
			return {
				flag: true
			};
		},
		//判断m3u8还是MP4
		async judgedownurl(url) {
			if (url.indexOf('m3u8') == -1) {
				this.downmp4(url);
			} else {
				this.globalData.downloadlists[this.globalData.downindex][3] = '解析中';
				let res = await http.get(url);
				if (res.indexOf('#EXT') != -1) {
					let flag = await this.geturldata(res, url);
					if (flag.flag) {
						this.globalData.m3u8len = this.globalData.m3u8href.length;
						this.downm3u8();
					}
				} else {
					this.globalData.downloadlists[this.globalData.downindex][3] = '嗅探失败';
					uni.setStorageSync('downloadlists', this.globalData.downloadlists);
					this.startdown();
				}
			}
		},
		//下载MP4
		async downmp4(url) {
			let dtask = plus.downloader.createDownload(url, {}, this.finishmp4);
			dtask.addEventListener('statechanged', this.onstatechanged, false);
			dtask.start();
		},
		async finishmp4(d, status) {
			if (status == 200) {
				let downpath = plus.io.convertLocalFileSystemURL(d.filename);
				this.globalData.downloadlists[this.globalData.downindex][3] = '已完成';
				this.globalData.downloadlists[this.globalData.downindex][4] = downpath;
				this.globalData.downloadlists[this.globalData.downindex][5] = [downpath];
				uni.setStorageSync('downloadlists', this.globalData.downloadlists);
				this.startdown();
			} else {
				this.globalData.downloadlists[this.globalData.downindex][3] = '下载失败';
				uni.setStorageSync('downloadlists', this.globalData.downloadlists);
				this.startdown();
			}
		},
		onstatechanged(dtask, status) {
			switch (dtask.state) {
				case 1:
					this.globalData.downloadLists[this.globalData.downindex][3] = '连接中';
					break;
				case 2:
					this.globalData.downloadLists[this.globalData.downindex][3] = '已连接';
					break;
				case 3:
					prg = parseInt((parseFloat(dtask.downloadedSize) / parseFloat(dtask.totalSize)) * 100);
					this.globalData.downloadLists[this.globalData.downindex][3] = prg + '%';
					break;
				case 4:
					this.globalData.downloadLists[this.globalData.downindex][3] = '已完成';
					//下载完成
					break;
			}
		},
		//获取m3u8片段信息
		async geturldata(res, host) {
			let num = 0;
			let arr = res.split('\n');
			for (let line of arr) {
				line = line.trim();
				if (line == '') {
					continue;
				}
				if (line.startsWith('#EXT')) {
					this.globalData.m3u8data.push(line);
					num = num + 1;
				} else {
					if (line.startsWith('/')) {
						let url = host + line;
					}
					if (line.indexOf('://') != -1) {
						let url = line;
					}
					this.globalData.m3u8data.push(url);
					this.globalData.m3u8href.push([url, num]);
					num = num + 1;
				}
			}
			return {
				flag: true
			};
		},
		//下载m3u8片段
		async downm3u8() {
			this.globalData.downloadlists[this.globalData.downindex][3] = `${this.globalData.hasdownlen}/${this.globalData.m3u8len}`;
			if (this.globalData.hasdownlen == this.globalData.m3u8len) {
				this.writeFile();
			} else {
				this.downslice(this.globalData.m3u8href[this.globalData.hasdownlen][0]);
			}
		},
		async downslice(url) {
			let dtask = plus.downloader.createDownload(url, {}, this.finishslice);
			dtask.start();
		},
		async finishslice(d, status) {
			if (status == 200) {
				let downpath = plus.io.convertLocalFileSystemURL(d.filename);
				this.globalData.hasdown.push(downpath);
				this.globalData.m3u8data[this.globalData.m3u8href[this.globalData.hasdownlen][1]] = downpath;
				this.globalData.hasdownlen = this.globalData.hasdownlen + 1;
				this.downm3u8();
			} else {
				this.globalData.hasdownlen = this.globalData.hasdownlen + 1;
				this.downm3u8();
			}
		},
		writeFile() {
			let text = '';
			for (let line of this.globalData.m3u8data) {
				text = text + line + '\n';
			}
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fobject) {
				// fs.root是根目录操作对象DirectoryEntry
				fobject.root.getDirectory(
					'_doc/',
					{
						create: true
					},
					function(fileEntry) {
						console.log(fileEntry.toLocalURL());
					}
				);
			});
			let that = this;
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fobject) {
				// fs.root是根目录操作对象DirectoryEntry
				fobject.root.getFile(
					'_doc/' + that.globalData.downloadlists[that.globalData.downindex][2].replace(RegExp('/', 'g'), '-') + '.m3u8',
					{
						create: true
					},
					function(fileEntry) {
						console.log(fileEntry.toLocalURL());
						that.globalData.downloadlists[that.globalData.downindex][3] = '已完成';
						that.globalData.downloadlists[that.globalData.downindex][4] = fileEntry.toLocalURL();
						that.globalData.hasdown.push(fileEntry.toLocalURL());
						that.globalData.downloadlists[that.globalData.downindex][5] = that.globalData.hasdown;
						uni.setStorageSync('downloadlists', this.globalData.downloadlists);
						that.startdown();
						fileEntry.createWriter(
							function(writer) {
								writer.seek(0);
								writer.write(text);
							},
							function(e) {}
						);
					},
					function(e) {}
				);
			});
		}
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import url('@/common/common.scss');

/* #ifdef MP-WEIXIN || APP-PLUS */
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
	color: transparent;
}
/* #endif */

/* 解决H5 的问题 */
/* #ifdef H5 */
uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
	color: transparent;
}
/* #endif */
</style>
