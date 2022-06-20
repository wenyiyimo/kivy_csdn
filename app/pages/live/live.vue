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
				<input maxlength="-1" style="width: 80%;font-size: 40rpx;margin-top:5rpx;" v-model="url" type="text" placeholder="请导入JSON数据" />
				<text class="first-text" style="margin-right: 20rpx;" @click="importSiteEvent">导入</text>
			</view>
		</view>
		<view class="body">
			<uni-card style="padding: -1px;margin: 5px;" v-for="(i, j) in livelists" :key="j">
				<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
					<text class="first-text">{{ i.name }}</text>
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
			livelists: [],
			impSite: false,
			url: ''
		};
	},
	methods: {
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
	onUnload() {}
};
</script>

<style lang="scss" scoped></style>
