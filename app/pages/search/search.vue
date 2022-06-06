<template>
	<view class="search">
		<view class="header">
			<view class="header-top"></view>
			<view
				style="
          flex-direction: row;
          justify-content: space-between;
          background-color: #ffffff;
          display: flex;
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
			<view v-for="(i, index) in searchlists" :key="index">
				<view style="display: flex;flex-direction: column;justify-content: flex-start;">
					<text class="first-text">{{ i[0] }}</text>
					<text class="second-text">共获取到{{ i[1].length }}条结果</text>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import db from '../../utils/database.js';
import http from '../../utils/http.js';
import UniIcons from '@/components/uni-ui/uni-icons/components/uni-icons/uni-icons.vue';
import UniSearchBar from '@/components/uni-ui/uni-search-bar/components/uni-search-bar/uni-search-bar.vue';
export default {
	components: {
		UniIcons,
		UniSearchBar
	},
	data() {
		return {
			sitelists: [],
			search: '',
			searchlists: []
		};
	},
	methods: {
		async getsitelists() {
			let sites = uni.getStorageSync('sites');
			for (let i of sites) {
				if (i.isActive) {
					this.sitelists.push(i);
					this.getsearchlists(i);
				}
			}
		},
		async goback() {
			uni.navigateBack();
		},
		async getsearchlists(site) {
			let searchurl = site.search_href.replace('searchKey',this.search);
			if (site.id == 'XT') {
				let res = await http.xtSearch(site, searchurl);
				// console.log(res.data)
				if (res.flag) {
					for (let data of res.data) {
						await this.judgelist(data, site);
					}
				}
			}
			if (site.id == 'APP') {
				let res = await http.appSearch(site, searchurl);
				// console.log(res.data)
				if (res.flag) {
					for (let data of res.data) {
						await this.judgelist(data, site);
					}
				}
			}
		},
		async judgelist(data, site) {
			let num = this.searchlists.length;
			if (num != 0) {
				for (let i = 0; i < num; i++) {
					if (data.title == this.searchlists[i][0]) {
						this.searchlists[i][1].push([data, site]);
						// console.log(this.searchlists)
						return;
					}
				}
				this.searchlists.push([data.title, [[data, site]]]);
			} else {
				this.searchlists.push([data.title, [[data, site]]]);
			}
		},
		async searchEvent() {
			if (this.search === '') {
				return false;
			} else {
				this.searchlists = [];
				for (let site of this.sitelists) {
					this.getsearchlists(site);
					// console.log(site)
				}
			}
		},
		async searchClearEvent() {
			this.search = '';
		},
		async detailButton(item) {
			const targetHref = item[1];
			const targetImage = item[2];
			const targetTitle = item[0];
			const targetState = item[3];
			const targetName = item[4];
			const key = targetName + '@@' + item[1];
			const res = await db.get('notive', key);
			if (res.flag) {
				const targetStar = '../../static/star.png';
				const targetUserState = res.data.userState;
				const urll = `/pages/detail/detail?href=${targetHref}&image=${targetImage}&title=${targetTitle}&state=${targetState}&userState=${targetUserState}&name=${targetName}&star=${targetStar}`;
				uni.navigateTo({ url: urll });
			} else {
				const targetStar = '../../static/star1.png';
				const targetUserState = '无';
				const urll = `/pages/detail/detail?href=${targetHref}&image=${targetImage}&title=${targetTitle}&state=${targetState}&userState=${targetUserState}&name=${targetName}&star=${targetStar}`;
				uni.navigateTo({ url: urll });
			}
		}
	},
	onLoad: function(option) {
		console.log(111)
		this.search = option.search;
		this.getsitelists();
	}
};
</script>

<style lang="scss" scoped></style>
