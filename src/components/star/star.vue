<!--评级星星组件，通过半星，整星，无星拼接-->
<template>
  <div class="star" :class="starType">
    <!--需要加入track-by="$index"-->
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" track-by="$index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      //计算星大小的类型
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() { //根据分数，计算每个星的图片样式
        let result = [];
        //分数取整
        let score = Math.floor(this.score * 2) / 2;
        //是否有小数
        let hasDecimal = score % 1 !== 0;
        //取整数，先放整星
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        //小数半星，然后放半星
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        //补足其余星
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result; //计算完后，构造星数组返回
      }
    }
  };
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl" //引入css函数

  .star
    font-size: 0
    .star-item   /* 父.star 下 子.star-item 公共样式 */
      display: inline-block
      background-repeat: no-repeat
    &.star-48   /* 父.star 且是star-48 继承样式 */
      .star-item  //设置每个星图片之间的间距大小，本身大小公共属性
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star48_on')  //选择不同图片
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
