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

						<view style="flex-direction: row;margin-top: 10px;">
							<text class="item-name" @click="pauseDown(index)" style="margin-right: 20px;">{{ index == nowDownNum ? progress : item[5] }}</text>
							<text class="item-name" @click="removeItem(index)">删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
import downmixin from '@/utils/download.js';

export default {
	components: {
		UniIcons
	},
	mixins: [downmixin],
	data() {
		return {
			url: '',
			videoContext: null,
			hidePlay: false,
			removeImage: '../../static/delete.png',
			data: [], //m3u8片段信息
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
			jiema: 'software',
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
			if (this.jiema === 'software') {
				this.jiema = 'hardware';
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
		}
	},
	onShow() {},
	onLoad() {
		this.initialtime = uni.getStorageSync('initialtime');
		if (!this.initialtime) {
			this.initialtime = 0;
			uni.setStorageSync('initialtime', 0);
		}
	},
	onReady: function() {
		this.videoContext = uni.createVideoContext('myVideo', this);
		this.preweb();
		this.startDown();
	},
	onUnload: function() {
		this.videoContext.pause();
		this.hidePlay = false;
		this.webv.close();
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
		font-size: 20px;
	}
	.play-nowtime {
		color: #ffffff;
		font-size: 20px;
	}
	.play-last {
		color: #ffffff;
		font-size: 20px;
	}
	.play-next {
		color: #ffffff;
		font-size: 20px;
	}
	.play-now {
		color: #ffffff;
		font-size: 20px;
	}
	.play-rate {
		color: #ffffff;
		font-size: 20px;
	}
	.play-direction {
		color: #ffffff;
		font-size: 20px;
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
