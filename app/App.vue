<script>
import db from './utils/database.js';
export default {
	onLaunch: function() {
		db.initdb();
		uni.setKeepScreenOn({
			keepScreenOn: true
		});
		let sWidth = uni.getSystemInfoSync().screenWidth;
		let sHeight = uni.getSystemInfoSync().screenHeight;
		if (sWidth > sHeight) {
			plus.screen.lockOrientation('landscape');
		} else {
			plus.screen.lockOrientation('portrait');
		}
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import url('@/common/common.scss');

/* #ifdef MP-WEIXIN || APP-PLUS */
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
	color: transparent;
}
/* #endif */

/* 解决H5 的问题 */
/* #ifdef H5 */
uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
	color: transparent;
}
/* #endif */
</style>
