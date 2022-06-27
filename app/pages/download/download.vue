<template>
	<view class="site">
		<view class="header">
			<view class="header-top"></view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;">
				<uni-icons class="icon-style" color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text class="first-text" style="margin-top: 5rpx;">下载</text>
				<text class="first-text" style="margin-top: 5rpx;margin-right: 20rpx;width: 40px;"></text>
			</view>
			<view v-if="showdown" style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top: 5px;margin-bottom: 5px;">
				<text class="first-text" @click="startalldown()">全部开始</text>
				<text class="first-text" @click="pausealldown()">全部暂停</text>
				<text class="first-text" @click="deletealldown()">全部删除</text>
			</view>
		</view>
		<view class="body">
			<view class="play" v-if="hideplay" style="margin-left: 10px; margin-right: 10px">
				<video
					id="myvideo"
					ref="myvideo"
					:src="playurl"
					autoplay="true"
					initial-time="0"
					:controls="controls"
					:object-fit="objectfit"
					codec="hardware"
					http-cache="false"
					:play-strategy="playstrategy"
					vslide-gesture="true"
					show-center-play-btn="true"
					enable-play-gesture="true"
					@ended="nextvideo"
					@fullscreenchange="fullscreenchange"
					@error="showerror"
					@fullscreenclick="fullscreenclick"
					@controlstoggle="controlstoggle"
				>
					<!-- @timeupdate="timeupdate" -->
					<cover-view class="play-control" v-if="fullscreen && controls">
						<text class="first-text" style="color: #fff" @click="getnowtime()">{{ nowtime }}</text>
						<text class="first-text" style="color: #fff" @click="changeplaystrategy()">解码:{{ playstrategytext }}</text>
						<text class="first-text" style="color: #fff" @click="lastvideo()">上集</text>
						<text class="first-text" style="color: #fff">{{ nowplay }}</text>
						<text class="first-text" style="color: #fff" @click="nextvideo()">下集</text>
						<text class="first-text" style="color: #fff" @click="changeobjectfit()">{{ objectfittext }}</text>
						<text class="first-text" style="color: #fff" @click="changedirection()">旋转</text>
						<text class="first-text" style="color: #fff" @click="changeplaybackRate()">速度:{{ playbackRate }}</text>
					</cover-view>
				</video>
				<view
					style="
			  margin-top: 10px;
			  display: flex;
			  flex-direction: row;
			  justify-content: space-between;
			"
				>
					<text style="text-align: center; font-size: 20px" @click="navigateUrl()">腾讯免流</text>
					<text style="text-align: center; font-size: 20px" @click="copyUrl()">复制链接</text>
					<text style="text-align: center; font-size: 20px" @click="searchdev()">点击投屏</text>
				</view>
				<view v-for="dev in devList" :key="dev.id">
					<text class="first-text" style="text-align: center; margin-bottom: 10px" @click="startdev(dev.id)">{{ dev.name }}</text>
				</view>
			</view>
			<uni-card style="padding: 0px;margin: 5px;" v-for="(i, j) in downloadlists" :key="j">
				<view style="display: flex;flex-direction: column;">
					<text class="first-text" @click="changeplay(j)">{{ i[1] }}-{{ i[0] }}</text>
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
						<text class="first-text" style="margin-right: 5px;" @click="pausedown(j)">状态:{{ j == downindex && i[3] != '已完成' ? progress : i[3] }}</text>
						<text class="first-text" style="margin-right: 5px;" @click="deletedown(j)">删除</text>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>
