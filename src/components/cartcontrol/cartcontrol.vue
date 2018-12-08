<!--商品加减按钮组件-->
<template>
  <div class="cartcontrol">
    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart"
         transition="move">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object   // 该属性在created声明周期时可以获取
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {  // 解决浏览器端显示点击时触发两次事件，判断若不是better-scroll派生的事件则不处理
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);  // 解决对象中属性无法观测情况, 动态设置food中属性count为观测属性，否则该值发生变化，vue不能检测 v-show="food.count 变化，在good中能动态获取到
        } else {
          this.food.count++;
        }
        this.$dispatch('cart.add', event.target);  // 向父组件传递数据
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      transition: all 0.4s linear
      &.move-transition    /*按钮显示时移动过渡的样式， 一般结合v-show ,v-if,v-for指令使用*/
        opacity: 1
        transform: translate3d(0, 0, 0)    /*初始坐标为元素初始位置*/
        .inner
          display: inline-block
          line-height: 24px
          font-size: 24px
          color: rgb(0, 160, 220)
          transition: all 0.4s linear
          transform: rotate(0)      /*按钮显示时旋转过渡的样式*/
      &.move-enter, &.move-leave   /*按钮隐藏时移动过渡的样式*/
        opacity: 0
        transform: translate3d(24px, 0, 0)  /*移动后最后的坐标位置*/
        .inner
          transform: rotate(180deg)  /*按钮隐藏时旋转过渡的样式*/
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px    // 由于美观按钮设置的小，通过设置padding增加按钮点击区域
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
