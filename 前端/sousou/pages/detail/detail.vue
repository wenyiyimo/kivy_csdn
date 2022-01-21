<template>
	<view class="detail">
		<view class="state">

			<image src="../../static/back.png" mode="aspectFit" class="back-img" @click="pageBacked()"></image>
		</view>
		<view class="header">
			<image :src="image" mode="aspectFit" class="item-img"></image>
			<view class="item-box">
				<view class="item-title">{{ title }}</view>
				<view class="item-name">来源：{{ name }}</view>
				<view class="item-state">状态：{{ state }}</view>
				<view class="item-userstate">上次观看：{{ userState }}</view>
			</view>
			<view :style="{backgroundImage:'url('+notiveImage+')',backgroundSize:'cover'}" class="removeNotice" @click="removeItem()"></view>
		</view>
	</view>
</template>
<script>
import db from "../../utils/database.js";
export default {
	data() {
		return {
			href: '',
			title: '',
			image: '',
			state: '',
			userState: '',
			name: '',
			notiveImage: '',
			
		};
	},
	methods: {
		pageBacked(){
				this.$router.go(-1);
		},
		async removeItem() {
			// data=JSON.stringify(initNotive).replace('null,','')
			if (this.notiveImage=='static/star.png'){
				let key = this.name + '@@' + this.title;
				await db.remove('notive', key);
				this.notiveImage='static/star1.png';
				
			}else{
				this.notiveImage='static/star.png';
				let item={
					"name": this.name,
					"href": this.href,
					"title": this.title,
					"image": this.image,
					"state": this.state,
					"userState": this.userState
				};
				await db.addNotive('notive', item);
				
			};
			uni.setStorageSync('isRefresh',1);
		}
	},
	onLoad: function(option) {
		this.href = option.href;
		this.title = option.title;
		this.image = option.image;
		this.state = option.state;
		this.userState = option.userState;
		this.name = option.name;
		this.notiveImage = option.star;
		// document.write(option.star)
	},
};
</script>

<style lang="scss" scoped>
.detail {
	padding: 20rpx 20rpx;
	background-color: #f8f8f8;
	
	
	.state{
		height: 30rpx;
		width: 20rpx;
		padding-left:10rpx;
		
		.back-img{
			height: 60rpx;
			width: 60rpx;
		}
	}
	.header {
		padding-top:50rpx;
		display: flex;
		align-items: item;
	
		.item-img {
			height: 150rpx;
			width: 120rpx;
			margin-right: 20rpx;
			display: block;
		}
		.item-box {
			flex: 1;
			width: 95%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.item-title {
			font-size: 32rpx;
			word-wrap: break-word;
		}
		.item-state {
			color: #999;
			font-size: 24rpx;
			display: flex;
		}
		.item-userstate {
			color: #999;
			font-size: 24rpx;
		}
		.item-name {
			color: #999;
			font-size: 24rpx;
		}
		.removeNotice {
			height: 50rpx;
			width: 50rpx;
			margin-top: auto;
			margin-bottom: auto;
			margin-left: auto;
		}
	}
}
</style>
