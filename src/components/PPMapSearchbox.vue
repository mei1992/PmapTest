<template>
  <div class="app-top-left">
    <div class="search-container">
      <div class="search-box clearfix">
        <div class="content fl clearfix shadow-border">
          <input type="text" class="search-input big-font" placeholder="搜地点、找路线">
          <span class="icon_route" title="路线"></span>

          <div class="inner-box search-suggest-box shadow-border hidden">
            <div class="suggest-top">
              <ul class="list1 fl-list clearfix">
                <li><span class="item1">美食</span></li>
                <li><span class="item2">酒店</span></li>
                <li><span class="item3">公交</span></li>
              </ul>
              <ul class="list2 fl-list clearfix">
                <li><span>景点</span></li>
                <li><span>电影院</span></li>
                <li><span>银行</span></li>
                <li><span>KTV</span></li>
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

          <div class="inner-box search-list-box shadow-border hidden">
            <ul>
              <li>1232</li>
            </ul>
          </div>

          <div class="inner-box card-list" v-if="this.show_marker">
            <i class="close-icon"></i>
            <p class="card-tab">
        <span :class="{active:marker_type==='marker'}"><i
          class="card-icon marker"></i><span @click="markerToActive('marker')">我的标注</span><i class="active-tip"></i></span>
              <span :class="{active:marker_type==='collection'}"><i
                class="card-icon collect"></i><span @click="markerToActive('collection')">我的收藏</span><i class="active-tip"></i></span>
            </p>
            <div class="content-box">
              <ul class="marker-list" v-if="marker_type==='marker'">
                <li v-for="(item,index) in markerList"
                    :class="[item.markerType ===1? 'point_icon': item.markerType ===2? 'line_icon':'polygon_icon']">
                  <dl>
                    <dt>{{item.markerName}}</dt>
                    <dd>{{item.markerContent}}</dd>
                  </dl>
                  <span class="del-icon"></span>
                </li>
              </ul>
              <ul class="collect-list" v-if="marker_type!='marker'">
                <li v-for="(item,index) in collectionList">
                  <dl>
                    <dt>{{item.markerName}}</dt>
                    <dd>{{item.markerContent}}</dd>
                  </dl>
                  <span class="del-icon"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="fl icon_search" title="搜索"></div>
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
      });
    },
    methods: {
      //标注与收藏切换
      markerToActive(type){
        eventBridge.$emit('markerType', type);
      },
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

  .search-box span.icon_route {
    float: left;
    width: 35px;
    height: 32px;
    background: #fff url("../../static/images/luxian.png") no-repeat center;
    margin-top: 4px;
    border-left: 1px solid #eee;
  }

  .search-box > div.icon_search {
    width: 50px;
    height: 39px;
    background: #39f url("../../static/images/sousuo.png") no-repeat center;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
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
    height: 650px;
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
    height: 590px;
    overflow-y: auto;
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

  ul.collect-list li {
    position: relative;
    display: block;
    min-height: 44px;
    padding: 5px 10px 5px 40px;
    cursor: pointer;
    color: #333;
    background: url("../../static/images/shoucang.png") no-repeat 15px 6px;
    border-bottom: 1px solid #f2f2f2;
  }

  ul.marker-list li {
    position: relative;
    display: block;
    min-height: 44px;
    padding: 5px 10px 5px 40px;
    cursor: pointer;
    color: #333;
    /*background: url("../../static/images/didian2.png") no-repeat left 6px;*/
    background-repeat: no-repeat;
    background-position: 15px 6px;
    border-bottom: 1px solid #f2f2f2;
  }

  ul.marker-list li.point_icon {
    background-image: url("../../static/images/p_icon.png");
  }

  ul.marker-list li.line_icon {
    background-image: url("../../static/images/l_icon.png");
  }

  ul.marker-list li.polygon_icon {
    background-image: url("../../static/images/m_icon.png");
  }

  ul.marker-list li.point_icon:hover {
    background-image: url("../../static/images/p_icon_hover.png");
  }

  ul.marker-list li.line_icon:hover {
    background-image: url("../../static/images/l_icon_hover.png");
  }

  ul.marker-list li.polygon_icon:hover {
    background-image: url("../../static/images/m_icon_hover.png");
  }

  .collect-list li:hover, ul.marker-list li:hover {
    background-color: #f6f6f6;
  }

  .collect-list li:hover {
    background-image: url("../../static/images/shoucang_hover.png");
  }

  .poi-List li:hover {
    background-color: #f6f6f6;
    background-image: url("../../static/images/pos-icon-hover.png");
  }

  .marker-list li dl, .collect-list li dl {
    height: 100%;
    margin-left: 5px;
    line-height: 22px;
    padding-right: 35px;
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

</style>
