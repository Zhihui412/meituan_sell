<template>
  <div class="cartcontrol">
<transition name="move">
  <div class="cart-decrease  icon-remove_circle_outline" @click.stop.prevent="decreaseCart"
      v-show="food.count">
  <span class="inner"></span>
      </div>
</transition>
    <div class="cart-count" v-show="food.count">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart">
      <i class="bg"></i>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      decreaseCart() {
        this.food.count--;
      },
      addCart() {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++;
        }
      }
    }
  }
</script>

<style>
  /* @import url("Cartcontrol.css"); */
  .cartcontrol{
    font-size: 0;
  }

  .cartcontrol .cart-decrease{
    display: inline-block;
    width: 26px;
    height: 26px;
    font-size: 26px;
    color: #b4b4b4;
  }

  .cartcontrol .cart-count{
  display: inline-block;
  width: 25px;
  text-align: center;
  font-size: 12px;
  line-height: 26px;
  vertical-align: top;
  }

  .cartcontrol .cart-add{
    display: inline-block;
    width: 26px;
    height: 26px;
    font-size: 26px;
    color: #ffd161;
    position: relative;
  }
  .cartcontrol .cart-add .bg{
    background: black;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    left: 3px;
    top: 3px;
    z-index: -1;
  }

  .move-enter-active,.move-leave-active{
    transition: all .5s linear;
  }

  .move-enter,.move-leave-to{
    transform: translateX(30px) rotate(180deg);
  }

</style>
