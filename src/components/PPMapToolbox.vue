<template>
  <div class="app-top-right clearfix">
    <div class="user-center">
      <div id="user-center" class="shadow-border" @click="userCenterResponse"></div>
      <div class="user-box" v-if="hasLogin">
        <span class="arrow-tip"></span>
        <div class="user-box-top clearfix">
          <div class="avatar"></div>
          <dl>
            <dt>{{userName}}</dt>
            <dd>欢迎使用</dd>
          </dl>
        </div>
        <div class="user-box-bottom">
          <ul class="list">
            <li class="icon marker_icon" @click="markerResponse('marker')">
              <span class="caption">我的标注</span>
            </li>
            <li class="icon collect_icon" @click="markerResponse('collection')">
              <span class="caption">我的收藏</span>
            </li>
            <li class="icon logout_iocn" @click="exitResponse">
              <span class="caption">退出</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="toolbox-container">
      <ul class="toolbox clearfix shadow-border">
        <li class="pre-icon city right-border"><span>北京市<i class="drop-icon"></i></span></li>
        <li :class="[isTrafficShow?'active':'','pre-icon','traffic','right-border']" @click="trafficResponse"
            :title="lk_title_toggle"><span>路况</span></li>
        <li class="pre-icon tool">
          <span @click="tooloptResponse">工具<i class="drop-icon"></i></span>
          <div class="tool-box shadow-border" v-if="isToolShow">
            <ul>
              <li :class="[active_tool==='measure' ? 'active' : '','map-measure','measure']" @click="measure">
                <span>测距</span>
              </li>
              <li :class="[active_tool==='point' ? 'active' : '','map-measure','mark']" v-on:click="pointResponse">
                <span>标点</span>
              </li>
              <li :class="[active_tool==='line' ? 'active' : '','map-measure','line']" v-on:click="lineResponse">
                <span>标线</span>
              </li>
              <li :class="[active_tool==='polygon' ? 'active' : '','map-measure','cover']" v-on:click="polygonResponse">
                <span>标面</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="city-box shadow-border hidden">
        城市切换
      </div>
      <div class="traffic-box shadow-border clearfix" v-if="trafficDesc&!hasLogin&!isToolShow">
        <ul class="fl-list clearfix">
          <li><span>更新时间: </span><span>{{nowDate}}</span><span class="update-icon" title="更新"
                                                               @click="updateTraffic"></span></li>
          <li>
            <span class="traffic-legend level1">严重拥堵</span>
            <span class="traffic-legend level2">拥挤</span>
            <span class="traffic-legend level3">缓行</span>
            <span class="traffic-legend level4">畅通</span>
          </li>
        </ul>
      </div>
    </div>


  </div>
</template>

