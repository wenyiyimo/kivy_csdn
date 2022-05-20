<template>
	<view class="index">
		<view class="header">
			<view class="header-top"></view>
			<view class="search-style">
				<!-- <uni-icons style="margin-top: 0px;margin-left: 15px;" color="#000000" size="40" type="compose" @click="showDrawer('showLeft')" /> -->
				<uni-icons class="icon-style" color="#000000" size="40" type="compose" @click="editYuan" />
				<uni-search-bar
					class="search-layout"
					v-model="search"
					placeholder="请输入搜索关键词"
					bgColor="#EEEEEE"
					cancelButton="none"
					@confirm="searchEvent"
					@clear="searchClearEvent"
					borderColor="#000000"
					style="width:500rpx;"
				></uni-search-bar>
				<text class="first-text" @click="searchEvent">搜索</text>
			</view>
		</view>
		<view class="body">
			<swiper style="height: 200rpx;" autoplay="true" circular="true" interval="3000" duration="1000" @change="changeCurrent">
				<swiper-item v-for="(item, index) in lunbolist" :key="index">
					<view style="display: flex;flex-direction: column;">
						<image style="height: 200rpx;width: 100%;" :src="item.url" mode="aspectFill" @click="click(index)"></image>
						<text class="first-text" style="margin-top: -50rpx;z-index: 2;display: flex;justify-content: center;">{{ item.title }}</text>
					</view>
				</swiper-item>
			</swiper>
			<view style="display: flex;flex-direction: row; justify-content: space-between;margin-top: 10rpx;">
				<view
					style="height: 100rpx;width: 100rpx;border-radius: 50%;background-color: #f0f0f0;display: flex;justify-content: center;align-items: center;"
					v-for="(item, index) in settings"
					:key="index"
				>
					<text class="first-text">{{ item }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import http from '../../utils/http.js';
import uniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
import uniSearchBar from '@/components/uni-ui/uni-search-bar/components/uni-search-bar/uni-search-bar.vue';
import uniGrid from '@/components/uni-ui/uni-grid/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-ui/uni-grid/components/uni-grid-item/uni-grid-item.vue';
export default {
	components: { uniIcons, uniSearchBar, uniGridItem, uniGrid },
	data() {
		return {
			src: 'https://res.vmallres.com/pimages//promotion/enterprise/97399325205612399379.jpg',
			lunbolist: [
				{ url: 'https://res.vmallres.com/pimages//promotion/enterprise/97399325205612399379.jpg', title: '111111' },
				{ url: 'https://res.vmallres.com/pimages//promotion/enterprise/97399325205612399379.jpg', title: '222222' }
			],
			current: 0,
			settings: ['收藏', '历史', '直播', '下载', '设置']
		};
	},
	onLoad() {},
	methods: {
		changeCurrent(e) {
			this.current = e.detail.current;
		}
	}
};
</script>

<style lang="scss"></style>
