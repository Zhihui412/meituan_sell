<template>
  <div id="app">
    <!-- 头部 -->
    <Myheader :poiInfo='poiInfo'></Myheader>
    <!-- 导航 -->
    <MyNav :commentNum='commentNum'></MyNav>
    <!-- 主体内容 -->
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>

  import Myheader from 'components/Header/Header.vue';
  import MyNav from 'components/Nav/Nav.vue';


  export default {
    name: 'App',
    components: {
      Myheader,
      MyNav,
    },
    data(){
      return {
        // header 组件需要的信息（商家信息）
        poiInfo:{},
        commentNum:0
      }
    },
    created(){
      // 获取当前vue实例对象
      var that = this;

      // 发起异步请求，获取数据
      this.$axios.get('/api/goods')
      .then(function(response){//获取到数据
        // console.log(response);
        var dataSource = response.data.data;
        // console.log(dataSource);
        if(dataSource.code == 0){
          that.poiInfo = dataSource.data.poi_info;
          // console.log(that.poiInfo);
        }
      })
      .catch(function(error){//出错处理
        console.log(error);
      });

      // 发起异步请求，获取数据
      this.$axios.get('/api/ratings')
      .then(function(response){//获取到数据
        var dataSource = response.data.data;
        if(dataSource.code == 0){
          that.commentNum = dataSource.data.comment_num;
        }
      })
      .catch(function(error){//出错处理
        console.log(error);
      });
    }
  }
</script>

<style>
  #app {
/*    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px; */
  }
</style>