<script>
  import * as globals from '../globals'
  import {mapGetters, mapActions, mapState} from 'vuex'
  import eventBridge from '../globals/eventBridge'
  import ToolboxController from '../controller/toolbox_controller'
  export default {
    name: 'PPMapToolbox',
    data () {
      return {
        hasLogin: false,
        active_tool: 'measure',
        userName: '',
        userId: '',
        isTrafficShow: true,   //路况显示
        trafficDesc: true,    //路况描述显示
        isToolShow: false,    //工具框显示
        nowDate: '',         //当前时间
      }
    },
    mounted(){
      this.controller = new ToolboxController(this);
      this.nowDate = this.getNowFormatDate();
    },
    computed: {
      lk_title_toggle: function () {
        switch (this.isTrafficShow) {
          case true:
            return '关闭路况';
            break;
          case false:
            return '打开路况';
            break;
          default:
            return '关闭路况';
            break;
        }
      }
    },
    methods: {
      userCenterResponse(){
        this.isToolShow = false;
        let user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          this.hasLogin = !this.hasLogin;
          this.userName = user.userName;
          this.userId = user.userId;
        } else {
          this.$emit('loginShow', true);
        }
      },

      /*退出系统*/
      exitResponse(){
        localStorage.setItem("user", null);
        this.hasLogin = false;
      },

      /*路况响应*/
      trafficResponse(){
        this.isTrafficShow = this.trafficDesc ? false : true;
        this.trafficDesc = this.trafficDesc ? false : true;
        eventBridge.$emit('trafficResponse', this.isTrafficShow)
      },

      //获取系统时间
      getNowFormatDate() {
        let date = new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        hour = hour >= 0 && hour <= 9 ? "0" + hour : hour;
        minute = minute >= 0 && minute <= 9 ? "0" + minute : minute;
        let currentdate = hour + ':' + minute;
        return currentdate;
      },

      //更新路况
      updateTraffic(){
        this.nowDate = this.getNowFormatDate();
        eventBridge.$emit('trafficResponse', false);
        setTimeout(() => {
          eventBridge.$emit('trafficResponse', true);
        }, 200)
      },

      /*工具响应*/
      tooloptResponse(){
        this.hasLogin = false;  //隐藏用户框
        this.isToolShow = !this.isToolShow;
        if (this.isToolShow) {
          eventBridge.$emit('measure')
        }
      },

      /*测距*/
      measure(){
        this.active_tool = "measure";
        eventBridge.$emit('measure');
      },

      /*标点*/
      pointResponse(){
        this.active_tool = "point";
        eventBridge.$emit('point');
      },

      /*标线*/
      lineResponse(){
        this.active_tool = "line";
        eventBridge.$emit('line');
      },

      /*标面*/
      polygonResponse(){
        this.active_tool = "polygon";
        eventBridge.$emit('polygon');
      },

      //标注与收藏
      markerResponse(type){
        eventBridge.$emit('markerBoxShow');
        eventBridge.$emit('markerType',type);
        /*var searchWrap = document.getElementById("ui3-search-wrap");
        var info = document.getElementsByClassName("info-box clearfix");
        info[0].style.display = "none";
        searchWrap.style.display = "none";
        eventBridge.$emit('markerType',type);
        eventBridge.$emit('cleanPoint');
        this.updateMarkerShow(true);
        this.updateMarkerType(type);
        this.updateActiveClick(false);*/
      },
    }
  }
</script>

