<template>
  <div class="goods">
    <!-- 分类 -->
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <!-- 专场 -->
        <li class="menu-item" :class="{'current':currentIndex === 0}" @click="selectMenu(0)">
          <p class="text">
            <img :src="container.tag_icon" v-if="container.tag_icon" class="icon" />
            {{container.tag_name}}
          </p>
        </li>

        <li class="menu-item" v-for="(item,index) in goods" :class="{'current': currentIndex === index+1}"
          @click="selectMenu(index+1)">
          <p class="text">
            <img :src="item.icon" v-if="item.icon" class="icon" />
            {{item.name}}
          </p>

          <i class="num" v-show="calculateCount(item.spus)">{{calculateCount(item.spus)}}</i>
        </li>
      </ul>
    </div>
    <!-- 商品列表 -->
    <div class="foods-wrapper" ref="foodScroll">
      <ul>
        <!--专场  -->
        <li class="container-list food-list-hook">
          <div v-for="item in container.operation_source_list">
            <img :src="item.pic_url" />
          </div>
        </li>
        <!-- 具体分类 -->
        <li v-for="item in goods" class="food-list food-list-hook">
          <h3 class="title">{{item.name}}</h3>
          <!-- 具体商品列表 -->
          <ul>
            <li v-for="food in item.spus" class="food-item" @click="showDetail(food)">
              <!-- 图片显示 通过定义head_bg方法传参 -->
              <div class="icon" :style="head_bg(food.picture)"></div>
              <div class="content">
                <h3 class="name">{{food.name}}</h3>
                <p class="desc" v-if="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="saled">{{food.month_saled_content}}</span>
                  <span class="praise">{{food.praise_content}}</span>
                </div>
                <img :src="food.product_label_picture" class="product" v-show="food.product_label_picture" />
                <p class="price">
                  <span class="text">￥{{food.min_price}}</span>
                  <span class="unit">/{{food.unit}}</span>
                </p>
              </div>
              <div class="cartcontrol-wrapper">
                <Cartcontrol :food='food'></Cartcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--   <Shopcart :shipping_fee_tip='poiInfo.shipping_fee_tip' :min_price_tip='poiInfo.min_price_tip'
      :selectFoods='selectFoods'></Shopcart> -->
    <!-- 购物车 -->
    <Shopcart :poiInfo='poiInfo' :selectFoods='selectFoods'></Shopcart>

    <!-- 商品详情 -->
    <Food :food='selectedFood'  ref='foodView'></Food>
  </div>
</template>

