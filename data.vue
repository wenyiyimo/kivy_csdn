<template>
	<view class="download">
		<view class="header">
			<view style="height: 40px;background-color: #FFFFFF;"></view>
			<view style="flex-direction: row;justify-content: space-between;background-color: #FFFFFF;margin-left: 10px;">
				<uni-icons color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text style="font-size: 20px;margin-top: 8px;">下载</text>
				<text style="font-size: 20px;margin-top: 8px;margin-right: 40px;"></text>
			</view>
		</view>
		<view class="play" maxlength="300" v-if="hidePlay">
			<video
				id="myVideo"
				ref="myVideo"
				class="player"
				:autoplay="true"
				:src="url"
				:codec="jiema"
				:object-fit="objectfit"
				:vslide-gesture-in-fullscreen="volumecontrol"
				vslide-gesture="true"
				enable-play-gesture="true"
				show-loading="false"
				play-strategy="3"
				@fullscreenclick="changeRatePlay"
				:controls="showControl"
				@fullscreenchange="enterFullScreen"
				:initial-time="initialtime"
				@error="changeWare()"
				@controlstoggle="controlShow"
				@ended="nextVideo"
			>
				<cover-view class="play-control" v-if="fullscreen && showControlshow && showControl">
					<text class="play-nowtime" @click="getNowTime">{{ nowtime }}</text>
					<text class="play-last" @click="lastVideo()">上一集</text>
					<text class="play-next" @click="nextVideo()">下一集</text>
					<text class="play-now">{{ nowPlay.slice(0, 10) }}</text>
					<text class="play-rate" @click="changePlayRate()">速度:{{ String(playRate) }}</text>
					<text class="play-direction" @click="changeDirection()">旋转</text>
					<text class="play-choose" @click="changeshowplay">选集</text>
					<text class="play-choose" @click="changeobjectfit">{{ objectfittext }}</text>
				</cover-view>
				<cover-view class="body" v-if="showplay && showControlshow && fullscreen">
					<view class="play-lists">
						<view class="play-data" v-for="(item, index) in downloadLists" :key="index">
							<text class="play-playname" :class="[nowPlayNum == index ? 'playname-active' : '']" @click="playvideo(index)">{{ item[4] }}-{{ item[0] }}</text>
						</view>
						<text class="playname"></text>
					</view>
				</cover-view>
			</video>
		</view>
		<view class="body" style="flex: 1;">
			<view class="tag-data" v-for="(item, index) in downloadLists" :key="index">
				<view class="item-box" @click="playvideo(index)">
					<text class="item-title">{{ item[4] }}-{{ item[0] }}</text>
					<view style="flex-direction:row;justify-content: space-between;">
						<text class="item-name">来源：{{ item[3] }}-{{ item[2] }}</text>
						<!-- <image :src="removeImage" mode="aspectFit" class="removeNotice" @click="removeItem(index)"></image> -->

						<view style="flex-direction: row;margin-top: 5px;">
							<text class="item-name" style="margin-right: 20px;">{{ index == nowDownNum ? progress : item[5] }}</text>
							<text class="item-name" @click="removeItem(index)">删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: '',
			videoContext: null,
			hidePlay: false,
			nowDown: 0, //当前下载的视频
			nowDownNum: -1, //当前下载的序号
			downloadLists: [],
			numLen: 0, //m3u8长度
			hasDownNum: 0, //已经下载的长度
			hasDown: [], //已经下载完成的片段路径
			progress: '嗅探中...',
			removeImage: '../../static/delete.png',
			data: [], //m3u8片段信息
			webv: 0,
			showControl: true,
			showControlshow: false,
			fullscreen: false,
			fullControlsWidth: null,
			fullControlsHeigt: null,
			initialtime: 0,
			direction: -90,
			playRate: 1.0,
			objectfit: 'contain',
			objectfittext: '拉伸',
			jiema: 'hardware',
			nowtime: '',
			showplay: false,
			volumecontrol: true,
			nowPlayNum: null,
			nowPlay: null
		};
	},
	created() {
		this.fullControlsWidth = uni.getSystemInfoSync().screenHeight;
		this.fullControlsHeigt = uni.getSystemInfoSync().screenWidth + 1;
		if (this.fullscreen && this.fullControlsHeigt > this.fullControlsWidth) {
			this.fullscreen = true;
			this.videoContext.requestFullScreen({
				direction: 0
			});
			this.direction = 0;
		}
	},
	methods: {
		pageBacked() {
			this.videoContext.stop();
			uni.navigateBack();
		},
		changeshowplay() {
			this.showplay = !this.showplay;
			if (this.showplay) {
				this.volumecontrol = false;
			} else {
				this.volumecontrol = true;
			}
		},
		changeDirection() {
			this.videoContext.exitFullScreen();
			if (this.fullControlsWidth > this.fullControlsHeigt) {
				if (this.direction == 90) {
					this.videoContext.requestFullScreen({
						direction: -90
					});
					this.direction = -90;
					plus.navigator.setFullscreen(true);
				} else {
					this.videoContext.requestFullScreen({
						direction: 90
					});
					this.direction = 90;
					plus.navigator.setFullscreen(true);
				}
			} else {
				this.fullscreen = true;
				this.videoContext.requestFullScreen({
					direction: 0
				});
				this.direction = 0;
				plus.navigator.setFullscreen(true);
			}
		},
		changePlayRate() {
			if (this.playRate == 1.0) {
				this.videoContext.playbackRate(1.25);
				this.playRate = 1.25;
				return;
			}
			if (this.playRate == 1.25) {
				this.videoContext.playbackRate(1.5);
				this.playRate = 1.5;
				return;
			}
			if (this.playRate == 1.5) {
				this.videoContext.playbackRate(2.0);
				this.playRate = 2.0;
				return;
			}
			if (this.playRate === 2.0) {
				this.videoContext.playbackRate(1.0);
				this.playRate = 1.0;

				return;
			}
		},
		lastVideo() {
			if (this.nowPlayNum > 0) {
				this.playRate = 1.0;
				this.playvideo(Number(this.nowPlayNum - 1));
			} else {
				uni.showToast({
					title: '第一集啦！',
					duration: 2300
				});
			}
		},
		nextVideo() {
			if (this.nowPlayNum + 1 < this.downloadLists.length) {
				this.playRate = 1.0;
				this.playvideo(Number(this.nowPlayNum + 1));
			} else {
				uni.showToast({
					title: '最后一集啦！',
					duration: 2300
				});
			}
		},
		getNowTime() {
			var now = new Date();
			var hh = now.getHours(); //时
			if (hh < 10) hh = '0' + hh;
			var mm = now.getMinutes(); //分
			if (mm < 10) mm = '0' + mm;
			this.nowtime = `${hh}:${mm}`;
		},
		controlShow(e) {
			this.showControlshow = e.detail.show;
			if (this.showControlshow) {
				this.getNowTime();
			} else {
				this.showplay = false;
				this.volumecontrol = true;
			}
		},
		changeWare() {
			if (this.jiema === 'hardware') {
				this.jiema = 'software';
			} else {
				uni.showToast({
					title: '播放失败！',
					duration: 2000
				});
			}
		},
		changeobjectfit() {
			if (this.objectfit == 'contain') {
				this.objectfittext = '还原';
				this.objectfit = 'fill';
			} else {
				this.objectfittext = '拉伸';
				this.objectfit = 'contain';
			}
		},
		enterFullScreen() {
			this.fullscreen = !this.fullscreen;
			if (this.fullscreen) {
				plus.navigator.setFullscreen(true);
			} else {
				plus.navigator.setFullscreen(false);
			}
		},
		changeRatePlay(e) {
			var clickW = e.detail.screenX;
			var clickH = e.detail.screenY;
			if (this.playRate == 1.0 && 8 * clickW > 7 * this.fullControlsWidth && 5 * clickH > 2 * this.fullControlsHeigt && 5 * clickH < 4 * this.fullControlsHeigt) {
				this.videoContext.playbackRate(2.0);
				this.playRate = 2.0;
				this.showControl = false;
			} else {
				if (this.playRate != 1.0 && 8 * clickW > 7 * this.fullControlsWidth && 5 * clickH > 2 * this.fullControlsHeigt && 5 * clickH < 4 * this.fullControlsHeigt) {
					this.videoContext.playbackRate(1.0);
					this.playRate = 1.0;
					this.showControl = false;
				} else {
					this.showControl = true;
				}
			}
		},
		playvideo(index) {
			this.videoContext.pause();
			if (this.downloadLists[index][5] != '已完成') {
				uni.showToast({
					title: '该集未下载！',
					duration: 2000
				});
			} else {
				// this.url = this.downloadLists[index][7].replace("file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/doc/","_doc/");
				this.url = this.downloadLists[index][7];
				this.nowPlay = this.downloadLists[index][0];
				this.nowPlayNum = index;
				this.hidePlay = true;
				this.videoContext.play();
			}
		},
		async startDown() {
			this.preitem();
		},
		//删除项目
		removeItem(item) {
			if (this.downloadLists[item][5] != '已完成') {
				let that = this;
				setTimeout(function() {
					console.log(that.downloadLists.splice(item, 1));
					uni.setStorageSync('downLists', that.downloadLists);
				}, 1000);
			} else {
				for (let localpath of this.downloadLists[item][8]) {
					uni.removeSavedFile({
						filePath: localpath,
						complete: function(res) {
							console.log(res);
						}
					});
				}
				this.downloadLists.splice(item, 1);
				uni.setStorageSync('downLists', this.downloadLists);
			}
		},
		//更新下载列表
		updateItem() {
			this.downloadLists = uni.getStorageSync('downLists');
			for (let i = 0; i < this.downloadLists.length; i++) {
				let item = this.downloadLists[i];
				if (item[5] != '已完成' && item[5] != '嗅探失败') {
					this.startDown();
					return;
				}
			}
		},
		//开始下载
		async preitem() {
			for (let i = 0; i < this.downloadLists.length; i++) {
				let item = this.downloadLists[i];
				if (item[5] != '已完成' && item[5] != '嗅探失败') {
					item[5] = '嗅探中...';
					this.nowDown = item;
					this.nowDownNum = i;
					uni.setStorageSync('nowDownNum', this.nowDownNum);
					this.getPlayUrl(item[1], item[6]);
					return;
				}
			}
		},
		//判断m3u8还是MP4，删除上次中断的残留
		gethHefRes(url) {
			if (this.hasDownNum != 0) {
				for (let localpath of this.hasDown) {
					uni.removeSavedFile({
						filePath: localpath,
						complete: function(res) {
							console.log(res);
						}
					});
				}
			}
			this.hasDown = [];
			this.progress = '解析中...';
			this.numLen = 0;
			this.hasDownNum = 0;
			this.data = [];
			if (url.indexOf('m3u8') == -1) {
				this.downMP4(url);
			} else {
				let that = this;
				console.log(url);
				uni.request({
					url: url,
					method: 'GET',
					timeout: 10000,
					success(res) {
						that.getDownUrl(res, '', res.header);
					},
					fail(res) {
						let downloadLists = uni.getStorageSync('downLists');
						let nowDownNum = uni.getStorageSync('nowDownNum');
						downloadLists[nowDownNum][5] = '嗅探失败';
						uni.setStorageSync('downLists', downloadLists);
						that.updateItem();
					}
				});
			}
		},
		//获取m3u8片段信息
		async getDownUrl(res, host, header) {
			let num = 0;
			let urlNum = 0;
			var arr = res.data.split('\n');
			for (let line of arr) {
				line = line.trim();
				if (line == '') {
					continue;
				}
				if (line.startsWith('#EXT')) {
					this.data.push(line);
					num = num + 1;
				} else {
					if (line.startsWith('/')) {
						var url = host + line;
					}
					if (line.indexOf('://') != -1) {
						var url = line;
					}
					this.downFile(url, num, header);
					this.data.push(url);
					num = num + 1;
					urlNum = urlNum + 1;
				}
			}
			this.numLen = urlNum;
		},
		//下载m3u8片段
		async downFile(url, num, header) {
			let that = this;
			const downloadTask = uni.downloadFile({
				url: url,
				header: header,
				timeout: 15,
				success: res => {
					that.hasDownNum = that.hasDownNum + 1;
					that.progress = `${that.hasDownNum}/${that.numLen}`;
					if (res.statusCode == 200) {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: function(res) {
								let savepath = res.savedFilePath.replace('_doc/', 'file:///storage/emulated/0/Android/data/uni.sousou/apps/__UNI__sousou/doc/');
								// let savepath=res.savedFilePath
								that.data[num] = savepath;
								that.hasDown.push(savepath);
							}
						});
					}
					if (that.hasDownNum == that.numLen) {
						that.progress = '已完成';
						that.writeFile();
					}
				},
				fail: () => {
					that.hasDownNum = that.hasDownNum + 1;
					that.progress = `${that.hasDownNum}/${that.numLen}`;
					if (that.hasDownNum == that.numLen) {
						that.progress = '已完成';
						that.writeFile();
					}
				}
			});
		},
		//下载MP4
		async downMP4(url) {
			let that = this;
			const downloadTask = uni.downloadFile({
				url: url,
				success: res => {
					if (res.statusCode === 200) {
						that.progress = '已完成';
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: function(res) {
								let downloadLists = uni.getStorageSync('downLists');
								let nowDownNum = uni.getStorageSync('nowDownNum');
								downloadLists[nowDownNum][5] = '已完成';
								let savepath = res.savedFilePath.replace('_doc/', 'file:///storage/emulated/0/Android/data/uni.sousou/apps/__UNI__sousou/doc/');
								downloadLists[nowDownNum].push(savepath);
								downloadLists[nowDownNum].push([savepath]);
								uni.setStorageSync('downLists', downloadLists);
								that.updateItem();
							},
							fail: () => {
								let downloadLists = uni.getStorageSync('downLists');
								let nowDownNum = uni.getStorageSync('nowDownNum');
								downloadLists[nowDownNum][5] = '嗅探失败';
								uni.setStorageSync('downLists', downloadLists);
								that.updateItem();
							}
						});
					} else {
						let downloadLists = uni.getStorageSync('downLists');
						let nowDownNum = uni.getStorageSync('nowDownNum');
						downloadLists[nowDownNum][5] = '嗅探失败';
						uni.setStorageSync('downLists', downloadLists);
						that.updateItem();
					}
				},
				fail: () => {
					let downloadLists = uni.getStorageSync('downLists');
					let nowDownNum = uni.getStorageSync('nowDownNum');
					downloadLists[nowDownNum][5] = '嗅探失败';
					uni.setStorageSync('downLists', downloadLists);
					that.updateItem();
				}
			});

			downloadTask.onProgressUpdate(res => {
				that.progress = `${res.progress}%`;
			});
		},
		writeFile() {
			let text = '';
			for (let line of this.data) {
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
					'_doc/' + that.nowDown[1].replace(RegExp('/', 'g'), '-') + '.m3u8',
					{
						create: true
					},
					function(fileEntry) {
						console.log(fileEntry.toLocalURL());
						that.hasDown = [];
						that.hasDownNum = 0;

						let downloadLists = uni.getStorageSync('downLists');
						let nowDownNum = uni.getStorageSync('nowDownNum');
						downloadLists[nowDownNum][5] = '已完成';
						downloadLists[nowDownNum].push(fileEntry.toLocalURL());
						downloadLists[nowDownNum].push(that.hasDown);
						uni.setStorageSync('downLists', downloadLists);
						that.updateItem();
						fileEntry.createWriter(
							function(writer) {
								writer.seek(0);
								writer.write(text);
							},
							function(e) {}
						);
					},
					function(e) {
						console.log(e);
					}
				);
			});
		},
		getPlayUrl(url, key) {
			uni.setStorageSync('urlPlay', '');
			this.webv.loadURL(url);
			var wv = this.webv;
			// wv.overrideUrlLoading({ mode: 'allow', match: '.*(mp4|flv|m3u8|url=).*' }, function(e) {});
			// 监听到页面加载图片资源时显示（{match:'.*\.(jpg|png|jpeg|bmp)\b'}）
			wv.listenResourceLoading({ match: '.*(mp4|video|m3u8).*' }, function(e) {
				var matchRule = key;
				if (
					e.url.indexOf('?url=') == -1 &&
					e.url.indexOf('beiyong') == -1 &&
					e.url.indexOf('SVG') == -1 &&
					e.url.indexOf('update') == -1 &&
					e.url.indexOf('51.la/') == -1 &&
					!e.url.endsWith('.js') &&
					e.url.indexOf('.png') == -1 &&
					e.url.indexOf('.css') === -1 &&
					e.url.indexOf('gif') === -1 &&
					e.url.indexOf('.php') == -1 &&
					!e.url.endsWith('.jpg') &&
					e.url.indexOf(matchRule) === -1 &&
					e.url.indexOf('umuuid') == -1
				) {
					console.log(e.url);
					uni.setStorageSync('urlPlay', e.url);
				}
			});
			let that = this;
			let alltime = 0;
			var obj = setInterval(function() {
				var urlPlay = uni.getStorageSync('urlPlay');
				alltime = alltime + 2000;

				if (alltime < 60000 && urlPlay != '') {
					that.gethHefRes(urlPlay);
					that.webv.close();
					that.preweb();
					clearInterval(obj);
				}
				if (alltime > 60000) {
					let downloadLists = uni.getStorageSync('downLists');
					let nowDownNum = uni.getStorageSync('nowDownNum');
					downloadLists[nowDownNum][5] = '嗅探失败';
					uni.setStorageSync('downLists', downloadLists);
					that.updateItem();
					that.webv.close();
					that.preweb();
					clearInterval(obj);
				}
			}, 2000);
		},
		preweb() {
			this.webv = plus.webview.create('', 'custom-webview', {
				plusrequire: 'none', //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
				'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
				disablePlus: true,
				hardwareAccelerated: true,
				blockNetworkImage: true
			});
			var currentWebview = this.$scope.$getAppWebview();
			currentWebview.append(this.webv);
		}
	},
	onLoad() {
		this.downloadLists = uni.getStorageSync('downLists');
		this.initialtime = uni.getStorageSync('initialtime');
		if (!this.initialtime) {
			this.initialtime = 0;
			uni.setStorageSync('initialtime', 0);
		}
	},
	onShow() {
		if (this.progress.indexOf('嗅探') != -1) this.startDown();
	},
	onReady: function() {
		this.videoContext = uni.createVideoContext('myVideo', this);
		this.preweb();
	},
	onUnload: function() {
		this.videoContext.pause();
		this.hidePlay = false;
		plus.navigator.setFullscreen(false);
		this.webv.close();
		let currentWebview = this.$mp.page.$getAppWebview();
		currentWebview.close();
	}
};
</script>

