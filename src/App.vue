<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px"> <!--border-1px伪类实现边框宽度调整，引用main.js定义base.styl(border-1px)全局 stylus定义的样式-->
      <div class="tab-item">
        <a v-link="{path:'/goods'}">商品</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/ratings'}">评论</a>
      </div>
      <div class="tab-item">
        <a v-link="{path:'/seller'}">商家</a>
      </div>
    </div>
    <!--将seller数据传递给子组件，keep-alive用于在tab页切换时将当前页面缓存在内存中，再切换回来时直接读取缓存无需重新触发新的Vue的初始化，向后台重新发送请求-->
    <!--router-view 中也可以传递seller对象 ，在路由切换显示时旧的页面dom会被删除掉-->
    <router-view :seller="seller" keep-alive></router-view>
  </div>
</template>

<!--不加type="text/ecmascript-6" 会在webstorm编辑器中写es6语法会报错-->
<script type="text/ecmascript-6">
  import {urlParse} from 'common/js/util';
  import header from 'components/header/header.vue';

  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {  // 箭头函数前后需要空格
            let queryParam = urlParse();  // 解析前台url传入的参数，在util.js中定义解析函数
            return queryParam.id;
          })()
        }
      };
    },
    created() {  //利用声明周期函数，对该组件进行初始化
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => { // 初始化时发送http请求，带上参数id，向后端获取数据
        response = response.body;  // response的对象中属性都被vue自动设置了get,set 方法用于监听该属性变化，再赋予上面组件中data()函数中定义的seller方法
        if (response.errno === ERR_OK) {
          // 若this.seller = response.data 则会把对象中的id中覆盖掉，需要利用如下方式将this.seller以及response.data拷贝到新的{}中返回，在同一个对象中绑定返回数据与对应查询id关系，否则直接返回会把seller中的id给覆盖掉，这是es6的方法，也是vue推荐给属性扩展的方法，
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });
    },
    components: {
      'v-header': header
    }
  };

</script>

<!--下面这些css样式都会编译打包到app.js中，和js文件放在一起-->
<!-- 需要引入lang="stylus" rel="stylesheet/stylus" 否则显示报错-->
<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  // 引入mixin.styl  通过@import stylus语法，引入任何路径下的stylus,使用相对路径
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex // 一般下面css 先设置布局,再字体，颜色设置样式
    width: 100%
    height: 40px
    line-height: 40px
    // 在pc端是 1px， 但部署到手机端存在dpi,可能物理像素是设置像素 * dpi,可能是2个像素
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1)) // 通过调用mixin.styl 中css通用函数 解决1px问题，0.1是透明度
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block // a元素撑满父元素盒子
        font-size: 14px //字体大小
        color: rgb(77, 85, 93) //字体颜色
        &.active //父标签a中的 active样式颜色
          color: rgb(240, 20, 20)
</style>
