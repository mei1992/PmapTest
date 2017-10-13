<template>
    <div id="PMIndexView" style='position:relative;'>
        <!-- 背景地图 -->
      <div id="func-list">
        <p-p-map-home @loginShow="loginResponse"></p-p-map-home>
      </div>
      <!-- 搜索盒子 -->
      <div id="search">
        <p-p-map-searchbox></p-p-map-searchbox>
      </div>
      <!-- 右边的工具栏 -->
      <div id="tool">
        <p-p-map-toolbox @loginShow="loginResponse"></p-p-map-toolbox>
      </div>
      <!-- 登录&注册组件 -->
      <div id="login-reg" v-if="isLoginShow">
        <p-p-map-login @loginShow="loginResponse"></p-p-map-login>
      </div>
      <!-- 选择地图类型组件 -->
      <div id="type">
       <p-p-map-typebox></p-p-map-typebox>
     </div>
    </div>
</template>

<script>
import eventBridge from './globals/eventBridge'
/*import './assets/css/templatemo.css'
import './assets/css/font-awesome.min.css'*/
  // <!-- -------------------地图组件--------------------- -->
import PPMapHome from './components/PPMapHome'
  // <!-- -------------------搜索盒子组件--------------------- -->
import PPMapSearchbox from './components/PPMapSearchbox'
// <!-- -------------------工具盒子组件--------------------- -->
import PPMapToolbox from './components/PPMapToolbox'
// <!-- -------------------登录&注册组件--------------------- -->
import PPMapLogin from './components/PPMapLogin'
// <!-- -------------------选择地图类型组件--------------------- -->
import PPMapTypebox from './components/PPMapTypebox'

export default {
  name: 'PMMainView',
  data () {
    return {
      isLoginShow:false,
    }
  },
  methods: {
    /*登录注册框 显示与隐藏*/
    loginResponse(bool){
      this.isLoginShow = bool;
    },
  },
  components: {
    PPMapHome,
    PPMapSearchbox,
    PPMapToolbox,
    PPMapLogin,
    PPMapTypebox
  },
  mounted () {
    //显示登录注册组件
    let _this = this;
  }
}
</script>

<style scoped>
  #PMIndexView {
    width: 100%;
    height: 100%;
  }

  #func-list{
    position:absolute;
    width:100%;
    height:100%;
    z-index:1;
    left:0px;
    top:0px;
  }

  #search{
    position:absolute;
    z-index:10;
    left:0px;
    top:0px;
  }

  #tool{
    position:absolute;
    z-index:10;
    right:20px;
    top:20px;
  }

  #login-reg{
    position: absolute;
    top:50%;
    left:50%;
    z-index:10;
    width: 650px;
    height: 350px;
    background-color: #fff;
    margin-left: -340px;
    margin-top: -200px;
  }

  #type{
    position:absolute;
    height:80px;
    z-index:10;
    bottom:0px;
    right:0px;
  }

</style>
