<template>
	<div class="home">
		<div class="header" style="margin-top: 10px">
			<div class="row-flex" style="justify-content: space-between">
				<el-button :loading="cacheLoading" round class="second-text" @click="catchQuery()">查看已缓存的数据集</el-button>
				<div class="row-flex">
					<div class="second-text" style="margin-right: 10px">请输入样本集路径:</div>
					<el-input
						type="text"
						placeholder="请输入样本集路径(多个路径间用&&&&分隔)"
						:suffix-icon="Search"
						size="mini"
						style="width: 50vw; margin-top: 2px"
						v-model.lazy="searchInput"
					></el-input>
					<el-button :loading="loading" round class="second-text" style="margin-left: 1vw;" @click="onSubmit()">请点击查询样本数量</el-button>
				</div>
			</div>
		</div>
		<div style="position: relative; top: 0px">
			<div class="row-flex">
				<div class="row-flex">
					<div class="third-text" style="margin-right: 20px">源类型:</div>
					<el-checkbox-group v-model="option.sourcetype">
						<el-checkbox v-for="(item, index) in homeconfigvalue.sourcetype" :key="index" :label="item">{{ item }}</el-checkbox>
					</el-checkbox-group>
				</div>
				<div class="row-flex">
					<div class="third-text" style="margin-right: 20px; margin-left: 40px">图片色彩:</div>

					<el-checkbox-group v-model="option.colour">
						<el-checkbox v-for="(item, index) in homeconfigvalue.colour" :key="index" :label="item">{{ item }}</el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
			<div class="row-flex">
				<div class="third-text" style="margin-right: 20px">图片Top语言:</div>
				<el-checkbox style="margin-right: 20px" v-model="checkslan" @change="handlecheckslan">全选</el-checkbox>
				<el-checkbox-group v-model="option.s_language" @change="handlecheckslanall">
					<el-checkbox v-for="(item, index) in homeconfigvalue.s_language" :key="index" :label="item">{{ item }}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div class="row-flex">
				<div class="third-text" style="margin-right: 20px">图片所有语言:</div>
				<el-checkbox style="margin-right: 20px" v-model="checklan" @change="handlechecklan">全选</el-checkbox>
				<el-checkbox-group v-model="option.s_all_languages" @change="handlechecklanall">
					<el-checkbox v-for="(item, index) in homeconfigvalue.s_all_languages" :key="index" :label="item">{{ item }}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div class="row-flex" style="flex-wrap: wrap;display: flex;">
				<div class="third-text" style="margin-right: 20px">内容主体:</div>
				<el-checkbox style="margin-right: 20px" v-model="checksub" @change="handlechecksub">全选</el-checkbox>
				<el-checkbox-group v-model="option.subject" @change="handlechecksuball">
					<el-checkbox v-for="(item, index) in homeconfigvalue.subject" :key="index" :label="item">{{ item }}</el-checkbox>
				</el-checkbox-group>
			</div>
		</div>
		<el-dialog v-model="dialogVisible" width="80vw" top="5vh" title="Cache(缓存)数据集" center>
			<el-table height="70vh" :data="tableData" border style="width: 100%">
				<el-table-column align="center" label="序列" type="index" width="60"></el-table-column>
				<el-table-column align="center" property="date" width="160" label="缓存日期" />
				<el-table-column align="center" property="count" label="数目" width="80" />
				<el-table-column align="center" property="dataPath" label="数据集路径" />
				<el-table-column align="center" type="index" width="60">
					<template #default="scope">
						<div @click="deleteCache(scope.$index)">删除</div>
						<!-- <div @click="deleteCache(scope.row.dataPath)">删除</div> -->
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<div style="display: flex;flex-direction: row;justify-content: space-around;margin-top: 3vh;margin-left: 20vw;margin-right: 20vw;" v-show="totalimg == 0 ? false : true">
			<div class="first-text">样本集图片总数:{{ totalimg }}</div>
			<div class="first-text">符合条件图片总数:{{ countimg }}</div>
		</div>
		<div
			class="charts"
			style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top: 2vh;font-weight: 900;"
			v-show="totalimg == 0 ? false : true"
		>
			<!-- <div id="sourcetypeChart" style="width: 20vw;height: 25vh;border: 1px solid rgba(85, 170, 255, 1);"></div>
			<div id="colourChart" style="width: 20vw;height: 25vh;border: 1px solid rgba(85, 170, 255, 1);"></div>
			<div id="topLanguageChart" style="width: 25vw;height: 25vh;border: 1px solid rgba(85, 170, 255, 1);"></div>
			<div id="subjectChart" style="width: 30vw;height: 25vh;border: 1px solid rgba(85, 170, 255, 1);"></div> -->
			<div id="sourcetypeChart" style="width: 20vw;height: 30vh;"></div>
			<div id="colourChart" style="width: 20vw;height: 30vh;"></div>
			<div id="topLanguageChart" style="width: 25vw;height: 30vh;"></div>
			<div id="subjectChart" style="width: 30vw;height: 30vh;"></div>
		</div>
		<div v-show="loaded" class="first-text" style="justify-content: center;width: 100vw;display: flex;flex-direction: row;height: 20vh;margin-top: 10vh;">加载中......</div>
		<div v-show="countimg != 0">
			<div class="row-flex" style="justify-content: flex-start;flex-wrap: wrap;">
				<el-image
					:src="'data:image/png;base64,' + item"
					v-for="(item, index) in currentimg"
					fit="contain"
					:key="index"
					style="width: 19vw;margin: 0.3vw;height: 25vh;"
					@click="showImg(index)"
				></el-image>
			</div>
			<PageIndex :total="countimg" @currentpage="getcurrentpage"></PageIndex>
		</div>
	</div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import PageIndex from '@/components/PageIndex.vue';
