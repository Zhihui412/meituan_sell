<template>
  <div class="shopcart" :class="{'highlight': totalCount>0}">
   <div class="shopcart-wrapper">
     <div class="content-left">
       <div class="logo-wrapper" :class="{'highlight': totalCount>0}" @click="toggleList">
         <span class="icon-shopping_cart logo" :class="{'highlight': totalCount>0}"></span>
         <i class="num" v-show="totalCount">{{totalCount}}</i>
       </div>
       <div class="desc-wrapper">
         <p class="total-price" v-show="totalPrice">￥{{totalPrice}}</p>
         <div class="tip" :class="{'highlight': totalCount>0}">另需{{poiInfo.shipping_fee_tip}}</div>
       </div>
     </div>
     <div class="content-right" :class="{'highlight': totalCount>0}">
       {{payStr}}
     </div>
     <div class="shopcart-list" v-show="listShow" :class="{'show':listShow}">
       <div class="list-top" v-if="poiInfo.discounts2">
         {{poiInfo.discounts2[0].info}}
       </div>
       <div class="list-header">
         <h3 class="title">1号口袋</h3>
         <div class="empty" @click="emptyFn">
           <img src="./ash_bin.png" />
           <span>清空购物车</span>
         </div>
       </div>
       <div class="list-content" ref="listContent">
         <ul>
           <li class="food-item" v-for="food in selectFoods">
             <div class="desc-wrapper">
               <div class="desc-left">
                 <p class="name">{{food.name}}</p>
                 <p class="unit" v-show="!food.description">{{food.unit}}</p>
                 <p class="description" v-show="food.description">{{food.description}}</p>
               </div>
               <div class="desc-right">
                 <span class="price">￥{{food.min_price}}</span>
               </div>
             </div>
             <div class="cartcontrol-wrapper">
               <Cartcontrol :food="food"></Cartcontrol>
             </div>
           </li>
         </ul>
       </div>
       <div class="list-bottom"></div>
     </div>
   </div>
<div class="shopcart-mask" v-show="listShow" @click="hideMask">

</div>
  </div>
</template>

<script>
  // 导入Cartcontrol
  import Cartcontrol from 'components/Cartcontrol/Cartcontrol'
  // 导入BScroll
  import BScroll from 'better-scroll'


  export default {
    data() {
      return {
        fold: true
      }
    },
    props: {
      // min_price_tip: {
      //   type: String,
      //   default: ''
      // },
      // shipping_fee_tip: {
      //   type: String,
      //   default: ''
      // },
      poiInfo: {
        type: Object,
        default: {}
      },
      selectFoods: {
        type: Array,
        default () {
          return [

          ];
        }
      }
    },
    computed: {
      // 总个数
      totalCount() {
        let num = 0;
        this.selectFoods.forEach((food) => {
          num += food.count;
        });
        return num;
      },
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.min_price * food.count;
        });
        // console.log(total);
        return total;
      },
      // 结算按钮显示
      payStr() {
        if (this.totalCount > 0) {
          return "去结算";
        } else {
          return this.poiInfo.min_price_tip;
        }
      },
      listShow() {
        if (!this.totalCount) { //个数为0
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        // BScroll相关
        if (show) {
          // DOM元素更新后进行操作
          this.$nextTick(() => {
            if (!this.shopScroll) {
              this.shopScroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              //重新计算高度
              this.shopScroll.refresh();
            }
          })
        }
        return show;
      }

    },
    components: {
      Cartcontrol,
      BScroll
    },
    methods: {
      toggleList() {
        if (!this.totalCount) { //个数为0
          return;
        }
        this.fold = !this.fold;
      },
      emptyFn(){
        this.selectFoods.forEach((food) => {
          food.count = 0;
        })
      },
      hideMask(){
        this.fold = true;
      }
    }

  }
</script>