<script>
import UniCard from '@/components/uni-ui/uni-card/components/uni-card/uni-card.vue';
import http from '../../utils/http.js';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
export default {
	components: {
		UniIcons,
		UniCard
	},
	data() {
		return {
			videoContext: null,
			playcurrent: 0,
			nowtime: '',
			nowplay: '无',
			controls: true,
			objectfit: 'contain',
			objectfittext: '包含',
			playstrategy: '3',
			playstrategytext: '网络',
			fullscreen: false,
			playbackRate: 1.0,
			direction: -90,
			devList: [],
			hideplay: false,
			playurl: '',
			downloadlists: [],
			downindex: 0,
			downurl: '',
			m3u8len: 0, //m3u8长度
			hasdownlen: 0, //已经下载的长度
			hasdown: [], //已经下载完成的片段路径
			m3u8data: [], //m3u8片段信息
			webview: '',
			m3u8href: [],
			progress: '嗅探中',
			showdown: false
		};
	},
	methods: {
		async deletealldown() {
			uni.showToast({
				title: '删除中',
				duration: 30000
			});
			await this.clearnotdown();
			for (let i = 0; i < this.downloadlists.length; i++) {
				if (this.downloadlists[i][3] == '已完成') {
					for (let j of this.downloadlists[i][5]) {
						uni.removeSavedFile({
							filePath: j,
							complete: function(res) {
								console.log(res);
							}
						});
					}
				}
			}
			uni.setStorageSync('downloadlists', []);
			this.downloadlists = [];
			uni.hideToast();
			this.showdowncontrol();
		},
		async pausealldown() {
			uni.showToast({
				title: '暂停中',
				duration: 30000
			});
			await this.clearnotdown();
			for (let i = 0; i < this.downloadlists.length; i++) {
				if (this.downloadlists[i][3] != '已完成') {
					this.downloadlists[i][3] = '已暂停';
				}
			}
			uni.setStorageSync('downloadlists', this.downloadlists);
			uni.hideToast();
			this.showdowncontrol();
		},
		async startalldown() {
			await this.clearnotdown();
			for (let i = 0; i < this.downloadlists.length; i++) {
				if (this.downloadlists[i][3] != '已完成') {
					this.downloadlists[i][3] = '等待中';
				}
			}
			uni.setStorageSync('downloadlists', this.downloadlists);
			this.startdown();
			this.showdowncontrol();
		},
		showdowncontrol() {
			this.showdown = !this.showdown;
		},
		async deletedown(index) {
			if (this.downindex == index) {
				this.progress = '删除中';
				let flag = await this.clearnotdown();
				if (flag.flag) {
					this.downloadlists.splice(index, 1);
					uni.setStorageSync('downloadlists', this.downloadlists);
					this.startdown();
				}
			} else {
				if (this.downindex > index) {
					if (this.downloadlists[index][3] == '已完成') {
						for (let i of this.downloadlists[index][5]) {
							uni.removeSavedFile({
								filePath: i,
								complete: function(res) {
									console.log(res);
								}
							});
						}
						this.downloadlists.splice(index, 1);
						uni.setStorageSync('downloadlists', this.downloadlists);
						this.downindex = this.downindex - 1;
					} else {
						this.downloadlists.splice(index, 1);
						uni.setStorageSync('downloadlists', this.downloadlists);
						this.downindex = this.downindex - 1;
					}
				} else {
					if (this.downloadlists[index][3] == '已完成') {
						for (let i of this.downloadlists[index][5]) {
							uni.removeSavedFile({
								filePath: i,
								complete: function(res) {
									console.log(res);
								}
							});
						}
						this.downloadlists.splice(index, 1);
						uni.setStorageSync('downloadlists', this.downloadlists);
					} else {
						this.downloadlists.splice(index, 1);
						uni.setStorageSync('downloadlists', this.downloadlists);
					}
				}
			}
		},
		async pausedown(index) {
			if (this.downloadlists[index][3] != '已完成') {
				if (this.downloadlists[index][3] != '已暂停') {
					if (this.downindex == index) {
						this.progress = '暂停中';
						let flag = await this.clearnotdown();
						if (flag.flag) {
							this.progress = '已暂停';
							this.downloadlists[index][3] = '已暂停';
							uni.setStorageSync('downloadlists', this.downloadlists);
							this.startdown();
						}
					} else {
						this.downloadlists[index][3] = '已暂停';
						uni.setStorageSync('downloadlists', this.downloadlists);
					}
				} else {
					this.downloadlists[index][3] = '等待中';
					uni.setStorageSync('downloadlists', this.downloadlists);
				}
			}
		},
		async clearnotdown() {
			plus.downloader.clear();
			this.m3u8data = [];
			this.m3u8href = [];
			this.hasdownlen = 0;
			this.m3u8len = 0;
			for (let i of this.hasdown) {
				uni.removeSavedFile({
					filePath: i,
					complete: function(res) {
						console.log(res);
					}
				});
			}
			this.hasdown = [];
			return { flag: true };
		},
		prewebview() {
			this.webview = plus.webview.create('', 'xtwebview', {
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
			for (let i = 0; i < this.downloadlists.length; i++) {
				if (this.downloadlists[i][3] == '等待中') {
					this.progress = '嗅探中';
					this.downindex = i;
					this.getdownurl(this.downloadlists[i][2]);
					return;
				}
			}
			this.webview.close();
		},
		async getdownurl(url) {
			let temp = this.downurl;
			this.webview.loadURL(url);
			// this.webv.overrideUrlLoading({ mode: 'reject' }, function(e) {});
			this.webview.overrideResourceRequest([
				{
					match: '.*jpg|.*js|.*png|.*css|.*gif|.*php|.*SVG',
					redirect: ''
				}
			]);
			this.webview.overrideUrlLoading(
				{
					mode: 'allow',
					match: '.*(mp4|m3u8|flv|url=|video).*'
				},
				function(e) {
					// console.log(e.url);
				}
			);
			this.webview.listenResourceLoading(
				{
					match: '.*(mp4|m3u8|flv|url=|video).*'
				},
				this.truedownurl
			);
			let that = this;
			setTimeout(function() {
				if (that.downurl == temp) {
					that.progress = '嗅探失败';
					that.downloadlists[that.downindex][3] = '嗅探失败';
					uni.setStorageSync('downloadlists', that.downloadlists);
					that.webview.loadURL('');
					that.webview.clear();
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
					this.downurl = e.url;
					console.log(e.url);
					this.judgedownurl(e.url);
					this.webview.loadURL('');
					this.webview.clear();
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
				this.progress = '解析中';
				let res = await http.get(url);
				if (res.indexOf('#EXT') != -1) {
					let flag = await this.geturldata(res, url);
					if (flag.flag) {
						this.m3u8len = this.m3u8href.length;
						this.downm3u8();
					}
				} else {
					this.progress = '嗅探失败';
					this.downloadlists[this.downindex][3] = '嗅探失败';
					uni.setStorageSync('downloadlists', this.downloadlists);
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
				this.progress = '已完成';
				this.downloadlists[this.downindex][3] = '已完成';
				this.downloadlists[this.downindex][4] = downpath;
				this.downloadlists[this.downindex][5] = [downpath];
				uni.setStorageSync('downloadlists', this.downloadlists);
				this.startdown();
			} else {
				this.progress = '下载失败';
				this.downloadlists[this.downindex][3] = '下载失败';
				uni.setStorageSync('downloadlists', this.downloadlists);
				this.startdown();
			}
		},
		onstatechanged(dtask, status) {
			switch (dtask.state) {
				case 1:
					this.progress = '连接中';
					break;
				case 2:
					this.progress = '已连接';
					break;
				case 3:
					prg = parseInt((parseFloat(dtask.downloadedSize) / parseFloat(dtask.totalSize)) * 100);
					this.progress = prg + '%';
					break;
				case 4:
					this.progress = '已完成';
					this.downloadLists[this.downindex][3] = '已完成';
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
					this.m3u8data.push(line);
					num = num + 1;
				} else {
					if (line.startsWith('/')) {
						let url = host + line;
					}
					if (line.indexOf('://') != -1) {
						let url = line;
					}
					this.m3u8data.push(url);
					this.m3u8href.push([url, num]);
					num = num + 1;
				}
			}
			return {
				flag: true
			};
		},
		//下载m3u8片段
		async downm3u8() {
			this.progress = `${this.hasdownlen}/${this.m3u8len}`;
			if (this.hasdownlen == this.m3u8len) {
				this.writeFile();
			} else {
				this.downslice(this.m3u8href[this.hasdownlen][0]);
			}
		},
		async downslice(url) {
			let dtask = plus.downloader.createDownload(url, {}, this.finishslice);
			dtask.start();
		},
		async finishslice(d, status) {
			if (status == 200) {
				let downpath = plus.io.convertLocalFileSystemURL(d.filename);
				this.hasdown.push(downpath);
				this.m3u8data[this.m3u8href[this.hasdownlen][1]] = downpath;
				this.hasdownlen = this.hasdownlen + 1;
				this.downm3u8();
			} else {
				this.hasdownlen = this.hasdownlen + 1;
				this.downm3u8();
			}
		},
		writeFile() {
			let text = '';
			for (let line of this.m3u8data) {
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
					'_doc/' + that.downloadlists[that.downindex][2].replace(RegExp('/', 'g'), '-') + '.m3u8',
					{
						create: true
					},
					function(fileEntry) {
						console.log(fileEntry.toLocalURL());
						that.progress = '已完成';
						that.downloadlists[that.downindex][3] = '已完成';
						that.downloadlists[that.downindex][4] = fileEntry.toLocalURL();
						that.hasdown.push(fileEntry.toLocalURL());
						that.downloadlists[that.downindex][5] = that.hasdown;
						uni.setStorageSync('downloadlists', this.downloadlists);
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
		},
		nextvideo() {
			this.videoContext.pause();
			if (this.downloadlists.length == this.downloadlists + 1) {
				uni.showToast({
					title: '到最后了!',
					duration: 1000
				});
			} else {
				this.playcurrent = this.playcurrent + 1;
				this.changeplay(this.playcurrent);
			}
		},
		lastvideo() {
			this.videoContext.pause();
			if (this.playcurrent == 0) {
				uni.showToast({
					title: '第一个了!',
					duration: 1000
				});
			} else {
				this.playcurrent = this.playcurrent - 1;
				this.changeplay(this.playcurrent);
			}
		},
		changeplay(index) {
			this.playcurrent = index;
			this.nowplay = this.downloadlists[index][1];
			if (this.downloadlists[index][4]) {
				this.playurl = this.downloadlists[index][4];
				this.playvideo();
				let site = {
					title: this.downloadlists[index][0],
					state: this.nowplay
				};
				this.sethistory(site);
			} else {
				uni.showToast({
					title: `${this.nowplay}未下载!`,
					duration: 1000
				});
			}
		},
		async sethistory(site) {
			let historys = uni.getStorageSync('historys');
			let flag = await this.checkhistory(historys, site);
			if (flag.flag) {
				historys.unshift(site);
				uni.setStorageSync('historys', historys);
			}
		},
		async checkhistory(historys, site) {
			let num = historys.length;
			if (num > 100) {
				historys.pop();
				for (let i = 0; i < num - 1; i++) {
					if (historys[i].title == site.title) {
						historys.splice(i, 1);
						historys.unshift(site);
						uni.setStorageSync('historys', historys);
						return { flag: false };
					}
				}
				return { flag: true };
			} else {
				for (let i = 0; i < num; i++) {
					if (historys[i].title == site.title) {
						historys.splice(i, 1);
						historys.unshift(site);
						uni.setStorageSync('historys', historys);
						return { flag: false };
					}
				}
				return { flag: true };
			}
		},
		playvideo() {
			this.hideplay = true;
			this.videoContext.playbackRate(1.0);
			this.playbackRate = 1.0;
			this.videoContext.play();
		},
		startdev(id) {
			dlna.play({ id: id, url: this.playurl, title: this.nowPlay }, result => {
				console.log(result.msg);
				// this.title = result.msg
			});
		},
		searchdev() {
			this.devList = [];
			dlna.search(result => {
				//alert(result.type)
				if (result.type === 'add') {
					this.devList.push({ id: result.id, name: result.name });
				} else {
					this.devList = this.devList.filter(x => x.id != result.id);
				}
			});
		},
		copyUrl() {
			uni.setClipboardData({
				data: this.playurl,
				success: function() {
					uni.showToast({
						title: '复制成功！',
						duration: 1000
					});
				},
				fail: function(err) {
					uni.showToast({
						title: '复制失败！',
						duration: 1000
					});
				}
			});
		},
		navigateUrl() {
			this.videoContext.pause();
			plus.runtime.openURL(
				this.playurl,
				err => {
					uni.showToast({
						title: '跳转失败！',
						duration: 1000
					});
				},
				'com.tencent.mtt'
			);
		},
		fullscreenchange() {
			this.fullscreen = !this.fullscreen;
			if (this.fullscreen) {
				this.controls = false;
				plus.navigator.setFullscreen(true);
			} else {
				plus.navigator.setFullscreen(false);
			}
		},
		controlstoggle(e) {
			if (!e.detail.show) {
				this.controls = e.detail.show;
			}
		},
		fullscreenclick(e) {
			let clickW = e.detail.screenX / e.detail.screenWidth;
			let clickH = e.detail.screenY / e.detail.screenHeight;
			if (clickW > 0.85 && 0.4 < clickH && clickH < 0.6 && this.playbackRate == 1.0) {
				this.videoContext.playbackRate(2.0);
				this.playbackRate = 2.0;
				this.controls = false;
			} else {
				if (clickW > 0.85 && 0.4 < clickH && clickH < 0.6 && this.playbackRate != 1.0) {
					this.videoContext.playbackRate(1.0);
					this.playbackRate = 1.0;
					this.controls = false;
				} else {
					if (clickH > 0.2 && this.controls) {
						this.controls = false;
					} else {
						this.getnowtime();
						this.controls = true;
					}
				}
			}
		},
		changeplaystrategy() {
			if (this.playstrategytext == '网络') {
				this.playstrategytext = '本地';
				this.playstrategy = '0';
				return;
			}
			if (this.playstrategytext == '本地') {
				this.playstrategytext = '极端';
				this.playstrategy = '1';
				return;
			}
			if (this.playstrategytext == '极端') {
				this.playstrategytext = '网络';
				this.playstrategy = '3';
				return;
			}
		},
		changeplaybackRate() {
			if (this.playbackRate == 1.0) {
				this.videoContext.playbackRate(1.25);
				this.playbackRate = 1.25;
				return;
			}
			if (this.playbackRate == 1.25) {
				this.videoContext.playbackRate(1.5);
				this.playbackRate = 1.5;
				return;
			}
			if (this.playbackRate == 1.5) {
				this.videoContext.playbackRate(2.0);
				this.playbackRate = 2.0;
				return;
			}
			if (this.playbackRate == 2.0) {
				this.videoContext.playbackRate(0.5);
				this.playbackRate = 0.5;
				return;
			}
			if (this.playbackRate == 0.5) {
				this.videoContext.playbackRate(0.8);
				this.playbackRate = 0.8;
				return;
			}
			if (this.playbackRate === 0.8) {
				this.videoContext.playbackRate(1.0);
				this.playbackRate = 1.0;
				return;
			}
		},
		changedirection() {
			this.videoContext.exitFullScreen();
			if (this.direction == -90) {
				this.videoContext.requestFullScreen({
					direction: 0
				});
				this.direction = 0;
				plus.navigator.setFullscreen(true);
				return;
			}
			if (this.direction == 0) {
				this.videoContext.requestFullScreen({
					direction: 90
				});
				this.direction = 90;
				plus.navigator.setFullscreen(true);
				return;
			}
			if (this.direction == 90) {
				this.videoContext.requestFullScreen({
					direction: -90
				});
				this.direction = -90;
				plus.navigator.setFullscreen(true);
				return;
			}
		},
		changeobjectfit() {
			if (this.objectfit == 'contain') {
				this.objectfit = 'fill';
				this.objectfittext = '填充';
				return;
			}
			if (this.objectfit == 'fill') {
				this.objectfit = 'cover';
				this.objectfittext = '覆盖';
				return;
			}
			if (this.objectfit == 'cover') {
				this.objectfit = 'contain';
				this.objectfittext = '包含';
				return;
			}
		},
		getnowtime() {
			let now = new Date();
			let hh = now.getHours(); //时
			if (hh < 10) hh = '0' + hh;
			let mm = now.getMinutes(); //分
			if (mm < 10) mm = '0' + mm;
			this.nowtime = `${hh}:${mm}`;
		},
		showerror() {
			if (this.playurl != '') {
				// this.playurl='';
				uni.showToast({
					title: '视频播放错误!',
					duration: 1000
				});
			}
		},
		pageBacked() {
			// this.$router.go(-1);
			uni.navigateBack();
		}
	},
	onLoad() {
		this.prewebview();
		this.downloadlists = uni.getStorageInfoSync('downloadlists');
		this.clearnotdown();
		this.startDown();
	},
	onShow() {},
	onUnload() {
		uni.showToast({
			title: '已停止下载!',
			duration: 1000
		});
		this.clearnotdown();
	},
	onReady: function() {
		this.videoContext = uni.createVideoContext('myvideo', this);
	}
};
</script>

<style lang="scss" scoped></style>