import * as echarts from 'echarts';
import http from '@/utils/http.js';
import { Search } from '@element-plus/icons-vue';
import { homeconfig, homeconfigvalue, homeconfigreverse, initOption, initContentOption, initTopLanguageOption } from '@/utils/database.js';
import { useRouter } from 'vue-router';
const router = useRouter();
let loading = ref(false);
let cacheLoading = ref(false);
let totalimg = ref(0);
let countimg = ref(0);
let option = reactive(JSON.parse(JSON.stringify(homeconfigvalue)));
let checkslan = ref(true);
let dialogVisible = ref(false);
let tableData = ref([]);
let checklan = ref(true);
let checksub = ref(true);
let searchInput = ref('');
let sourcetypeChart = reactive(null);
let colourChart = reactive(null);
let topLanguageChart = reactive(null);
let subjectChart = reactive(null);
let sourcetypeOption = reactive(null);
let colourOption = reactive(null);
let topLanguageOption = reactive(null);
let subjectOption = reactive(null);
let totalimgpaths = ref(0);
let currentpage = ref(1);
let currentimg = ref([]);
let loaded = ref(false);
let title = {
	screenshot: '截屏',
	ppt_word: 'PPT文档',
	natural: '自然光'
};
let handlecheckslan = value => {
	if (value) {
		option.s_language = homeconfigvalue.s_language;
	} else {
		option.s_language = [];
	}
};
let handlecheckslanall = value => {
	if (value.length == homeconfigvalue.s_language.length) {
		checkslan.value = true;
	} else {
		checkslan.value = false;
	}
};
let handlechecklan = value => {
	if (value) {
		option.s_all_languages = homeconfigvalue.s_all_languages;
	} else {
		option.s_all_languages = [];
	}
};
let handlechecklanall = value => {
	if (value.length == homeconfigvalue.s_all_languages.length) {
		checklan.value = true;
	} else {
		checklan.value = false;
	}
};

