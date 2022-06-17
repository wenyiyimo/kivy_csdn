<template>
	<view class="play">
		<view class="header">
			<view class="header-top"></view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;">
				<uni-icons class="icon-style" color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text class="first-text" style="margin-top: 5rpx;" @click="openImpSite()">播放</text>
				<uni-icons style="margin-right: 10px;" color="#000000" size="40" :type="downImage" @click="downvideo" />
			</view>
		</view>
		<view class="body">
			<view class="play" v-if="hideplay">
				<video
					id="myvideo"
					ref="myvideo"
					:src="playurl"
					autoplay="true"
					:initial-time="initialtime"
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
						<text class="first-text" style="color: #fff;" @click="getnowtime()">{{ nowtime }}</text>
						<text class="first-text" style="color: #fff;" @click="changeplaystrategy()">解码:{{ playstrategytext }}</text>
						<text class="first-text" style="color: #fff;" @click="lastvideo()">上集</text>
						<text class="first-text" style="color: #fff;">{{ nowplay }}</text>
						<text class="first-text" style="color: #fff;" @click="nextvideo()">下集</text>
						<text class="first-text" style="color: #fff;" @click="changeobjectfit()">{{ objectfittext }}</text>
						<text class="first-text" style="color: #fff;" @click="changedirection()">旋转</text>
						<text class="first-text" style="color: #fff;" @click="changeplaybackRate()">速度:{{ playbackRate }}</text>
					</cover-view>
				</video>
			</view>
			<view class="detail" style="display:flex;flex-direction: row;height: 250rpx;justify-content: space-between;">
				<view style="display:flex;flex-direction: row;justify-content: flex-start;margin-top: 10rpx;margin-bottom: 10rpx;">
					<image :src="searchlists[sitecurrent][0].pic" mode="aspectFill" style="height:250rpx;width:180rpx;"></image>
					<view style="display:flex;flex-direction: column;justify-content: space-around;margin-left:50rpx;width:300rpx">
						<text class="first-text">{{ searchlists[sitecurrent][0].title }}</text>
						<text class="second-text">状态：{{ searchlists[sitecurrent][0].state }}</text>
						<text class="second-text">上次观看：无</text>
					</view>
				</view>
			</view>
			<scroll-view style="white-space: nowrap;display: flex;flex-direction: row;" scroll-x="true" show-scrollbar="false" scroll-left="120">
				<text v-for="(item, index) in searchlists" :key="index" class="first-text" style="margin-right: 10px;margin-top: 5px;" @click="changesite(index)">
					{{ item[0].name }}
				</text>
			</scroll-view>
			<scroll-view
				style="white-space: nowrap;display: flex;flex-direction: row;margin-top: 10px;margin-bottom: 10px;"
				scroll-x="true"
				show-scrollbar="false"
				scroll-left="120"
			>
				<text class="first-text" @click="nixu(tagcurrent)">逆序</text>
				<text v-for="(item, index) in searchlists[sitecurrent][2]" :key="index" class="first-text" style="margin-right: 10px;margin-left:10px;" @click="changetag(index)">
					{{ item.name }}
				</text>
			</scroll-view>
			<view class="grid-layout" v-if="showplaydata">
				<text
					class="first-text"
					style="flex: 1;margin: 10px;"
					v-for="(item, index) in searchlists[sitecurrent][2][tagcurrent].data"
					:key="index"
					@click="changeplay(index)"
				>
					{{ item.title }}
				</text>
				<text class="first-text" style="flex: 1;"></text>
			</view>
			<uni-load-more status="loading" v-if="showloading"></uni-load-more>
		</view>
	</view>
