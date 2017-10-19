<template>
  <div class="app-top-left">
    <div class="search-container">
      <div class="search-box clearfix">
        <div class="content fl clearfix shadow-border">
          <input type="text" class="search-input big-font" placeholder="搜地点、找路线" v-model.trim="searchText"
                 v-focus="text_focusState" v-on:focus="suggestFocus">
          <span class="icon_route" title="路线" v-if="!searchText" @click="routeResponse"></span>
          <span class="icon_clear" title="清除" v-if="searchText" @click="clearText"></span>


          <div class="inner-box search-suggest-box shadow-border" v-if="suggestShow">
            <div class="suggest-top">
              <ul class="list1 fl-list clearfix">
                <li v-on:mousedown="addSearchTest($event)"><span class="item1">美食</span></li>
                <li v-on:mousedown="addSearchTest($event)"><span class="item2">酒店</span></li>
                <li v-on:mousedown="addSearchTest($event)"><span class="item3">公交</span></li>
              </ul>
              <ul class="list2 fl-list clearfix">
                <li v-on:mousedown="addSearchTest($event)"><span>景点</span></li>
                <li v-on:mousedown="addSearchTest($event)"><span>电影院</span></li>
                <li v-on:mousedown="addSearchTest($event)"><span>银行</span></li>
                <li v-on:mousedown="addSearchTest($event)"><span>KTV</span></li>
              </ul>
            </div>
            <ul class="history-list hidden">
              <li><i class="icon-history"></i><span>历史记录1</span></li>
              <li><i class="icon-history"></i><span>历史记录2</span></li>
            </ul>
            <div class="suggest-bottom hidden">
              <span>删除历史记录</span>
            </div>

          </div>

          <div class="inner-box poi-box" v-if="choose_start_end">
            <div class="choose-start-end">
              <div class="choose-start-end-header">
                <div class="choose-start-end-name">{{cur_poi.name}}</div>
                <div class="startEnd">
                  <div class="startEnd-start" @click="setStartEnd('end')">
                    <span class="icon-start"></span>
                    <span class="choose-point">到这去</span>
                  </div>
                  <div class="startEnd-end" @click="setStartEnd('start')">
                    <span class="icon-end"></span>
                    <span class="choose-point">从这出发</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="poi-item" style="pointer-events: auto;">
              <dl>
                <dt>{{cur_poi.name}}<span :class="[is_collected? 'active': '','star-icon']" :title=collectionTitle
                                          @click="addToCollection()"></span></dt>
                <dd>{{cur_poi.address}}</dd>
                <dd></dd>
              </dl>
            </div>
          </div>

          <div v-if="poiList.length>0&isListShow"
               :class="[positionShow?'top':'normal','inner-box','search-list-box','shadow-border']">
            <EasyScrollbar>
              <ul class="poi-list">
                <li v-for="(item,index) in poiList" @click="getCurPoi(item,index)"
                    v-on:mouseover="lightPoi(item,index)">
                  <dl>
                    <dt>{{item.name}}</dt>
                    <dd class="adress_dd">{{item.address}}</dd>
                    <dd>{{item.tel ? item.tel : ''}}</dd>
                  </dl>
                </li>
              </ul>
            </EasyScrollbar>
            <div id="pagenation" style="text-align: center;">
              <ul class="pagenation clearfix">
                <li class="page_ctrl" @click="updatePage('pre_page')">
                  <span :class="[curPage===1?'disabled':'normal','pre_icon']"></span>
                </li>
                <li>
                  <div>
                    <input type="text" class="page_input" v-model="curPage" @keyup.enter="updatePage('cur_page')">
                    <span>/</span>
                    <span>{{pageCount}}</span>
                  </div>
                </li>
                <li class="page_ctrl" @click="updatePage('next_page')">
                  <span :class="[curPage===pageCount?'disabled':'normal','next_icon']"></span>
                </li>
              </ul>
            </div>
          </div>

          <div class="inner-box card-list shadow-border" v-if="this.show_marker">
            <i class="close-icon" @click="closeMarkBox"></i>
            <p class="card-tab">
              <span :class="{active:marker_type==='marker'}" @click="markerToActive('marker')">
                <i class="card-icon marker"></i><span>我的标注</span><i class="active-tip"></i>
              </span>
              <span :class="{active:marker_type==='collection'}" @click="markerToActive('collection')">
                <i class="card-icon collect"></i><span>我的收藏</span><i class="active-tip"></i>
              </span>
            </p>
            <EasyScrollbar :barOption="myBarOption">
              <div class="content-box">
                <ul class="marker-list" v-if="marker_type==='marker'">
                  <li v-for="(item,index) in markerList"
                      :class="[item.markerType ===1? 'point_icon': item.markerType ===2? 'line_icon':'polygon_icon']">
                    <dl @click="markerTo(item)">
                      <dt>{{item.markerName}}</dt>
                      <dd>{{item.markerContent}}</dd>
                    </dl>
                    <span class="del-icon" @click="delMarker(item)"></span>
                  </li>
                </ul>
                <ul class="collect-list" v-if="marker_type!='marker'">
                  <li v-for="(item,index) in collectionList">
                    <dl @click="markerTo(item)">
                      <dt>{{item.markerName}}</dt>
                      <dd>{{item.markerContent}}</dd>
                    </dl>
                    <span class="del-icon" @click="delMarker(item)"></span>
                  </li>
                </ul>
              </div>
            </EasyScrollbar>
          </div>

          <div class="inner-box position-box shadow-border" v-if="positionShow">
            <span class="icon_clear" title="关闭" @click="closePosition"></span>
            <div class="pos-box">
              <ul class="pos-list fl-list clearfix">
                <i class="cur-tip"></i>
                <li class="drive active"><span>驾车</span></li>
                <li class="bus"><span>公交</span></li>
                <!--<li class="walk"><span>步行</span></li>
                <li class="bike"><span>骑行</span></li>-->
              </ul>
              <div class="box clearfix">
                <i class="toggle-pos" @click="toggleStartEnd" title="切换起终点"></i>
                <div class="pos-text">
                  <input type="text" class="input-item start-icon" v-on:focus="inputFocus('start')"
                         v-focus="start_focusState"
                         v-model.trim="startText" placeholder="输入起点或在图区选点">
                  <input type="text" class="input-item end-icon" v-on:focus="inputFocus('end')" v-focus="end_focusState"
                         v-model.trim="endText"
                         placeholder="输入终点或在图区选点">
                  <i class="clear clear-start" v-if="startText" @click="clearStart"></i>
                  <i class="clear clear-end" v-if="endText" @click="clearEnd"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="inner-box route-box shadow-border" v-if="routeShow">
            <div class="route-inner">
              <ul class="planList fl-list clearfix">
                <li :class="[cur_plan === 0? 'active': '','br']" @click="getPlan(0)"><span>方案一</span></li>
                <li :class="[cur_plan === 1? 'active': '','br']" @click="getPlan(1)"><span>方案二</span></li>
                <li :class="[cur_plan === 2? 'active': '']" @click="getPlan(2)"><span>方案三</span></li>
              </ul>
              <div class="loadingBox" v-if="segmts.length === 0"></div>
              <div class="plan-box" v-if="segmts.length>0">
                <div class="plan-tip">
                  <ul class="fl-list clearfix">
                    <li><span>{{totalTime}}</span></li>
                    <li><span>{{totalDist}}公里</span></li>
                    <li><span>{{totalSignal}}个红绿灯</span></li>
                  </ul>
                  <div>
                    <span>途径:</span>
                    <span v-for="(item,index) in roadNames">{{item}} <i v-if="index<2">,</i></span>
                  </div>
                </div>
                <EasyScrollbar>
                  <div class="route-content">
                    <div><i class="startIcon"></i>{{startText}}</div>
                    <ul>
                      <li class="route-item" v-for="(item,index) in segmts" v-if="item.roadName">
                        <span :class="_controller.getActionClassName(item.action)"></span>
                        <div class="item-li-content">
                          <span>{{_controller.getActionName(item.action)}}，</span>
                          <span>进入{{item.roadName[1]}},</span>
                          <span>{{Number(item.dist.dist).toFixed(1) * 1000}}米</span>
                        </div>
                      </li>
                    </ul>
                    <div><i class="endIcon"></i>{{startText}}</div>
                  </div>
                </EasyScrollbar>
              </div>

            </div>
          </div>
        </div>
        <div class="fl icon_search" title="搜索" @click="searchResponse"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as globals from '../globals'
  import {mapGetters, mapActions, mapState} from 'vuex'
  import eventBridge from '../globals/eventBridge'
  import SearchboxController from '../controller/searchbox_controller'
  export default {
    name: 'PPMapSearchbox',
    data () {
      return {
        show_marker: false,
        collectionList: [],
        markerList: [],
        marker_type: 'marker',
        myBarOption: {
          barColor: "#b1b1b1",   //滚动条颜色
          barWidth: 6,           //滚动条宽度
          railColor: "#dddddd",     //导轨颜色
          barMarginRight: 1,     //垂直滚动条距离整个容器右侧距离单位（px）
          barMaginBottom: 0,     //水平滚动条距离底部距离单位（px)
          barOpacityMin: 0.5,      //滚动条非激活状态下的透明度
          zIndex: "auto",        //滚动条z-Index
          autohidemode: true,     //自动隐藏模式
          horizrailenabled: true,//是否显示水平滚动条

        },
        suggestShow: false,
        searchText: "",
        startText: '',     //起点input
        endText: '',       //终点input
        positionShow: false,
        poiList: [],       //poi列表
        isListShow: false,
        curPage: 1,
        pageCount: 0,     //总页数
        cur_poi: null,    //当前poi
        is_collected: false,    //当前poi是否已收藏
        choose_start_end: false,
        cur_inputText: '',   //当前input
        startPoi: null,   //起点poi
        endPoi: null,    //终点poi
        //路径规划需要
        routeShow: false,
        cur_plan: 0,
        rows: null,
        totalTime: null,    //总时间
        totalDist: null,    //总距离
        totalSignal: null,   //红绿灯总数
        roadNames: [],      //途径地
        segmts: [],        //行驶方案段

        text_focusState: false,   //文本搜搜框focus状态
        start_focusState: false,  //起点focus状态
        end_focusState: false,    //终点focus状态
      }
    },
    mounted(){
      let _this = this;
      _this.controller = new SearchboxController(_this);
      this.$nextTick(function () {
        eventBridge.$on('markerBoxShow', function () {
          _this.show_marker = true;
        });
        eventBridge.$on('markerType', function (type) {
          _this.marker_type = type;
          _this.controller.getMarkerList(type);
        });
        eventBridge.$on("updateMarker", function (userId, markerId, markerType, markerGeom, name, desc) {
          _this.controller.updateMarker(userId, markerId, markerType, markerGeom, name, desc)
        });
        eventBridge.$on('suggestHide', function () {      //隐藏掉suggest框
          _this.suggestShow = false;
        });

        //退出做强制清除
        eventBridge.$on('userExit',function(){
          _this.closeMarkBox();
        });
        eventBridge.$on('clickOnMap',function(name,geom){
          _this.suggestShow = false;
          _this.mapClickResponse(name,geom);
        })
      });
    },
    computed: {
      ...mapGetters(['cur_city', 'cur_token']),
      collectionTitle: function () {
        if (this.is_collected) {
          return "已收藏";
        } else {
          return "加入收藏";
        }
      },
      is_click_active: function () {
        if (this.text_focusState || this.start_focusState || this.end_focusState) {
          return true;
        } else {
          return false;
        }
      },
      _controller(){
        return this.controller || new SearchboxController(this)
      }
    },
    methods: {
      ...mapActions(['updateCurCity']),
      //标注与收藏切换
      markerToActive(type){
        eventBridge.$emit('markerType', type);
      },
      markerTo(marker){
        eventBridge.$emit('cleanPoint');
        eventBridge.$emit('cur_marker', marker);
      },
      delMarker(marker){
        this.controller.delMarker(marker);
      },
      closeMarkBox(){
        eventBridge.$emit('cleanPoint');
        this.show_marker = false;
      },
      suggestFocus(){
        this.text_focusState = true;
        this.isListShow = true;
        this.suggestShow = true;
        this.choose_start_end = false;
        this.closeMarkBox();
      },

      addSearchTest($event){
        let text = $event.target.innerText;
        this.searchText = text;
        //$event.preventDefault();
      },
      searchResponse(){
        this.suggestShow = false;
      },
      routeResponse(){
        this.positionShow = true;
        this.suggestShow = false;
        this.closeMarkBox();
        let _this = this;
        setTimeout(function () {
          _this.start_focusState = false;
          _this.end_focusState = false;
        }, 200);
      },
      clearText(){
        this.searchText = "";
        this.poiList = [];
        this.curPage = 1;
        this.pageCount = 0;
        eventBridge.$emit("updatePage"); //同时清除当前页poi-marker
        //eventBridge.$emit("cleanPoint");
        this.choose_start_end = false;  //
      },
      closePosition(){
        this.positionShow = false;
        this.routeShow = false;
        this.cur_plan = 0;
        eventBridge.$emit('removeLine');
        eventBridge.$emit('cleanPoint');
        eventBridge.$emit('resetRoute');  //彻底清除起终点
        eventBridge.$emit('clickDisable');    //取消地图可点击
        this.clearStart();
        this.clearEnd();
      },
      clearStart(){
        this.startText = "";
        this.routeShow = false;
        this.segmts = [];
        this.cur_plan = 0;
        eventBridge.$emit("cleanStartEnd", 'start'); //清除起终点marker
        eventBridge.$emit('removeLine');
        eventBridge.$emit('clickDisable');
      },
      clearEnd(){
        this.endText = "";
        this.routeShow = false;
        this.segmts = [];
        this.cur_plan = 0;
        eventBridge.$emit("cleanStartEnd", 'end'); //清除起终点marker
        eventBridge.$emit('removeLine');
        eventBridge.$emit('clickDisable');
      },
      //起终点input获得焦点，激活poiList监听
      inputFocus(type){
        this.isListShow = true;
        this.cur_inputText = type;
        if (type === 'start') {
          this.start_focusState = true;
          this.end_focusState = false;
        } else {
          this.start_focusState = false;
          this.end_focusState = true;
        }
      },
      //poi分页跳转
      updatePage(page){
        let text = this.searchText;
        if (this.positionShow) {
          if (this.cur_inputText === 'start') {
            text = this.startText;
          } else {
            text = this.endText;
          }
        }
        if (page === "cur_page" && this.curPage > 0 && this.curPage <= this.pageCount) {
          this.controller.getSearchTest(text, this.curPage);
        } else if (page === "pre_page" && this.curPage > 1) {
          this.curPage--;
          this.controller.getSearchTest(text, this.curPage);
        } else if (page === "next_page" && this.curPage < this.pageCount) {
          this.curPage++;
          this.controller.getSearchTest(text, this.curPage);
        }
        eventBridge.$emit("updatePage")
      },

      // 点亮当前poi
      lightPoi(poi, index){
        eventBridge.$emit('lightPoi', poi, index);
      },

      getCurPoi(item, index){
        let geom = item.geom;
        this.cur_poi = item;
        this.poiList = [];
        this.curPage = 1;
        this.pageCount = 0;
        eventBridge.$emit("updatePage"); //同时清除当前页poi-marker
        eventBridge.$emit("getCurPoi", item);
        if (this.positionShow) {        //选择起终点
          this.isListShow = false;
          if (this.cur_inputText === 'start') {
            this.startText = item.name;
          } else {
            this.endText = item.name;
          }
          eventBridge.$emit('setStartEndPoint', this, 0, item, this.cur_inputText)
        } else {                      //定位当前poi
          this.choose_start_end = true;
          this.is_collected = false;
          if (localStorage.getItem("user")) {
            this.controller.getMarkerList('collection');  //获取收藏列表
            this.collectionList.map((item) => {
              if (JSON.stringify(item.markerGeom.coordinates) === JSON.stringify(geom.coordinates)) {
                this.is_collected = true;
              }
            });
          }else{
            this.is_collected = false;
          }
        }
      },
      addToCollection(){
        this.controller.addToCollection();
      },

      //设置起终点
      setStartEnd(type){
        let curPoi = this.cur_poi;
        let geom = curPoi.geom;
        this.choose_start_end = false;
        this.positionShow = true;
        eventBridge.$emit('setStartEndPoint', this, 0, curPoi, type);  //设置终点
        this.isListShow = false;
        if (type === 'start') {
          this.startText = curPoi.name;
        } else {
          this.endText = curPoi.name;
        }

      },
      getPlan(index){
        this.cur_plan = index;
        this.segmts = [];
        eventBridge.$emit('changeRoutePlan', this, index);
      },

      // 地图点击事件响应
      mapClickResponse(name,geom){
        if(this.positionShow){    //起终点路线click
          if(this.cur_inputText === 'start'){
            this.startText = name;
          }else{
            this.endText = name;
          }
          eventBridge.$emit('setStartEndPoint',this,0,geom,this.cur_inputText);
          this.isListShow = false;
        }else{           //文本搜索框click
            this.searchText = name;
        }
      },

      //切换起终点
      toggleStartEnd(){
          this.segmts = [];
          let temp = this.startText;
        this.startText = this.endText;
        this.endText = temp;
        eventBridge.$emit('changeStartEnd',this)
      }

    },
    watch: {
      searchText(newVal, oldVal){
        if (newVal && this.isListShow) {
          this.suggestShow = false;
          this.controller.getSearchTest(newVal, this.curPage);
          eventBridge.$emit("updatePage"); //同时清除当前页poi-marker
        } else {

          this.clearText();
        }
      },
      startText(newVal, oldVal){
        if (newVal && this.isListShow) {
          this.controller.getSearchTest(newVal, this.curPage);
          eventBridge.$emit("updatePage"); //同时清除当前页poi-marker
        } else {
          this.clearText();
        }
      },
      endText(newVal, oldVal){
        if (newVal && this.isListShow) {
          this.controller.getSearchTest(newVal, this.curPage);
          eventBridge.$emit("updatePage"); //同时清除当前页poi-marker
        } else {
          this.clearText();
        }
      },
      is_click_active(newVal, oldVal){
        if (newVal) {
          eventBridge.$emit('clickActive');
        } else {
          eventBridge.$emit('clickDisabled');
        }
      },
      positionShow(newVal, oldVal){
        if (newVal) {
          this.text_focusState = false;
        }
      }
    },
  }