let handlechecksub = value => {
	if (value) {
		option.subject = homeconfigvalue.subject;
	} else {
		option.subject = [];
	}
};
let handlechecksuball = value => {
	if (value.length == homeconfigvalue.subject.length) {
		checksub.value = true;
	} else {
		checksub.value = false;
	}
};
let catchQuery = async () => {
	cacheLoading.value = true;
	tableData.value = await http.get('/cache');
	cacheLoading.value = false;
	dialogVisible.value = true;
};
let deleteCache = async index => {
	let item = tableData.value.splice(index, 1);
	await http.delete({ path: item[0].dataPath });
};
let onSubmit = async () => {
	countimg.value = 0;
	if (searchInput == '') return;
	loading.value = true;
	let formData = new FormData();
	formData.append('samplesetList', JSON.stringify(searchInput.value.split('&&&&')));
	let optionconfig = {
		sourcetype: [],
		colour: [],
		s_language: [],
		s_all_languages: [],
		subject: []
	};
	optionconfig.sourcetype = dealjson(option.sourcetype, homeconfig.sourcetype);
	optionconfig.colour = dealjson(option.colour, homeconfig.colour);
	optionconfig.s_language = dealjson(option.s_language, homeconfig.s_language);
	optionconfig.s_all_languages = dealjson(option.s_all_languages, homeconfig.s_all_languages);
	optionconfig.subject = dealjson(option.subject, homeconfig.subject);
	formData.append('option', JSON.stringify(optionconfig));
	// console.log(JSON.stringify(formData.get('option')));
	let res = await http.post('/index', formData);
	loading.value = false;
	totalimg.value = res.all;
	countimg.value = res.selectNum;
	totalimgpaths.value = res.tableData;
	// getcurrentimg(totalimgpaths.value);
	let sourcetypeObj = res.sourcetype;
	sourcetypeOption.series[0].data = [];
	for (let key in sourcetypeObj) {
		if (sourcetypeObj[key] != 0) {
			sourcetypeOption.series[0].data.push({
				name: homeconfigreverse.sourcetype[key],
				value: sourcetypeObj[key]
			});
		}
	}
	sourcetypeChart.setOption(sourcetypeOption);
	let colourObj = res.colour;
	colourOption.series[0].data = [];
	for (let key in colourObj) {
		if (colourObj[key] != 0) {
			colourOption.series[0].data.push({
				name: homeconfigreverse.colour[key],
				value: colourObj[key]
			});
		}
	}
	colourChart.setOption(colourOption);

	let s_languageObj = res.s_language;
	topLanguageOption.series[0].data = [];
	for (let key in s_languageObj) {
		if (s_languageObj[key] != 0) {
			topLanguageOption.series[0].data.push({
				name: homeconfigreverse.s_language[key],
				value: s_languageObj[key]
			});
		}
	}
	topLanguageChart.setOption(topLanguageOption);

	let subjectObj = res.subject;
	subjectOption.series[0].data = [];
	subjectOption.series[1].data = [];
	for (let key in subjectObj) {
		let ret = 0;
		let value = subjectObj[key];
		for (let k in value) {
			ret += value[k];
			if (value[k] != 0) {
				subjectOption.series[1].data.push({
					name: homeconfigreverse.subject[k],
					value: value[k]
				});
			}
		}
		if (ret != 0) {
			subjectOption.series[0].data.push({
				name: title[key],
				value: ret
			});
		}
	}
	subjectChart.setOption(subjectOption);
	window.addEventListener('resize', () => {
		sourcetypeChart.resize();
		colourChart.resize();
		topLanguageChart.resize();
		subjectChart.resize();
	});
};

let dealjson = (optionlist, jsondata) => {
	let data = [];
	for (let i of optionlist) {
		data.push(jsondata[i]);
	}
	return data;
};

onMounted(() => {
	// 初始化echarts对象
	sourcetypeChart = echarts.init(document.getElementById('sourcetypeChart'));
	sourcetypeOption = initOption({
		text: '根据源类型统计',
		name: '源类型统计详情',
		dataName: option.sourcetype,
		data: []
	});
	sourcetypeChart.setOption(sourcetypeOption);

	colourChart = echarts.init(document.getElementById('colourChart'));
	colourOption = initOption({
		text: '根据图片色彩统计',
		name: '图片色彩统计详情',
		dataName: option.colour,
		data: []
	});
	colourChart.setOption(colourOption);

	topLanguageChart = echarts.init(document.getElementById('topLanguageChart'));
	topLanguageOption = initTopLanguageOption({
		text: '根据图片Top语言统计',
		name: '图片Top语言统计详情',
		data: []
	});
	topLanguageChart.setOption(topLanguageOption);

	subjectChart = echarts.init(document.getElementById('subjectChart'));
	subjectOption = initContentOption({
		text: '根据内容主体统计',
		name: '内容主体统计详情',
		title: '内容主体分类统计',
		titleData: [],
		// dataName: [],
		data: []
	});
	subjectChart.setOption(subjectOption);
});
let getcurrentpage = data => {
	currentpage.value = Number(data);
	getcurrentimg(totalimgpaths.value);
};
let getcurrentimg = async paths => {
	currentimg.value = [];
	let temps = [];
	for (let i = 10 * (currentpage.value - 1); i < 10 * currentpage.value; i++) {
		if (paths[i]) {
			temps.push(paths[i]);
		}
	}
	let res = await http.post('/detail/ImgPath', temps);
	currentimg.value = res.bs64Arr;
	// console.log(currentimg.value);
};
watch(
	() => option,
	(newV, oldV) => {
		onSubmit();
	},
	{ deep: true, immediate: true }
);
watch(
	() => currentimg,
	(newV, oldV) => {
		if (countimg.value != 0 && currentimg.value.length == 0) {
			loaded.value = true;
			console.log(loaded.value);
		} else {
			loaded.value = false;
			console.log(loaded.value);
		}
	},
	{ deep: true, immediate: true }
);
let showImg = index => {
	let path = totalimgpaths.value[(currentpage.value - 1) * 10 + index];
	// console.log(path);
	let detailPage = router.resolve({
		name: 'detail',
		path: '/detail',
		query: {
			imgpath: path
		}
	});
	window.open(detailPage.href, '_blank');
};
</script>
<style lang="scss" scoped></style>
