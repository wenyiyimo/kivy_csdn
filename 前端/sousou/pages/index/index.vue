<template>
	<view class="index">
		<u-sticky :offset-top="-50">
			<view class="header">
				<image src="../../static/edit.png" mode="aspectFit" class="header-img" @click="editYuan"></image>
				<u-search v-model="search" @search="searchEvent" @custom="searchEvent" :clearabled="true" @clear="searchClearEvent" borderColor="#000000"></u-search>
			</view>
		</u-sticky>

		<view class="body">
			<view class="data-item" v-for="(item, index) in list" :key="index">
				<view class="out-item">
					<view class="tui-list-item" @click="handlerButton(item)">
						<image :src="item.image" mode="aspectFit" class="item-img"></image>
						<view class="item-box">
							<view class="item-title">{{ item.title }}</view>
							<view class="item-name">来源：{{ item.name }}</view>
							<view class="item-state">状态：{{ item.state }}</view>
							<view class="item-userstate">上次观看：{{ item.userState }}</view>
						</view>
					</view>
					<view :style="{ backgroundImage: 'url(' + notiveImage + ')', backgroundSize: 'cover' }" class="removeNotice" @click="removeItem(item)"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import db from '../../utils/database.js';
export default {
	data() {
		return {
			search: '',
			list: [],
			notiveImage: 'static/star.png',
			searchList:[]
		};
	},
	onLoad() {
		this.getSite();
	},
	methods: {
		async searchEvent() {
		const res = await db.getAll('site');
		// document.write(JSON.stringify(res.data));
		if (res.flag) {
			for(let i of res.data){
				
			}
		} else {
			this.$refs.uToast.show({ title: '读取视频源出错', type: 'warning', duration: '2300' });
		 return false;
		}
		},
		async getSite() {
			// document.write(JSON.stringify(mt));
			const res = await db.getAll('notive');
			if (res.flag) {
					this.list=res.data
			} else {
				this.$refs.uToast.show({ title: '读取视频源出错', type: 'warning', duration: '2300' });
			 return false;
			}
		},
		async removeItem(item) {
			// data=JSON.stringify(initNotive).replace('null,','')
			let key = item.name + '@@' + item.title;
			await db.remove('notive', key);
			this.$router.go(0);
		},
		onLoad(){
			this.getSite()
		},
		handlerButton(item) {
			let targetHref = item.href;
			let targetImage = item.image;
			let targetTitle = item.title;
			let targetState = item.state;
			let targetUserState = item.userState;
			let targetName = item.name;
			let targetStar = this.notiveImage;
			const urll = `/pages/detail/detail?href=${targetHref}&image=${targetImage}&title=${targetTitle}&state=${targetState}&userState=${targetUserState}&name=${targetName}&star=${targetStar}`;
			this.$u.route({ url: urll});
			// uni.redirectTo({
			// 	url: urll
			// });
		}
	},
	onShow() {
	let isRefresh=uni.getStorageSync("isRefresh")
	if (isRefresh!=0){
		this.getSite();
	};
	uni.setStorageSync('isRefresh',0);
	},
	onTabItemTap() {
		uni.setStorageSync('isRefresh',0);
		this.getSite();
	},
	
};
</script>

<style lang="scss" scoped>
.index {
	padding: 20rpx 10rpx;
	background-color: #f8f8f8;
	.header {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: item;
		.header-img {
			height: 60rpx;
			width: 60rpx;
			margin-right: 5rpx;
			display: block;
		}
	}
	.body {
		.tui-list-item {
			padding: 30rpx 30rpx;
			display: flex;
			align-items: item;
		}
		.out-item {
			padding: 10rpx 10rpx;
			display: flex;
			align-items: item;
		}

		.item-img {
			height: 150rpx;
			width: 150rpx;
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
		.removeNotice {
			height: 50rpx;
			width: 50rpx;
			margin-top: auto;
			margin-bottom: auto;
			margin-left: auto;
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
	}
}
</style>
