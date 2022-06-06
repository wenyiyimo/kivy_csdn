<template>
	<view class="play">
		<view class="header">
			<view class="header-top"></view>
			<view style="display: flex;flex-direction: row;justify-content: space-between;">
				<uni-icons class="icon-style" color="#000000" size="40" type="arrow-left" @click="pageBacked" />
				<text class="first-text" style="margin-top: 5rpx;" @click="openImpSite()">播放</text>
				<uni-icons style="margin-right: 10px;" color="#000000" size="40" :type="downImage" @click="downvideo" />
			</view>
			<scroll-view style="white-space: nowrap" scroll-x="true" show-scrollbar="false" scroll-left="120">
				<view style="display: flex;flex-direction: row;justify-content: flex-start;margin-top: 5rpx;margin-bottom: 15rpx;">
					<view v-for="(item, index) in searchlists" :key="index">
						<view class="first-text" style="margin-right: 10rpx;">{{ item[0].name }}</view>
					</view>
				</view>
			</scroll-view>
			<scroll-view style="white-space: nowrap" scroll-x="true" show-scrollbar="false" scroll-left="120">
				<view style="display: flex;flex-direction: row;justify-content: flex-start;margin-top: 5rpx;margin-bottom: 15rpx;">
					<view class="first-text" @click="nixu">逆序</view>
					<view v-for="(item, index) in playdatas" :key="index">
						<view class="first-text" style="margin-right: 10rpx;">{{ item.name }}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="body"></view>
	</view>
</template>

<script>
import db from '../../utils/database.js';
import http from '../../utils/http.js';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';

export default {
	components: {
		UniIcons,
	},
	data() {
		return {
			downImage: 'arrow-down',
			sitecurrent: 0,
			tagcurrent: 0,
			playcurrent: 0,
			searchlists: [],
			playdatas: []
		};
	},
	methods: {
		pageBacked() {
			// this.$router.go(-1);
			uni.navigateBack();
		},
		nixu() {
			let temp = this.playdatas[this.tagcurrent].data;
			let tempLen = temp.length;
			for (let i = 0; i < tempLen; i++) {
				this.playdatas[this.tagcurrent]['data'][i] = temp[tempLen - i - 1];
			}
		}
	},
	onLoad: function(option) {
		this.sitecurrent = Number(option.index);
		this.searchlists = uni.getStorageSync('temp');
	}
};
</script>

<style lang="scss" scoped></style>
