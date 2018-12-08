<template>
  <div class="seller" v-el:seller>  <!--使用better-scroll 必须是外层视口高度固定，内部内容高度超出父窗口高度才会有作用-->
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="item in seller.supports">
            <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
            <span class="text">{{seller.supports[$index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" v-el:pic-wrapper>
          <ul class="pic-list" v-el:pic-list> <!--这里定义pic-list ，则下面vue引用时要用this.$els.picList 获取该dom对象-->
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from 'common/js/store';
  import star from 'components/star/star';
  import split from 'components/split/split';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })() // 这种匿名函数写法，外部()表示立即执行该函数
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
      // 作为icon类标签的映射使用
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: {   // 因为无法确认betterscoler所需数据已经存在无法使用nexttick操作初始化，需要设置watch对seller属性监视，进行异步数据接收到后进行初始化better-scoller 或seller发生变化，在ready之后执行，在tab重新切换到seller页面时会重新渲染，此时watch发现数据seller没有变化(seller对象是从后端http过来的，除非刷新整个页面才会初始化)，不会触发重新初始化betterscroller操作，需要再ready中再次初始化才能确保切换时依然可以使用betterscroll
      'seller'() {
        this._initScroll();
        this._initPics();
      }
    },
    ready() {  /* 对其所在区域dom对象进行better-scroller初始化会出现问题，解决方式：之前都是1.在Vue 的created声明周期回调函数中dom可能没有完成初始化完成，此时bettersrcoler的区域内容是seller异步加载过来，在此时实例化better-scoller没有撑开父类区域，所以无法滚动，使用 nexttick方式在dom刷新时调用如goods，2.在food中再show 方法中初始化betterscroller,此时dom已经存在， ，3.在ready中进行初始化确保dom $els初始化完成 */
      this._initScroll();
      this._initPics();
    },
    methods: {
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      },
      _initScroll() {  // 下划线表示私有方法
        if (!this.scroll) {
          this.scroll = new BScroll(this.$els.seller, {
            click: true
          });
        } else {  // 解决ready方法比watch先执行，ready中导致初始化后页面不能滑动，因为已经实例化scroler后不再初始化，所以要判断已经存在则重新刷新scroll即可，这样watch方法再次调用时直接发现ready已经创建好实例，直接刷新即可
          this.scroll.refresh();
        }
      },
      _initPics() {
        if (this.seller.pics) {
          // 横向排列的ul默认与上面的父div宽度一样，不会像垂直方向子div中元素高度会自动发生变化并反映到子元素的高度属性上，需要通过下面通过计算图片li的宽度度进行动态设置ul设置，使其实际宽度大于父div才能实现better-scroller功能
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$els.picList.style.width = width + 'px';  // 设置ul宽度后dom不会立马发生改变，要在nexttick中执行初始化方法
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$els.picWrapper, {  // 初始化 横向betterscroller 图片
                scrollX: true,  // 设置横向滚动
                eventPassthrough: 'vertical'  // 忽略外层seller的垂直方向滚动，此时点击横向图片向上滚动式是不可以的
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .seller
    position: absolute   /*若不指定高度，默认使用外部固定视口的高度*/
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          margin-right: 12px
          line-height: 18px
          vertical-align: top
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex  // 弹性布局，三等分
        padding-top: 18px
        .block
          flex: 1
          text-align: center  /*设置文字在每个区块中居中显示*/
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position: absolute  /* 绝对布局脱离文档流，任意定位*/
        width: 50px   /* 设置宽度用于保证收藏图片不会点击时随意移动，在指定宽度区域内*/
        right: 11px
        top: 18px
        text-align: center
        .icon-favorite
          display: block   /*第一个span设置为block单独占用一行，把下面 第二个span 文本的行挤兑了下去*/
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 0
          &:last-child
            border-none()
        .icon
          display: inline-block
          width: 16px
          height: 16px
          vertical-align: top
          margin-right: 6px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper     // 用于作为bettersrcoller的父窗口，限定其宽度和高度
        width: 100%
        overflow: hidden      // 超出部分被隐藏
        white-space: nowrap  // 针对行内标签或行内块标签使用,当横向宽度超过屏幕宽度时不进行折行，超出部分的图片会被隐藏
        .pic-list
          font-size: 0  // font-size 0 结合下面 display: inline-block实现横向排列
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 14px
      .info-item
        padding: 16px 12px
        line-height: 16px  // line-height 支持自动换行
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        &:last-child
          border-none()
</style>
