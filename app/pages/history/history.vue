<template>
	<view class="history">
		<view class="header">
			<view class="header-top"></view>
			<view
				style="
          flex-direction: row;
          justify-content: space-between;
          background-color: #ffffff;
          display: flex;
		  margin-right: 10px;
		  margin-left: 10px;
        "
			>
				<uni-icons color="#000000" size="40" type="arrow-left" @click="goback" />
				<uni-search-bar
					v-model="search"
					style="width: 70%;"
					:value="search"
					placeholder="请输入搜索关键词"
					bgColor="#EEEEEE"
					cancelButton="none"
					@confirm="searchEvent"
					@clear="searchClearEvent"
					borderColor="#000000"
				></uni-search-bar>
				<text class="first-text" @click="searchEvent">搜索</text>
			</view>
		</view>
		<view class="body">
			<uni-card style="margin: 5px;width: 100%;" v-for="(i, index) in historys" :key="index">
				<view style="display: flex;flex-direction: column;justify-content: flex-start;align-items: center;" @click="navsearch(i.title)">
					<text class="first-text">{{ i.title }}</text>
					<text class="first-text">{{ i.state }}</text>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
import UniSearchBar from '@/components/uni-ui/uni-search-bar/components/uni-search-bar/uni-search-bar.vue';
import UniCard from '@/components/uni-ui/uni-card/components/uni-card/uni-card.vue';
export default {
	components: {
		UniIcons,
		UniSearchBar,
		UniCard
	},
	data() {
		return {
			historys: null
		};
	},
	methods: {
		navsearch(key) {
			this.search = key;
			this.searchEvent();
		},
		async goback() {
			uni.navigateBack();
		},
		async searchEvent() {
			if (this.search === '') {
				return false;
			} else {
				let urll = `/pages/search/search?search=${this.search}`;
				uni.navigateTo({ url: urll });
			}
		},
		async searchClearEvent() {
			this.search = '';
		}
	},
	onLoad: function() {
		this.historys = uni.getStorageSync('historys');
	}
};
</script>

<style lang="scss" scoped></style>