<style>
  /* @import url("Showcart.css"); */


  .shopcart-wrapper {
    width: 100%;
    height: 51px;
    background: #514f4f;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    z-index: 99;
  }

  .shopcart-wrapper.highlight{
    background: #2d2b2a;
  }

  .shopcart-wrapper .content-left {
    flex: 1;
  }

  .shopcart-wrapper .content-left .logo-wrapper {
    width: 50px;
    height: 50px;
    background: #666666;
    border-radius: 50%;
    position: relative;
    top: -14px;
    left: 10px;
    text-align: center;
    float: left;
  }
  .shopcart-wrapper .content-left .logo-wrapper.highlight{
    background: #ffd161;
  }

  .shopcart-wrapper .content-left .logo-wrapper .logo {
    font-size: 28px;
    color: #c4c4c4;
    line-height: 50px;
  }
  .shopcart-wrapper .content-left .logo-wrapper .logo.highlight{
    color: #2D2B2A;
  }

  .shopcart-wrapper .content-left .logo-wrapper .num {
    width: 15px;
    height: 15px;
    line-height: 15px;
    font-size: 9px;
    border-radius: 50%;
    color: white;
    background-color: red;
    position: absolute;
    right: 0;
    top: 0;
  }

  .shopcart-wrapper .content-left .desc-wrapper {
    float: left;
    margin-left: 13px;
  }

  /* 解决用户代理样式表 */
  body{
     margin: 0 !important;
   }

  .shopcart-wrapper .content-left .desc-wrapper P{
    margin: 0;
  }

  .shopcart-wrapper .content-left .desc-wrapper .total-price {
    font-size: 18px;
    line-height: 33px;
    color: white;
  }


  .shopcart-wrapper .content-left .desc-wrapper .tip {
    font-size: 12px;
    color: #bab9b9;
    line-height: 51px;
  }

  .shopcart-wrapper .content-left .desc-wrapper .tip.highlight {
  line-height: 12px;
  }

  .shopcart-wrapper .content-right {
    flex: 0 0 110px;
    font-size: 15px;
    color: #BAB9B9;
    line-height: 51px;
    text-align: center;
  }

  .shopcart-wrapper .content-right.highlight {
    background: #FFD161;
    color: #2D2B2A;
  }

  .shopcart-wrapper .shopcart-list{
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
  }

  .shopcart-wrapper .shopcart-list.show{
    transform: translateY(-100%);
  }

  .shopcart-wrapper .shopcart-list .list-top{
    height: 30px;
    text-align: center;
    font-size: 11px;
    background: #f3e6c3;
    line-height: 30px;
    color: #646158;
  }

  .shopcart-wrapper .shopcart-list .list-header{
    height: 30px;
    background: #F4F4F4;
  }

  .shopcart-wrapper .shopcart-list .list-header .title{
   float: left;
   border-left: 4px solid #53c123;
   padding-left: 6px;
   line-height: 30px;
   font-size: 12px;
  }

  .shopcart-wrapper .shopcart-list .list-header .empty{
  float: right;
  height: 30px;
  line-height: 30px;
  margin-left: 10px;
  font-size: 0;
  }


  .shopcart-wrapper .shopcart-list .list-header .empty img{
  height: 14px;
  margin-right: 9px;
  vertical-align: middle;
  }

  .shopcart-wrapper .shopcart-list .list-header .empty span{
    font-size: 12px;
    vertical-align: middle;
  }

  .shopcart-wrapper .shopcart-list .list-content{
    max-height: 360px;
    overflow: hidden;
    background: white;
    width: 100%;
  }

  h3{
    margin: 0;
  }

  .shopcart-wrapper .shopcart-list .list-content .food-item{
  height: 38px;
  padding: 12px 12px 10px 12px;
  border-bottom: 1px solid #F4F4F4;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper{
    float: left;
    width: 240px;
  }

  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left{
    float: left;
    width: 170px;
  }

  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .name{
    font-size: 16px;
    margin-bottom: 8px;
    /* 超出部分隐藏 */
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 16px;
    margin: 0;

  }

  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .unit{
    font-size: 12px;
    color: #B4B4B4;
  }
  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .description{
    font-size: 12px;
    color: #B4B4B4;
    /* 超出部分隐藏 */
  /*  -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical; */
    overflow: hidden;
    height: 16px;
  }

  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right{
  float: right;
  width: 70px;
      margin-top: -7px;
  text-align: right;
  }

  .shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right .price{
  font-size: 12px;
  line-height: 38px;

  }



  .shopcart-wrapper .shopcart-list .list-content .food-item .cartcontrol-wrapper{
    float: right;
    margin-bottom: 6px;
  }


  .shopcart .shopcart-mask{
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 98;
  background: rgba(8, 17, 27, .6);
  }

</style>
