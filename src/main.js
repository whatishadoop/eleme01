import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';  //该路径根据webpack.base.conf.js resolve别名定义

import 'common/stylus/index.styl';  //引入所有的stylus文件，作为全局使用， common/ 为视图映射路径在webpack.base.conf.js中定义

Vue.use(VueRouter);
Vue.use(VueResource);  //全局注册vue-resouce

let app = Vue.extend(App);

let router = new VueRouter({
	linkActiveClass: 'active'
});

router.map({
	'/goods': {
		component: goods   // es5 语法{goods:goods} 而es6简写goods
	},
	'/ratings': {
		component: ratings
	},
	'seller': {
		component: seller
	}
});

router.start(app, '#app'); 
// router.go('/goods'); //默认打开商品，通过go进行跳转，切换router-view路由即删除对应的dom,添加新的dom，但是有个问题在商品评论tab时点击刷新，此时会执行main.js重新跳转到goods,但商品tab也会触发渲染操作，此时发现商品dom没有了就会报错，去除后商品tab刷新还是商品，不会跳转到goods界面， 一般该默认值由用户访问页面时默认指定的路径
