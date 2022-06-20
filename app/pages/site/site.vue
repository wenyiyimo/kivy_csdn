<template>
	<view class="site">
		<view class="header">
			<view class="header-top"></view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;">
				<uni-icons class="icon-style" color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text class="first-text" style="margin-top: 5rpx;" @click="openImpSite()">站源管理</text>
				<text class="first-text" style="margin-top: 5rpx;margin-right: 20rpx;" @click="changeState">{{ urlNotive }}</text>
			</view>
			<view v-if="impSite" style="display: flex;flex-direction: row;justify-content: space-between;">
				<input maxlength="-1" style="width: 80%;font-size: 40rpx;margin-top:5rpx;" v-model="url" type="text" placeholder="请导入JSON数据" />
				<text class="first-text" style="margin-right: 20rpx;" @click="importSiteEvent">导入</text>
			</view>
		</view>
		<view class="body">
			<uni-card style="padding: -1px;margin: 5px;" v-for="(i, j) in siteList" :key="j">
				<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
					<text class="first-text">{{ i.name }}</text>
					<view style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
						<text class="first-text" style="margin-right: 20rpx;color: #2c2c2c;" @click="delesite(j)">删除</text>
						<text class="first-text" style="margin-right: 20rpx;color: #2c2c2c;" @click="pushpinEvent(i, j)">置顶</text>
						<switch class="switch-button" :checked="i.isActive" @change="switchChange(j)" type="switch" active-color="#c7ccce"></switch>
					</view>
				</view>
				
			</uni-card>
		</view>
	</view>
</template>
<script>
	import UniCard from '@/components/uni-ui/uni-card/components/uni-card/uni-card.vue';
import db from '../../utils/database.js';
import http from '../../utils/http.js';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
export default {
	components: {
		UniIcons,
		UniCard
	},
	data() {
		return {
			siteList: [],
			impSite: false,
			url: '',
			bodyshow: true,
			urlNotive: '订阅'
		};
	},
	methods: {
		async changeState() {
			if (this.urlNotive == '订阅') {
				this.urlNotive = '站源';
				this.siteList = [];
				let that = this;
				setTimeout(function() {
					that.siteList = uni.getStorageSync('urlNotive');
				}, 500);
			} else {
				this.urlNotive = '订阅';
				this.siteList = [];
				let that = this;
				setTimeout(function() {
					that.siteList = uni.getStorageSync('sites');
				}, 500);
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
			this.siteList.unshift(this.siteList.splice(index,1)[0])
			if (this.urlNotive == '订阅') {
				uni.setStorageSync('sites', this.siteList);
			} else {
				uni.setStorageSync('urlNotive', this.siteList);
			}
		},
	

	async switchChange(index) {
		this.siteList[index].isActive=!this.siteList[index].isActive
		if (this.urlNotive == '订阅') {
			uni.setStorageSync('sites', this.siteList);
		} else {
			uni.setStorageSync('urlNotive', this.siteList);
		}
	},

	async delesite(index) {
		if (this.urlNotive == '订阅') {
			this.siteList.splice(index, 1);
			uni.setStorageSync('sites', this.siteList);
		} else {
			this.siteList.splice(index, 1);
			uni.setStorageSync('urlNotive', this.siteList);
		}
	},},
	onLoad() {
		this.siteList = uni.getStorageSync('sites');
	},
	onShow() {},
	onUnload() {
		this.siteList = [];
	}
};
</script>

<style lang="scss" scoped></style>
