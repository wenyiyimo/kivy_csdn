<template>
	<view class="class">
		<view class="header">
			<view class="header-top"></view>
			<view class="search-style">
				<uni-icons color="#000000" size="40" type="arrow-left" @click="goback" />
				<uni-search-bar
					class="search-layout"
					v-model="search"
					placeholder="请输入搜索关键词"
					bgColor="#EEEEEE"
					cancelButton="none"
					@confirm="searchEvent"
					@clear="searchClearEvent"
					borderColor="#000000"
					style="width: 70%"
				></uni-search-bar>
				<text class="first-text" @click="searchEvent">搜索</text>
			</view>
		</view>
		<view class="body">
			<view v-for="(item, index) in list" :key="index">
				<view class="out-item">
					<view class="tui-list-item" @click="handlerButton(item)">
						<image :src="item.picurl" mode="aspectFit" class="item-img"></image>
						<view class="item-box">
							<text class="item-title">{{ item.name }}</text>
							<text style="margin-left: 20px;" v-if="item.score != ''" class="item-name">评分：{{ item.score }}</text>
							<text class="item-name" v-if="classnum != 1 && classnum != 3 && classnum != 4">更新至{{ item.ipad_play_for_list.episode }}集</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>

<script>
import http from '../../utils/http.js';
import UniLoadMore from '../../components/uni-ui/uni-load-more/components/uni-load-more/uni-load-more.vue';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
import UniSearchBar from '@/components/uni-ui/uni-search-bar/components/uni-search-bar/uni-search-bar.vue';
export default {
	components: {
		UniLoadMore,
		UniIcons,
		UniSearchBar
	},
	data() {
		return {
			status: 'more',
			classnum: 0,
			timenum: 0,
			search: '',
			list: [],
			classlist: [['追剧', 'teleplay'], ['电影', 'film'], ['动漫', 'cartoon'], ['综艺', 'tvshow'], ['记录片', 'documentary']],
			timelist: [['最近更新', 'time'], ['近期热门', '热门'], ['评分最高', 'score']],
			startnum: 0
		};
	},
	methods: {
		async goback() {
			uni.navigateBack();
		},
		async getclassdata() {
			let url = `http://m.v.sogou.com/napi/video/classlist?&order=${this.timelist[this.timenum][1]}&listTab=${this.classlist[this.classnum][1]}&start=${
				this.startnum
			}&len=10`;
			let html = await http.get(url);
			let jsondata = html.listData.results;
			this.list = [...this.list, ...jsondata];
			if (jsondata.length < 2) {
				this.status = 'no-more';
			}
		},
		changeclassnum(index) {
			this.classnum = index;
			this.startnum = 0;
			this.list = [];
			this.getclassdata();
		},
		changetimenum(index) {
			this.timenum = index;
			this.startnum = 0;
			this.list = [];
			this.getclassdata();
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
		},
		async loadmore() {
			this.status = 'loading';
			this.lunbo = false;
			this.startnum = this.startnum + 20;
			await this.getclassdata();
			this.status = 'more';
		}
	},
	onLoad(option) {
		this.classnum = option.num;
		this.getclassdata();
	},
	onReachBottom() {
		console.log(1111);
		this.status = 'loading';
		this.lunbo = false;
		this.startnum = this.startnum + 10;
		this.getclassdata();
	}
};
</script>
<style lang="scss" scoped></style>