</template>
<script>
import db from '../../utils/database.js';
import http from '../../utils/http.js';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
import webvplay from '@/utils/webview.js';
import UniCard from '@/components/uni-ui/uni-card/components/uni-card/uni-card.vue';
import UniLoadMore from '../../components/uni-ui/uni-load-more/components/uni-load-more/uni-load-more.vue';
export default {
	mixins: [webvplay],
	components: {
		UniIcons,
		UniCard,
		UniLoadMore
	},
	data() {
		return {
			showloading: true,
			videoContext: null,
			hideplay: false,
			downImage: 'arrow-down',
			sitecurrent: 0,
			tagcurrent: 0,
			playcurrent: 0,
			searchlists: [],
			showplaydata: false,
			notiveImage: 'heart-filled',
			nowtime: '',
			nowplay: '',
			initialtime: 0,
			controls: true,
			objectfit: 'contain',
			objectfittext: '包含',
			playstrategy: '3',
			playstrategytext: '网络',
			fullscreen: false,
			playbackRate: 1.0,
			direction: -90
		};
	},
	watch: {
		playurl(newurl, oldurl) {
			if (newurl != '') this.playvideo();
		}
	},
	methods: {
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
			this.controls = e.detail.show;
		},
		fullscreenclick(e) {
			let clickW = e.detail.screenX / e.detail.screenWidth;
			let clickH = e.detail.screenY / e.detail.screenHeight;
			if (clickW > 0.875 && 0.4 < clickH && clickH < 0.6 && this.playbackRate == 1.0) {
				this.videoContext.playbackRate(2.0);
				this.playbackRate = 2.0;
				this.controls = false;
			} else {
				if (clickW > 0.875 && 0.4 < clickH && clickH < 0.6 && this.playbackRate != 1.0) {
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
		nextvideo() {
			this.videoContext.pause();
			if (this.searchlists[sitecurrent][2][this.tagcurrent].data.length == this.playcurrent + 1) {
				uni.showToast({
					title: '最后一集了!',
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
					title: '第一集了!',
					duration: 1000
				});
			} else {
				this.playcurrent = this.playcurrent - 1;
				this.changeplay(this.playcurrent);
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
		playvideo() {
			this.hideplay = true;
			this.videoContext.playbackRate(1.0);
			this.playbackRate = 1.0;
			this.videoContext.play();
		},
		changeplay(index) {
			this.playcurrent = index;
			this.nowplay = this.searchlists[sitecurrent][2][this.tagcurrent].data[index].title;
			this.xtplayurl(this.searchlists[sitecurrent][2][this.tagcurrent].data[index].href);
		},
		changetag(index) {
			this.tagcurrent = index;
		},
		changesite(index) {
			this.sitecurrent = index;
			this.getplaydata(index);
		},
		downvideo() {
			if (this.downImage == 'arrow-down') {
				this.downImage = 'arrow-up';
			} else {
				this.downImage = 'arrow-down';
			}
		},
		pageBacked() {
			// this.$router.go(-1);
			uni.navigateBack();
		},
		nixu(index) {
			let temp = [];
			let tempLen = this.searchlists[sitecurrent][2][index].data.length;
			for (let i = 0; i < tempLen; i++) {
				temp[i] = this.searchlists[sitecurrent][2][index]['data'][tempLen - i - 1];
			}
			this.searchlists[sitecurrent][2][index].data = temp;
		},
		async getplaydata(index) {
			let site = this.searchlists[index];
			// console.log(site)
			if (site[2]) {
				this.showloading = false;
				this.showplaydata = true;
			} else {
				this.showplaydata = false;
				this.showloading = true;
				if (site[1].id == 'XT') {
					let res = await http.xtplaydata(site[0].href, site[1]);
					if (res.flag) {
						this.showplaydata = true;
						this.showloading = false;
						this.searchlists[index].push(res.data);
					} else {
						this.showloading = false;
						uni.showToast({
							title: '获取失败!',
							duration: 2000
						});
					}
				}
				if (site[1].id == 'APP') {
					// console.log(site)
					let res = await http.appplaydata(site[0].href, site[1]);
					if (res.flag) {
						this.showplaydata = true;
						this.showloading = false;
						this.searchlists[index].push(res.data);
					} else {
						this.showloading = false;
						uni.showToast({
							title: '获取失败!',
							duration: 2000
						});
					}
				}
			}
		}
	},
	onLoad: function() {
		this.searchlists = uni.getStorageSync('temp');
		this.getplaydata(this.sitecurrent);
	},
	onReady: function() {
		this.videoContext = uni.createVideoContext('myvideo', this);
	},
	onUnload() {}
};
</script>
<style lang="scss" scoped>
.body {
	display: flex;
	flex-direction: column;
}
.grid-layout {
	// display: grid;
	// /* grid-template-columns属性定义每一列的列宽，grid-template-rows属性定义每一行的行高。 */
	// grid-template-columns: repeat(auto-fill, 80px);
	// grid-template-rows: auto;
	// /* grid-gap属性是grid-column-gap和grid-row-gap的合并简写形式，
	//             grid-row-gap属性设置行与行的间隔（行间距），grid-column-gap属性设置列与列的间隔（列间距）
	//             我设置的是10 行与行之间 列与列之间 都是10*/
	// grid-row-gap: 10px;
	// // grid-column-gap: 10px;
	// /* item在这个单元格中的位置justify-items属性设置单元格内容的水平位置（左中右），align-items属性设置单元格内容的垂直位置（上中下） */
	// align-items: center;
	// justify-items: center;
	// /* justify-content属性是整个内容区域在容器里面的水平位置（左中右），align-content属性是整个内容区域的垂直位置（上中下）。 */
	// justify-content: space-between;
	// align-content: center;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
}
.play-control {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
	color: #ffffff;
	margin-top: 13px;
	margin-left: 40px;
}
</style>
