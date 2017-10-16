<template>
  <div class="app-top-left">
    <div class="search-container">
      <div class="search-box clearfix">
        <div class="content fl clearfix shadow-border">
          <input type="text" class="search-input big-font" placeholder="搜地点、找路线" v-model.trim="searchText"
                 v-on:focus="suggestFocus" v-on:blur="suggestBlur">
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
            <ul class="history-list">
              <li><i class="icon-history"></i><span>历史记录1</span></li>
              <li><i class="icon-history"></i><span>历史记录2</span></li>
            </ul>
            <div class="suggest-bottom">
              <span>删除历史记录</span>
            </div>

          </div>

          <div class="inner-box search-list-box shadow-border" v-if="poiList.length>0">
            <ul>
              <li v-for="item in poiList"></li>
            </ul>
          </div>

          <div class="inner-box card-list" v-if="this.show_marker">
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

          <div class="inner-box position-box" v-if="positionShow">
            <span class="icon_clear" title="关闭" @click="closePosition"></span>
            <div class="pos-box">
              <ul class="pos-list fl-list clearfix">
                <i class="active-tip"></i>
                <li class="drive active"><span>驾车</span></li>
                <li class="bus"><span>公交</span></li>
                <li class="walk"><span>步行</span></li>
                <li class="bike"><span>骑行</span></li>
              </ul>
              <div class="box clearfix">
                <i class="toggle-pos"></i>
                <div class="pos-text">
                  <input type="text" class="input-item start-icon" v-model="startText" placeholder="输入起点或在图区选点">
                  <input type="text" class="input-item end-icon" v-model="endText" placeholder="输入起点或在图区选点">
                  <i class="clear clear-start" v-if="startText" @click="clearStart"></i>
                  <i class="clear clear-end" v-if="endText" @click="clearEnd"></i>
                </div>
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
        positionShow:false,
        poiList:[],       //poi列表
        curPage:1,
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
      });
    },
    computed: {
      ...mapGetters(['cur_city','cur_token']),
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
        this.suggestShow = true;
      },
      suggestBlur(){
        this.suggestShow = false;
      },

      //input文本搜索
      searchResponse(){
        let searchText = this.searchText;
        /*this.hot_areas.map((item) => {
         if(item.cname.indexOf(searchText) === -1){
         return;
         }else{
         console.log(item);
         }
         })*/
      },
      addSearchTest($event){
        let text = $event.target.innerText;
        this.searchText = text;
        //$event.preventDefault();
        console.log(text);
      },
      routeResponse(){
        this.positionShow = true;
      },
      clearText(){
        this.searchText = "";
      },
      closePosition(){
        this.positionShow = false;
      },
      clearStart(){
        this.startText = "";
      },
      clearEnd(){
        this.endText = "";
      },
    },
    watch:{
      searchText(newVal,oldVal){
          if(newVal){
            this.controller.getSearchTest(newVal);
          }
      }
    }
  }
</script>

<style scoped>
  .app-top-left {
    position: absolute;
    left: 30px;
    top: 30px;
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
    /*border: 1px solid #e3e3e3;*/
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
  .search-list-box {
    top: 50px;
  }

  /*标注与收藏*/
  /*收藏夹*/
  .card-list {
    top: 50px;
    width: 368px;
    height: 625px;
    background-color: #fff;
  }

  .close-icon {
    position: absolute;
    top: 8px;
    right: 10px;
    width: 22px;
    height: 22px;
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

  .content-box, #ui3-search-scroll .ui3-search-content.poi-list {
    padding: 10px 0;
    height: 560px;
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

  .active-tip {
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
    background-image: url("../../static/images/del-icon.png");
  }

  .pos-text > .clear-start {
    top: 10px;
  }

  .pos-text > .clear-end {
    top: 50px;
  }
</style>
