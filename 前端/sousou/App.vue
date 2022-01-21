<script>
	import db from "./utils/database.js"
	export default {
		onLaunch: function() {
			db.init('notive')
			db.init('site')
			
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/icon.css';
	@import url("./base.css");
	::-webkit-scrollbar{
		display: none;
		width: 0 !important;
		height:0 !important;
		-webkit-appearance:none;
		background: transparent;
	}
	scroll-view .scroll-view::-webkit-scrollbar{
		display: none;
		width: 0 !important;
		height:0 !important;
		-webkit-appearance:none;
		background: transparent;
	}
	/deep/.uni-scroll-view::-webkit-scrollbar{
		display: none;
		width: 0 !important;
		height:0 !important;
		-webkit-appearance:none;
		background: transparent;
	}
	/deep/::-webkit-scrollbar{
		display: none;
		width: 0 !important;
		height:0 !important;
		-webkit-appearance:none;
		background: transparent;
	}
</style>