<script>
  // 导入BScroll
  import BScroll from 'better-scroll'
  // 导入Shopcart
  import Shopcart from 'components/Shopcart/Shopcart'
  // 导入Cartcontrol
  import Cartcontrol from 'components/Cartcontrol/Cartcontrol'
  // 导入Food
  import Food from 'components/Food/Food'

  export default {
    data() {
      return {
        container: {},
        goods: [],
        poiInfo: {},
        listHeight: [],
        scrollY: 0,
        menuScroll: {},
        foodScroll: {},
        selectedFood: {}
      }
    },
    created() {
      // 获取当前vue实例对象
      var that = this;

      // 发起异步请求，获取数据
      this.$axios.get('/api/goods')
        .then(function(response) { //获取到数据
          var dataSource = response.data.data;
          if (dataSource.code == 0) {
            that.container = dataSource.data.container_operation_source;
            that.goods = dataSource.data.food_spu_tags;
            that.poiInfo = dataSource.data.poi_info;
            // 调用滚动的初始化方法
            that.$nextTick(() => {
              that.initScroll();
              // 计算分类区间高度
              that.calculateHeight();
            });
          }
        })
        .catch(function(error) { //出错处理
          console.log(error);
        });
    },
    methods: {
      head_bg(imgName) {
        return "background-image: url(" + imgName + ")"
      },
      // 滚动的初始化
      initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuScroll, {
          click: true
        });
        this.foodScroll = new BScroll(this.$refs.foodScroll, {
          probeType: 3,
          click: true
        });

        // 添加滚动监听事件
        this.foodScroll.on('scroll', (pos) => {
          // console.log(pos.y);
          // 取绝对值，取整
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      calculateHeight() {
        // 通过$refs获取到对应的元素
        let foodlist = this.$refs.foodScroll.getElementsByClassName('food-list-hook');
        // 添加到数组区间
        //0-220
        //221-1537 1758
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodlist.length; i++) {
          let item = foodlist[i];
          // 累加
          height += item.clientHeight;
          this.listHeight.push(height);
          console.log(this.listHeight);
        }
      },
      selectMenu(index) {
        // console.log(index);
        let foodlist = this.$refs.foodScroll.getElementsByClassName('food-list-hook');
        // 根据下表滚动到相对应的元素
        let el = foodlist[index];

        // 滚动到对应元素的位置
        this.foodScroll.scrollToElement(el, 250);
      },
      //spus是当前分组的数据
      calculateCount(spus) {
        let count = 0;
        spus.forEach((food) => {
          if (food.count > 0) {
            count += food.count;
          }
        });

        return count;
      },
      showDetail(food) {
        //传值
        this.selectedFood = food;

        //显示详情页
        this.$refs.foodView.showView();

      }
    },
    computed: {
      currentIndex() { //根据右侧滚动位置，确定对应的索引下标
        for (let i = 0; i < this.listHeight.length; i++) {
          // 获取商品区间的范围
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          // 是否在上述区间中
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            console.log(i);
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];

        // 遍历food属性
        this.goods.forEach((good) => {
          good.spus.forEach((food) => {
            if (food.count > 0) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    components: {
      BScroll,
      Shopcart,
      Cartcontrol,
      Food
    }
  }
</script>

<style>
  /* @import url("Goods.css"); */
  .goods {
    display: flex;

    position: absolute;
    top: 200px;
    /* bottom: 51px; */
    bottom: 37px;

    overflow: hidden;
    width: 100%;
  }

  li {
    list-style: none;
  }

  .goods .menu-wrapper {
    flex: 0 0 85px;
    background: #f4f4f4;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  .goods .menu-wrapper .menu-item {
    position: relative;
    padding: 16px 23px 15px 10px;
    border-bottom: 1px solid #E4E4E4;
  }

  i {
    font-style: normal;
  }

  .goods .menu-wrapper .menu-item.current {
    background: white;
    font-weight: bold;
    margin-top: -1px;
  }

  .goods .menu-wrapper .menu-item .text {
    font-size: 13px;
    color: #333333;
    line-height: 17px;
    vertical-align: middle;
    /* 只显示两行，剩下的用...替代 */
    -webkit-line-clamp: 2;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .goods .menu-wrapper .menu-item .text .icon {
    width: 15px;
    height: 15px;
    vertical-align: middle;
  }

  .goods .menu-wrapper .menu-item .num {
    position: absolute;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    color: white;
    right: 5px;
    top: 5px;
    text-align: center;
    font-size: 7px;
    line-height: 13px;
    background: red;

  }


  .goods .foods-wrapper {
    flex: 1;
    /* background: blue; */
  }

  .goods .foods-wrapper .container-list {
    padding: 11px 11px 0 11px;
    border-bottom: 1px solid #E4E4E4;
  }

  .goods .foods-wrapper .container-list img {
    width: 100%;
    margin-bottom: 11px;
    border-radius: 5px;
  }

  .goods .foods-wrapper .food-list {
    padding: 11px;
  }

  .goods .foods-wrapper .food-list .title {
    height: 13px;
    font-size: 13px;
    background: url(btn_yellow_highlighted@2x.png) no-repeat left center;
    background-size: 2px 10px;
    padding-left: 7px;
    margin-bottom: 12px;
  }

  .goods .foods-wrapper .food-list .food-item {
    display: flex;
    margin-bottom: 25px;
    position: relative;
  }

  .goods .foods-wrapper .food-list .food-item .icon {
    flex: 0 0 63px;
    background-position: center;
    background-size: 120% 120%;
    background-repeat: no-repeat;
    margin-right: 11px;
    height: 70px;
  }

  .goods .foods-wrapper .food-list .food-item .content {
    flex: 1;
  }

  .goods .foods-wrapper .food-list .food-item .content .name {
    font-size: 16px;
    line-height: 21px;
    color: #333333;
    margin-bottom: 10px;
    padding-right: 27px;
  }

  .goods .foods-wrapper .food-list .food-item .content .desc {
    font-size: 10px;
    line-height: 19px;
    color: #bfbfbf;
    margin-bottom: 8px;
    /* 只显示一行 */
    -webkit-line-clamp: 1;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;

  }

  .goods .foods-wrapper .food-list .food-item .content .extra {
    font-size: 10px;
    color: #BFBFBF;
    margin-bottom: 7px;
  }

  .goods .foods-wrapper .food-list .food-item .content .extra .saled {
    margin-right: 14px;
  }

  .goods .foods-wrapper .food-list .food-item .content .product {
    height: 15px;
    margin-bottom: 6px;
  }

  .goods .foods-wrapper .food-list .food-item .content .price {
    font-size: 0;
  }

  .goods .foods-wrapper .food-list .food-item .content .price .text {
    font-size: 14px;
    color: #fb4e44;
  }

  .goods .foods-wrapper .food-list .food-item .content .price .unit {
    font-size: 12px;
    color: #BFBFBF;
  }

  .goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
  }
</style>