</script>

<style scoped>
  .app-top-left {
    position: absolute;
    left: 30px;
    top: 25px;
    min-width: 450px;
  }

  .search-input {
    float: left;
    width: 300px;
    border: none;
    border-left: 10px solid transparent;
    border-right: 27px solid transparent;
    height: 38px;
    line-height: 38px;
    outline: none;
    color: #666;
    font-size: 13px;
  }

  .search-box {
    height: 38px;
    background-color: #fff;
    border-right: none;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .search-box > .fl {
    float: left;
  }

  .search-box span.icon_route, .search-box span.icon_clear {
    float: left;
    width: 35px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #fff;
    margin-top: 6px;
    border-left: 1px solid #eee;
    cursor: pointer;
  }

  .search-box span.icon_route {
    background-image: url("../../static/images/luxian.png");
  }

  .search-box span.icon_clear {
    background-image: url("../../static/images/close.png");
  }

  .position-box span.icon_clear {
    position: absolute;
    right: 1px;
  }

  .position-box {
    min-height: 130px;
  }

  .search-box > div.icon_search {
    width: 50px;
    height: 39px;
    background: #39f url("../../static/images/sousuo.png") no-repeat center;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    cursor: pointer;
  }

  ::-webkit-input-placeholder {
    font-size: 13px;
    color: #999;
  }

  .search-box > .content {
    position: relative;
  }

  .inner-box {
    background-color: #fff;
    position: absolute;
    left: 0;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 3px;
  }

  .search-suggest-box {
    top: 38px;
  }

  .suggest-bottom, .history-list {
    border-top: 1px solid #eee;
  }

  .suggest-top {
    padding-top: 15px;
  }

  .suggest-bottom {
    text-align: right;
    padding: 6px 10px;
  }

  .suggest-bottom > span {
    color: #b3b3b3;
    cursor: pointer;
  }

  .suggest-bottom > span:hover {
    color: #666;
  }

  .history-list {
  }

  .history-list > li {
    height: 32px;
    line-height: 32px;
    text-indent: 10px;
    border-bottom: 1px dotted #f5f5f5;
    cursor: pointer;
    /*padding-left: 35px;
    background: url("../../static/images/suggestion-icon.png") no-repeat 0 1px;*/
    transition: all ease .5s;
  }

  i.icon-history {
    display: inline-block;
    width: 20px;
    height: 14px;
    background: url("../../static/images/suggestion-icon.png") no-repeat 0 1px;
    vertical-align: middle;
  }

  .history-list > li:last-child {
    border-bottom: none;
  }

  .history-list > li:hover {
    background-color: #f5f5f5;
    transition: all ease .5s;
  }

  .list1, .list2 {
    text-align: center;
    width: 100%;
  }

  .list1 > li {
    width: 33.3%;
  }

  .list1 > li > span {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    padding-left: 32px;
    cursor: pointer;
  }

  .list1 span.item1 {
    background: url("../../static/images/list.png") 0 -48px / auto 72px no-repeat;
  }

  .list1 span.item2 {
    background: url("../../static/images/list.png") 0 -24px / auto 72px no-repeat;
  }

  .list1 span.item3 {
    background: url("../../static/images/list.png") 0 0 / auto 72px no-repeat;
  }

  .list2 {
    margin: 10px 0;
  }

  .list2 > li {
    box-sizing: border-box;
    width: 25%;
    border-right: 1px dotted #eee;
  }

  .list2 > li:nth-child(4) {
    border-right: none;
  }

  .list2 > li > span {
    cursor: pointer;
  }

  /*搜索结果*/
  .search-list-box.normal {
    top: 50px;
  }

  .search-list-box.top {
    top: 140px;
  }

  /*标注与收藏*/
  /*收藏夹*/
  .card-list {
    top: 50px;
    width: 100%;
    height: 625px;
    background-color: #fff;
  }

  .close-icon {
    position: absolute;
    top: 8px;
    right: 10px;
    width: 22px;
    height: 22px;
    cursor: pointer;
    background: url("../../static/images/close_btn.png") no-repeat center;
  }

  .close-icon:hover {
    background-image: url("../../static/images/close_hover.png");
  }

  .card-tab {
    width: 324px;
    height: 40px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #3385ff;
    line-height: 40px;
  }

  .card-tab > span {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 160px;
    text-align: center;
    cursor: pointer;
  }

  .card-tab > span.active {
    color: #3385ff;
  }

  span.active .active-tip {
    width: 14px;
    height: 14px;
    position: absolute;
    bottom: -1px;
    left: 90px;
    background: url("../../static/images/active-tip.png") no-repeat center;
  }

  .card-tab > span > span {
    vertical-align: middle;
  }

  .card-icon {
    display: inline-block;
    vertical-align: top;
    width: 36px;
    height: 36px;
    background-repeat: no-repeat;
    background-position: center;
  }

  .card-icon.marker {
    background-image: url("../../static/images/marker_icon.png");
  }

  .card-icon.collect {
    background-image: url("../../static/images/collect_icon.png");
  }

  .active .card-icon.marker {
    background-image: url("../../static/images/marker_icon_hover.png");
  }

  .active .card-icon.collect {
    background-image: url("../../static/images/collect_icon_hover.png");
  }

  .poi-list {
    padding: 10px 0;
    height: 500px;
  }


  .del-icon {
    position: absolute;
    top: 5px;
    right: 20px;
    width: 20px;
    height: 44px;
    background: url("../../static/images/del-icon.png") no-repeat center;
    cursor: pointer;
  }

  .del-icon:hover {
    background-image: url("../../static/images/del_hover.png");
    transition: all .2s ease;
  }

  ul.marker-list li, ul.collect-list li {
    position: relative;
    display: block;
    padding-right: 50px;
    border-bottom: 1px solid #f2f2f2;
  }

  ul.marker-list li dl, ul.collect-list li dl {
    min-height: 44px;
    height: 100%;
    line-height: 22px;
    padding: 5px 10px 5px 40px;
    cursor: pointer;
    color: #333;
    /*background: url("../../static/images/didian2.png") no-repeat left 6px;*/
    background-repeat: no-repeat;
    background-position: 12px 6px;
  }

  ul.marker-list li.point_icon dl {
    background-image: url("../../static/images/p_icon.png");
  }

  ul.marker-list li.line_icon dl {
    background-image: url("../../static/images/l_icon.png");
  }

  ul.marker-list li.polygon_icon dl {
    background-image: url("../../static/images/m_icon.png");
  }

  ul.marker-list li.point_icon:hover dl {
    background-image: url("../../static/images/p_icon_hover.png");
  }

  ul.marker-list li.line_icon:hover dl {
    background-image: url("../../static/images/l_icon_hover.png");
  }

  ul.marker-list li.polygon_icon:hover dl {
    background-image: url("../../static/images/m_icon_hover.png");
  }

  .collect-list li:hover, ul.marker-list li:hover {
    background-color: #f6f6f6;
  }

  .collect-list li dl {
    background-image: url("../../static/images/shoucang.png");
  }

  .collect-list li:hover dl {
    background-image: url("../../static/images/shoucang_hover.png");
  }

  .poi-List li:hover {
    background-color: #f6f6f6;
    background-image: url("../../static/images/pos-icon-hover.png");
  }

  .poi-List li {
    background: url("../../static/images/pos-icon.png") no-repeat 5px 5px;
    display: block;
    padding-left: 45px;
    padding-top: 0px;
    cursor: pointer;
    border-bottom: 1px solid #f2f2f2;
  }

  .poi-List li .adress_dd {
    min-height: 10px;
  }

  .poi-List li > dl {
    line-height: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    /*font-size: 14px;*/
  }

  .poi-List li dt {
    font-size: 13px;
    color: #3385ff;
  }

  .marker-list li dt, .collect-list li dt {
    font-size: 13px;
    color: #333;
  }

  .marker-list li dt > span {
    color: #777;
  }

  .marker-list li dd {

  }

  .pos-box {
    width: calc(100% - 36px);
  }

  .pos-list {
    height: 36px;
    width: 100%;
    border-bottom: 1px solid #4187ff;
    position: relative;
  }

  .pos-list > li {
    width: 25%;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    font-size: 13px;
  }

  .pos-list > li > span {
    padding: 1px 0 1px 18px;
    background-repeat: no-repeat;
    background-position: left center;
    background-image: url("../../static/images/route-icon_2c25ce2.png");
  }

  .pos-list .drive.active span {
    color: #3f85ff;
    background-position: 0 -83px;
  }

  .pos-list .drive span {
    background-position: 0 -67px;
  }

  .pos-list .bus span {
    background-position: 0 -34px;
  }

  .pos-list .walk span {
    background-position: 0 -100px;
  }

  .pos-list .bike span {
    padding-left: 20px;
    background-position: 0 -138px;
  }

  .cur-tip {
    position: absolute;
    bottom: -2px;
    left: 30px;
    width: 14px;
    height: 8px;
    background: url("../../static/images/top_tip.png") no-repeat center;
  }

  .pos-box > .box {
    height: 80px;
  }

  .toggle-pos, .pos-text {
    float: left;
  }

  .box > .toggle-pos {
    width: 40px;
    height: 40px;
    margin-top: 22px;
    background: url("../../static/images/revert_icon.png") no-repeat center;
    cursor: pointer;
  }

  .box > .pos-text {
    position: relative;
    width: calc(100% - 40px);
  }

  .pos-text > .input-item {
    width: calc(100% - 40px);
    height: 30px;
    padding: 5px 10px 5px 30px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    outline: 0;
    background-repeat: no-repeat;
    background-position: 10px center;
  }

  .start-icon {
    border-style: none none solid none;
    border-color: #ccc;
    border-width: 1px;
    background-image: url("../../static/images/qidian.png");
  }

  .end-icon {
    border: none;
    background-image: url("../../static/images/zhongdian.png");
  }

  .pos-text > .clear {
    position: absolute;
    right: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url("../../static/images/delIcon.png");
  }

  .pos-text > .clear-start {
    top: 10px;
  }

  .pos-text > .clear-end {
    top: 50px;
  }

  .poi-list li {
    background: url("../../static/images/pos-icon.png") no-repeat 5px 5px;
    display: block;
    padding-left: 45px;
    padding-top: 0px;
    cursor: pointer;
    border-bottom: 1px solid #f2f2f2;
    transition: all ease .2s;
  }

  .poi-list li:hover {
    background-color: #f6f6f6;
    background-image: url("../../static/images/pos-icon-hover.png");
    transition: all ease .2s;
  }

  .poi-list li .adress_dd {
    min-height: 10px;
  }

  .poi-list li > dl {
    line-height: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    /*font-size: 14px;*/
  }

  .poi-list li dt {
    font-size: 13px;
    color: #3385ff;
  }

  /*列表分页样式*/
  .pagenation {
    margin-top: 5px;
  }

  .pagenation > li {
    float: left;
    height: 20px;
    margin: 0 5px;
  }

  .pagenation > li > div > span {
    margin-left: 5px;
  }

  .page_input {
    width: 25px;
    padding: 0 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 20px;
  }

  .page_ctrl > span {
    display: block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
  }

  .page_ctrl > span.pre_icon {
    background-image: url("../../static/images/pre_icon.png");
  }

  .page_ctrl > span.next_icon {
    background-image: url("../../static/images/next_icon.png");
  }

  .page_ctrl > span.pre_icon.normal:hover {
    background-image: url("../../static/images/pre_icon_hover.png");
  }

  .page_ctrl > span.next_icon.normal:hover {
    background-image: url("../../static/images/next_icon_hover.png");
  }

  .page_ctrl > .normal {
    cursor: pointer;
  }

  .page_ctrl > .disabled {
    cursor: not-allowed;
  }

  .inner-box.poi-box {
    top: 45px;
    width: 368px;
    background: #fff;
    border: 1px solid #3385ff;
  }

  .choose-start-end {
    /*position: absolute;
    !* top: 60px; *!
  top: 45px;
    pointer-events: auto;
    z-index: 8;*/
  }

  .choose-start-end-header {
    width: 348px;
    height: 80px;
    /* font-size: 16px; */
    padding: 10px;
    background: #3385ff;
    color: #ffffff;
  }

  .choose-start-end-name {
    float: left;
    width: 63%;
  }

  .startEnd {
    float: right;
    width: 37%;
    margin-top: 4px;
  }

  .startEnd-start, .startEnd-end {
    cursor: pointer;
    text-align: center;
    height: 29px;
    margin: 0 10px 0 15px;
    border: 1px solid rgb(133, 182, 255);
    border-radius: 4px;
  }

  .startEnd-end {
    margin-top: 10px;
  }

  .choose-point {
    margin-left: 15px;
  }

  .icon-start {
    width: 13px;
    height: 20px;
    left: 5px;
    top: 5px;
    display: inline-block;
    position: relative;
    /*color:yellow;*/
    background-image: url("../../static/images/detail-general-info_7a530db.png");
    background-position: -14px -354px;
  }

  .icon-end {
    width: 13px;
    height: 20px;
    left: 9px;
    top: 5px;
    display: inline-block;
    position: relative;
    background: url("../../static/images/detail-general-info_7a530db.png");
    background-position: -42px -354px;
  }

  .startEnd-start:hover, .startEnd-end:hover {
    background: #ffffff;
    color: #39f;
    border: 1px solid #39f;
    transition: all .3s ease;
  }

  .startEnd-start:hover .icon-start {
    background-position: -27px -354px;
    transition: all .3s ease;
  }

  .startEnd-end:hover .icon-end {
    background-position: -1px -354px;
    transition: all .3s ease;
  }

  .poi-item dl {
    text-indent: 15px;
    line-height: 25px;
    padding: 6px 0;
  }

  .poi-item dl > dt {
    color: #3385ff;
  }

  span.star-icon {
    float: right;
    margin-right: 10px;
    width: 18px;
    height: 18px;
    background: url("../../static/images/collect_icon.png") no-repeat center;
    cursor: pointer;
  }

  span.star-icon:hover {
    background-size: cover;
  }

  span.star-icon.active {
    background-image: url("../../static/images/collect_icon_hover.png");
  }

  .content-box {
    height: 580px;
  }

  .route-box {
    top: 140px;
    min-height: 50px;
  }

  .route-inner {
    width: calc(100% - 20px);
    margin: 10px;
  }

  .planList {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ddd;
  }

  .planList > li {
    width: 33.3%;
    cursor: pointer;
  }

  .planList > li.active {
    background-color: #eee;
  }

  .planList > li > span {
    display: block;
    text-align: center;
    line-height: 28px;
  }

  .plan-box {
    border: 1px solid #ddd;
  }

  .plan-tip {
    padding: 5px;
  }

  .br {
    box-sizing: border-box;
    border-right: 1px solid #ddd;
  }

  .plan-tip > .fl-list li {
    padding: 0 5px;
  }

  .plan-tip > .fl-list li:not(:last-child) {
    border-right: 1px solid #ddd;
  }

  .startIcon, .endIcon {
    display: inline-block;
    width: 20px;
    height: 10px;
    background-repeat: no-repeat;
    background-position: center;
  }

  .startIcon {
    background-image: url("../../static/images/qidian.png");
  }

  .endIcon {
    background-image: url("../../static/images/zhongdian.png");
  }

  .route-content {
    max-height: 420px;
  }

  .route-content > div {
    padding: 10px;
  }

  .route-item:first-child {
    border-top: 1px solid #ddd;
  }

  .route-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  .route-item > span {
    margin-right: 5px;
  }

  .item-li-content {
    vertical-align: text-top;
    display: inline-block;
    width: 290px;
    color: #666;
  }

  .loadingBox {
    min-height: 100px;
    background: url("../../static/images/loading_1.gif") no-repeat center;
  }

  @media screen and (min-width: 1401px) {
    .poi-list {
      height: 500px;
    }
    .content-box {
      height: 580px;
    }
    .route-content{
      max-height: 420px;
    }
  }

  @media screen and (max-width: 1400px) {
    .poi-list {
      height: 400px;
    }
    .content-box {
      height: 500px;
    }
    .route-content{
      max-height: 340px;
    }
    .card-list {
      height: 545px;
    }
  }
</style>
