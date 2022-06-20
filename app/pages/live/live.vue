<template>
	<view class="site">
		<view class="header">
			<view class="header-top"></view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;">
				<uni-icons class="icon-style" color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text class="first-text" style="margin-top: 5rpx;" @click="openImpSite()">直播</text>
				<text class="first-text" style="margin-top: 5rpx;margin-right: 20rpx;width: 40px;"></text>
			</view>
			<view v-if="impSite" style="display: flex;flex-direction: row;justify-content: space-between;">
				<input maxlength="-1" style="width: 500rpx;font-size: 40rpx;margin-top:5rpx;" v-model="url" type="text" placeholder="请导入JSON数据" />
				<text class="first-text" style="margin-right: 20rpx;" @click="importSiteEvent">导入</text>
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
			<uni-card style="padding: -1px;margin: 5px;" v-for="(i, j) in livelists" :key="j">
				<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
					<text class="first-text" @click="changeplay(j)">{{ i.name }}</text>
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
						<text class="first-text" style="margin-right: 20rpx;color: #2c2c2c;" @click="delesite(j)">删除</text>
						<text class="first-text" style="margin-right: 20rpx;color: #2c2c2c;" @click="pushpinEvent(i, j)">置顶</text>
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
			livelists: [],
			impSite: false,
			hideplay: false,
			url: '',
			playurl: ''
		};
	},
	methods: {
		nextvideo() {
			this.videoContext.pause();
			if (this.livelists.length == this.playcurrent + 1) {
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
					title: '到第一个了!',
					duration: 1000
				});
			} else {
				this.playcurrent = this.playcurrent - 1;
				this.changeplay(this.playcurrent);
			}
		},
		changeplay(index) {
			this.playcurrent = index;
			this.nowplay = this.livelists[index].name;
			this.playurl = this.livelists[index].href;
			this.playvideo();
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
			if (clickW > 0.8 && 0.4 < clickH && clickH < 0.6 && this.playbackRate == 1.0) {
				this.videoContext.playbackRate(2.0);
				this.playbackRate = 2.0;
				this.controls = false;
			} else {
				if (clickW > 0.8 && 0.4 < clickH && clickH < 0.6 && this.playbackRate != 1.0) {
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
		},
		openImpSite() {
			this.url = '';
			this.impSite = !this.impSite;
		},
		async importSiteEvent() {
			if (this.url === '') {
				return false;
			}
			let res = await http.site(this.url);
			if (res.flag) {
				this.impSite = false;
				this.url = '';
				uni.showToast({
					title: '导入成功!',
					duration: 2000
				});
			} else {
				uni.showToast({
					title: '格式错误!',
					duration: 2000
				});
			}
		},
		async pushpinEvent(i, index) {
			if (index === 0) {
				return false;
			}
			this.livelists.unshift(this.livelists.splice(index, 1)[0]);
			uni.setStorageSync('livelists', this.livelists);
		},
		async delesite(index) {
			this.livelists.splice(index, 1);
			uni.setStorageSync('livelists', this.livelists);
		}
	},
	onLoad() {
		this.livelists = uni.getStorageSync('livelists');
	},
	onShow() {},
	onUnload() {},
	onReady: function() {
		this.videoContext = uni.createVideoContext('myvideo', this);
	}
};
</script>

<style lang="scss" scoped></style>