<style lang="scss" scoped>
.play-playname {
	margin-top: 10px;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 10px;
	flex: 1;
	font-size: 20px;
	flex-wrap: wrap;
	color: #ffffff;
}
.play-lists {
	display: flex;
	flex-direction: row;
	margin-bottom: 50px;
	margin-left: 10px;
	margin-right: 10px;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
}
.playname {
	margin-top: 10px;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 10px;
	flex: 1;
	font-size: 20px;
	flex-wrap: wrap;
}
.playname-active {
	margin-top: 10px;
	flex: 1;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 10px;
	font-size: 20px;
	color: #00aa00;
	flex-wrap: wrap;
}
.player {
	margin-top: 5px;
	margin-bottom: 5px;
	.play-control {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		color: #ffffff;
		margin-top: 13x;
		margin-left: 40px;
	}
	.play-choose {
		color: #ffffff;
	}
	.play-nowtime {
		color: #ffffff;
	}
	.play-last {
		color: #ffffff;
	}
	.play-next {
		color: #ffffff;
	}
	.play-now {
		color: #ffffff;
	}
	.play-rate {
		color: #ffffff;
	}
	.play-direction {
		color: #ffffff;
	}
}
.header {
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: sticky;
	top: 0px;
	z-index: 99;
}
.tab-data {
	margin-top: 20px;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}
.tab-item {
	font-size: 20px;
	color: #000;

	margin-bottom: 10px;
}
.tab-item-active {
	font-size: 20px;
	color: #00aa00;

	margin-bottom: 10px;
}
.tag-data {
	margin-top: 20px;
	margin-left: 20px;
	margin-right: 20px;
}

.item-state {
	margin-top: 10px;
	margin-left: 25px;
	display: flex;
	flex-direction: row;
	justify-content: center;
}
.item-box {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

.item-title {
	font-size: 20px;
}

.item-name {
	color: #999;
	font-size: 16px;
}
.down-state {
	font-size: 20px;
}
.removeNotice {
	margin-left: 20px;
	width: 20px;
	height: 20px;
	margin-bottom: 20px;
}
</style>