<style scoped>
  .app-top-right {

  }

  .user-center, .toolbox-container {
    float: right;
    position: relative;
  }

  .toolbox-container {
    margin-top: 5px;
    margin-right: 15px;
    min-width: 266px;
  }

  ul.toolbox {
    background-color: #fff;
    height: 34px;
    border-radius: 3px;
  }

  .toolbox > li {
    float: left;
    padding-right: 15px;
    padding-left: 5px;
    cursor: pointer;
    height: 28px;
    line-height: 28px;
    margin-top: 3px;
  }

  li.pre-icon > span {
    display: inline-block;
    vertical-align: middle;
    padding-left: 30px;
    background-repeat: no-repeat;
    background-position: 5px center;
    font-size: 12px;
    color: #666;
  }

  li.pre-icon.active > span {
    color: #3b81ff;
  }

  .pre-icon.city > span {
    background-image: url("../../static/images/city.png");
  }

  .pre-icon.traffic > span {
    background-image: url("../../static/images/lk.png");
  }

  .pre-icon.tool > span {
    background-image: url("../../static/images/gongju.png");
  }

  .pre-icon.city:hover > span {
    color: #3b81ff;
    background-image: url("../../static/images/city_up.png");
  }

  .pre-icon.traffic.active > span {
    background-image: url("../../static/images/lk_up.png");
  }

  .pre-icon.tool:hover > span {
    color: #3b81ff;
    background-image: url("../../static/images/gongju_up.png");
  }

  i.drop-icon {
    padding-left: 15px;
    background: url("../../static/images/down.png") no-repeat right center;
  }

  .user-center {
    width: 42px;
    height: 42px;
  }

  #user-center {
    width: 42px;
    height: 42px;
    background: #fff url("../../static/images/avatar.png") no-repeat center;
    background-size: cover;
    border-radius: 50%;
    cursor: pointer;
  }

  li.right-border {
    border-right: 1px solid #eee;
  }

  .city-box {

  }

  .traffic-box {
    position: absolute;
    top: 40px;
    right: 0;
    width: 100%;
    background-color: #fff;
    height: 28px;
    max-width: 280px;
    text-align: center;
  }

  .traffic-box, .traffic-box span {
    font-size: 12px;
    color: #666;
  }

  .traffic-box .traffic-legend {
    font-size: 10px;
    color: #fff;
    padding: 2px;
  }

  .traffic-legend.level1 {
    background-color: #b00;
  }

  .traffic-legend.level2 {
    background-color: #f23030;
  }

  .traffic-legend.level3 {
    background-color: #ff9f19;
  }

  .traffic-legend.level4 {
    background-color: #17bf00;
  }

  .traffic-box li > span {
    line-height: 28px;
  }

  .update-icon {
    padding-left: 14px;
    background: url("../../static/images/updata.png") 0px 0px / 12px 13px no-repeat;
    cursor: pointer;
    margin: 0 5px;
  }

  .pre-icon.tool {
    position: relative;
  }

  .tool-box {
    position: absolute;
    left: 0;
    top: 31px;
    background-color: #fff;
    width: 100%;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .tool-box > ul > li {
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    padding-left: 36px;
    background-repeat: no-repeat;
    background-position: 8px 4px;
    color: #666;
    font-size: 12px;
  }

  .tool-box > ul > li:hover, .tool-box > ul > li.active {
    color: #3b81ff;
  }

  .tool-box > ul > li.measure {
    background-image: url("../../static/images/cj.png");
  }

  .tool-box > ul > li.mark {
    background-image: url("../../static/images/dian.png");
  }

  .tool-box > ul > li.line {
    background-image: url("../../static/images/xian.png");
  }

  .tool-box > ul > li.cover {
    background-image: url("../../static/images/mian.png");

  }

  .tool-box > ul > li:hover.measure, .tool-box > ul > li.measure.active {
    background-image: url("../../static/images/cj2.png");
  }

  .tool-box > ul > li:hover.mark, .tool-box > ul > li.mark.active {
    background-image: url("../../static/images/dian2.png");
  }

  .tool-box > ul > li:hover.line, .tool-box > ul > li.line.active {
    background-image: url("../../static/images/xian2.png");
  }

  .tool-box > ul > li:hover.cover, .tool-box > ul > li.cover.active {
    background-image: url("../../static/images/mian2.png");
  }

  /*用户头像*/
  .user-box {
    position: absolute;
    top: 60px;
    right: 0;
    width: 240px;
  }

  .arrow-tip {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 7px 8px;
    border-color: transparent transparent #3385ff;
    position: absolute;
    top: -6px;
    right: 17px;
  }

  .user-box-top {
    width: 100%;
    height: 80px;
    background: #3385ff;
    border-radius: 6px 6px 0 0;
  }

  .user-box-bottom {
    background-color: #fff;
  }

  .user-box-top .avatar {
    float: left;
    width: 56px;
    height: 56px;
    background: #fff url("../../static/images/avatar.png") no-repeat center;
    background-size: cover;
    border-radius: 50%;
    margin-left: 10px;
    margin-top: 12px;
  }

  .user-box-top dl {
    float: left;
    line-height: 20px;
    margin-top: 18px;
    margin-left: 12px;
    color: #fff;
  }

  .user-box-bottom .list {
    padding: 0 12px;
  }

  .list > li {
    height: 40px;
    width: 100%;
    line-height: 40px;
    border-bottom: 1px dashed #eee;
    position: relative;
    cursor: pointer;
    padding: 0px;
  }

  .list > li.icon {
    background-position: left center;
    background-repeat: no-repeat;
    color: #8a8a8a;
  }

  .list > li > .caption {
    display: inline-block;
    vertical-align: middle;
    margin-left: 30px;
  }

  .list > li.marker_icon {
    background-image: url("../../static/images/marker_icon.png");
  }

  .list > li.collect_icon {
    background-image: url("../../static/images/collect_icon.png");
  }

  .list > li.logout_iocn {
    background-image: url("../../static/images/logout_icon.png");
  }

  .list > li.marker_icon:hover {
    background-image: url("../../static/images/marker_icon_hover.png");
    color: #3b81ff;
  }

  .list > li.collect_icon:hover {
    background-image: url("../../static/images/collect_icon_hover.png");
    color: #3b81ff;
  }

  .list > li.logout_iocn:hover {
    background-image: url("../../static/images/logout_icon_hover.png");
    color: #3b81ff;
  }
</style>
