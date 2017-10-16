<template>
  <div id="location-box" class="location-box shadow-border">
    <div class="citypopup_main">
      <div class="title">
        <span>当前城市: </span><span>{{cur_city.cname}}</span>
        <i class="close_btn" @click="closeLocation"></i>
      </div>
      <div class="content" style="height: 369px; overflow: hidden;">
        <div class="sel_city blueC">
          <div id="selCityTop" style="_width:100%;">
            <!--<div class="sel_city_default" id="set_default_city" style="display: block;">
              <p class="default_info" id="DefCityInfo" style="display:none;">您默认的城市是：<a href="javascript:void(0);"
                                                                                        >{{this.cityName}}</a><span>[<a
                href="javascript:void(0);" >删除</a>]</span></p>
            </div>-->
            <div class="sel-city-hotcity" style="display:none;"><a href="javascript:void(0)"
                                                                   class="search_nation">在全国范围内检索</a>
            </div>

            <div id="selCityHotCityId" class="sel-city-hotcity">
              <a href="javascript:void(0)" v-for="(hotCity, index ) in hotAreas"
                 :class="{'active': index == 0}"
                 :citycode="hotCity.code"
                 :name="hotCity.cname"
                 @click.stop="selectArea(hotCity)"
                 v-text="hotCity.cname"
                 style="margin-right:5px;*margin-right:1px;float: left;"
              ></a>
            </div>

            <div class="sel-city-searchbar">
              <div class="btnbar">
                <span href="javascript:void(0)" tid="selCityProvince" id="selCityProvince" class="sel-city-btnl"
                      :class="{'sel-city-btnl-sel': !sortByStart}" @click="switchSortType('provence')">按省份</span>
                <span href="javascript:void(0)" tid="selCityCity" id="selCityCity" class="sel-city-btnr"
                      :class="{'sel-city-btnl-sel': sortByStart}"
                      @click="switchSortType('city')">按城市</span>
              </div>
              <form id="selectCity">
                <input type="text"
                       tid="selCitySearchInput"
                       class="sel-city-searchinput"
                       id="selCityCityWd"
                       name="wd" value="输入城市名"
                       autocomplete="off"
                       @focus="clearSearch"
                       v-model="searchKeyWorld"
                       @keyup.enter="doSearch"
                >
                <span tid="selCitySubmit" id="selCitySubmit" class="sel-city-btn-submit"
                      @click="doSearch">搜索</span>
                <div class="searchScore" v-if="searchScores.length">
                  <div class="searchedArea" v-for="searchArea in searchScores"><a
                    href="javascript:void (0);"
                    v-text="searchArea.cname"
                    @click.stop="selectArea(searchArea)"></a>
                  </div>
                </div>
                <div id="selCityInfo" class="sel-city-tip" style="display: none;">请输入正确的城市名</div>
              </form>
            </div>
            <div id="selCityLetterListId" class="sel-city-letterbar hidden">
              <a href="javascript:void(0)">A</a>
              <a href="javascript:void(0)">F</a>
              <a href="javascript:void(0)">G</a>
              <a href="javascript:void(0)">H</a>
              <a href="javascript:void(0)">J</a>
              <a href="javascript:void(0)">L</a>
              <a href="javascript:void(0)">N</a>
              <a href="javascript:void(0)">Q</a>
              <a href="javascript:void(0)">S</a>
              <a href="javascript:void(0)">T</a>
              <a href="javascript:void(0)">X</a>
              <a href="javascript:void(0)">Y</a>
              <a href="javascript:void(0)">Z</a>
            </div>
            <div style="border-top:1px solid #CCC;padding-bottom:10px;"></div>
          </div>
          <div id="selCityPlaceListId" class="selCityPlaceList"
               style="width: 100%; height: 180px; padding-bottom: 24px">
            <table style="border-collapse:collapse;border-spacing:0;" cellpadding="0" cellspacing="0">
              <tbody>


              <tr v-if="sortByStart" v-for="(provence, index) in areasByStartWorld">
                <!--<td class="sel-city-td-letter">
                  <div ></div>
                </td>-->

                <td class="sel-city-td-sf index-td"><a href="javascript:void(0)" v-text="index"
                                                       :id="index"></a></td>
                <td class="sel-city-td-item">

                  <a href="javascript:void(0)" v-for="(city, index) in provence"
                     :cityCode="city.code"
                     :name="city.cname"
                     @click="selectArea(city)"
                     v-text="city.cname"></a>

                </td>
              </tr>


              <tr v-else v-for="(provence, index) in fullAreas">
                <!--<td class="sel-city-td-letter">
                  <div v-text="provence.cname"></div>
                </td>-->

                <td class="sel-city-td-sf"><a href="javascript:void(0)"
                                              :cityCode="provence.code"
                                              :name="provence.code"
                                              @click="selectArea(provence)"
                                              v-text="provence.cname"
                ></a></td>
                <td class="sel-city-td-item">

                  <a href="javascript:void(0)" v-for="(city, index) in provence.list"
                     :cityCode="city.code"
                     :name="city.cname"
                     @click="selectArea(city)"
                     v-text="city.cname"></a>

                </td>
              </tr>

              <tr>
                <td colspan="3">
                  <div class="sel-city-tr-splitline">&nbsp;</div>
                </td>
              </tr>
              <tr>
                <!-- <td>
                   <div style="visibility:hidden;">other</div>
                 </td>-->
                <td class="sel-city-td-other"><span>&nbsp;</span></td>
                <td><a href="javascript:void(0)">&nbsp;</a><a href="javascript:void(0)">&nbsp;</a></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex'
  import * as globals from '../globals'
  import eventBridge from '../globals/eventBridge'
  import * as fullAreas from '../globals/china_admin_city.json';

  export default {
    name: 'PMMapLocation',
    data () {
      return {
        fullAreas: null,
        hotAreas: [],
        areasByStartWorld: [], // 按首字母排序后的城市列表
        sortByStart: false, // 展示方式 true：按城市
        searchScores: [], // 搜索结果
        searchKeyWorld: '', // 搜索关键词
        cityName: "北京市",//城市名字
      }
    },
    computed: {
      ...mapGetters(['cur_city'])
    },
    methods: {
      ...mapActions(['updateCurCity']),
      closeLocation(){
        eventBridge.$emit('closeLocation');
      },
      // 获取城市列表
      getFullCities: function () {
        //@Todo 此处数据应从服务器获取到，奈何链接不支持跨域请求，故先行将数据存储到本地，连调时需要做调整
        this.fullAreas = fullAreas.data;
        if (this.fullAreas && this.fullAreas[0] && this.fullAreas[0].list) {
          this.hotAreas = this.fullAreas[0].list;
        }
      },
      // 选中城市
      selectArea: function (item) {
        // @Todo 在这里调用地图API，显示对应地区的地图
        //console.log('@Todo will select area by code : ', areaCode);
        let lat = item.lat * 1;
        let lon = item.lon * 1;
        let arr = [lon, lat];
        this.cityName = item.cname;

        eventBridge.$emit('changeCity', this.cityName);
        this.updateCurCity(item);
        if (this.cityName === "全国") {
          eventBridge.$emit('setZoom', globals.MAP_MIN_ZOOM, arr);
        } else {
          eventBridge.$emit('setZoom', globals.MAP_ZOOM, arr);
        }
        //eventBridge.$emit('setCenter', arr);
        this.searchKeyWorld = '';
        this.searchScores = [];
      },
      //按首字母排序
      sortAreasByFirstWord: function () {
        if (this.fullAreas) {
          let allAreas = this.fullAreas;
          let areasStartByA = [];
          let areasStartByB = [];
          let areasStartByC = [];
          let areasStartByD = [];
          let areasStartByE = [];
          let areasStartByF = [];
          let areasStartByG = [];
          let areasStartByH = [];
          let areasStartByI = [];
          let areasStartByJ = [];
          let areasStartByK = [];
          let areasStartByL = [];
          let areasStartByM = [];
          let areasStartByN = [];
          let areasStartByO = [];
          let areasStartByP = [];
          let areasStartByQ = [];
          let areasStartByR = [];
          let areasStartByS = [];
          let areasStartByT = [];
          let areasStartByU = [];
          let areasStartByV = [];
          let areasStartByW = [];
          let areasStartByX = [];
          let areasStartByY = [];
          let areasStartByZ = [];
          for (var i = 0; i < allAreas.length; i++) {
            let provence = allAreas[i];
            if (provence && provence.list && provence.list.length) {
              let cities = provence.list;
              for (var j = 0; j < cities.length; j++) {
                let area = cities[j];
                let areaPyname = area.pyname;
                let areaPynameFirstWord = areaPyname.substr(0, 1);
                switch (areaPynameFirstWord) {
                  case 'A':
                    areasStartByA.push(area);
                    break;
                  case 'B':
                    areasStartByB.push(area);
                    break;
                  case 'C':
                    areasStartByC.push(area);
                    break;

                  case 'D':
                    areasStartByD.push(area);
                    break;

                  case 'E':
                    areasStartByE.push(area);
                    break;

                  case 'F':
                    areasStartByF.push(area);
                    break;

                  case 'G':
                    areasStartByG.push(area);
                    break;

                  case 'H':
                    areasStartByH.push(area);
                    break;

                  case 'I':
                    areasStartByI.push(area);
                    break;

                  case 'J':
                    areasStartByJ.push(area);
                    break;

                  case 'K':
                    areasStartByK.push(area);
                    break;

                  case 'L':
                    areasStartByL.push(area);
                    break;

                  case 'M':
                    areasStartByM.push(area);
                    break;

                  case 'N':
                    areasStartByN.push(area);
                    break;

                  case 'O':
                    areasStartByO.push(area);
                    break;

                  case 'P':
                    areasStartByP.push(area);
                    break;

                  case 'Q':
                    areasStartByQ.push(area);
                    break;

                  case 'R':
                    areasStartByR.push(area);
                    break;

                  case 'S':
                    areasStartByS.push(area);
                    break;

                  case 'T':
                    areasStartByT.push(area);
                    break;

                  case 'U':
                    areasStartByU.push(area);
                    break;

                  case 'V':
                    areasStartByV.push(area);
                    break;

                  case 'W':
                    areasStartByW.push(area);
                    break;

                  case 'X':
                    areasStartByX.push(area);
                    break;

                  case 'Y':
                    areasStartByY.push(area);
                    break;

                  case 'Z':
                    areasStartByZ.push(area);
                    break;

                }

              }
            }
          }

          let areasByStartWorld = {};
          areasByStartWorld.A = areasStartByA;
          areasByStartWorld.B = areasStartByB;
          areasByStartWorld.C = areasStartByC;
          areasByStartWorld.D = areasStartByD;
          areasByStartWorld.E = areasStartByE;
          areasByStartWorld.F = areasStartByF;
          areasByStartWorld.G = areasStartByG;
          areasByStartWorld.H = areasStartByH;
          areasByStartWorld.I = areasStartByI;
          areasByStartWorld.J = areasStartByJ;
          areasByStartWorld.K = areasStartByK;
          areasByStartWorld.L = areasStartByL;
          areasByStartWorld.M = areasStartByM;
          areasByStartWorld.N = areasStartByN;
          areasByStartWorld.O = areasStartByO;
          areasByStartWorld.P = areasStartByP;
          areasByStartWorld.Q = areasStartByQ;
          areasByStartWorld.R = areasStartByR;
          areasByStartWorld.S = areasStartByS;
          areasByStartWorld.T = areasStartByT;
          areasByStartWorld.U = areasStartByU;
          areasByStartWorld.V = areasStartByV;
          areasByStartWorld.W = areasStartByW;
          areasByStartWorld.X = areasStartByX;
          areasByStartWorld.Y = areasStartByY;
          areasByStartWorld.Z = areasStartByZ;

          this.areasByStartWorld = areasByStartWorld;
        }
      },
      //切换排序规则
      switchSortType: function (type) {
        if (type == 'city') {
          this.sortByStart = true;
        } else {
          this.sortByStart = false;
        }
      },
      //搜索
      doSearch: function () {
        console.log('search key world', this.searchKeyWorld);
        if (!this.searchKeyWorld) {
          return false;
        }

        var data = this.fullAreas;
        var keyWorld = this.searchKeyWorld;
        var _this = this;
        for (var i = 0; i < data.length; i++) {
          var provence = data[i];
          //console.log('-----------', provence);
          if (provence && provence.cname) {
            var provenceCname = provence.cname;
            if (provenceCname.indexOf(keyWorld) != -1) {
              _this.searchScores.push(provence);
            }
          }
          if (provence.list) {
            var cities = provence.list;
            for (var j = 0; j < cities.length; j++) {
              var city = cities[j];
              //console.log('========', city);
              if (city && city.cname) {
                var cityCname = city.cname;
                if (cityCname.indexOf(keyWorld) != -1) {
                  _this.searchScores.push(city);
                }
              }
            }
          }
        }
      },
      //清空搜索关键字
      clearSearch: function () {
        this.searchKeyWorld = '';
        this.searchScores = [];
      },

    },
    mounted () {
      this.getFullCities();
      this.sortAreasByFirstWord();
    }
  }

</script>

<style scoped>
  .location-box {
    position: absolute;
    top: 50px;
    right: 0;
    width: 320px;
    min-height: 360px;
    border-radius: 3px;
    background-color: #fff;
  }

  .close_btn {
    position: absolute;
    width: 14px;
    height: 14px;
    top: 8px;
    right: 10px;
    background: url("../../static/images/close_btn.png") no-repeat center;
    background-size: cover;
    cursor: pointer;
  }

  .close_btn:hover {
    background-image: url("../../static/images/close_hover.png");
  }
  .sel-city-hotcity a {
    margin-right: 5px;
  }

  .sel-city-hotcity a.active {
    font-size: 14px;
    font-weight: 500;
    margin-right: 5px
  }

  .hidden {
    display: none;
  }

  .map_popup {
    position: absolute;
    z-index: 50000;
    width: 283px;
    display: block;
    height: 393px;
    top: 40px;
  }

  .citypopup_main {
    z-index: 2;
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, .15);
    padding: 5px;
    border-radius: 6px;
  }

  .poput_shadow {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 4px;
    top: 4px;
    z-index: 1;
    _left: 1px;
    _top: 1px;
    _background: #505050;
    _border: 1px solid #505050;
    _filter: alpha(opacity=20);
    height: 393px;
  }

  .title {
    border-bottom: 1px solid #dadada;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    color: #4c4c4c;
    padding-left: 7px;
  }

  .content {
    height: 369px;
    overflow: hidden;
  }

  button {
    position: absolute;
    z-index: 50;
    top: 10px;
    right: 10px;
    width: 12px;
    height: 12px;
    background: url(http://webmap2.map.bdstatic.com/wolfman/static/common/images/popup_close_15d2283.gif) no-repeat;
    border: 0;
    cursor: pointer;
  }

  .sel_city {
    margin: 7px 5px 5px;
  }

  #selCityPlaceListId {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .sel_city_default {
    display: none;
    border-bottom: 1px solid #CCC;
    padding: 7px 0 13px 5px;
    margin-bottom: 13px;
    line-height: 22px;
  }

  .sel-city-hotcity {
    padding: 0 5px;
    width: 100%;
    height: 48px;
  }

  .sel-city-searchbar {
    height: 24px;
    padding: 5px 6px;
    margin: 10px 0;
  }

  .sel-city-letterbar {
    margin: 0 11px 10px;
  }

  .sel-city-tr-splitline {
    height: 12px;
    visibility: hidden;
  }

  .sel_city a {
    /*white-space: nowrap;*/
    margin-right: 9px;
    line-height: 22px;
  }

  .blueC a {
    color: #3399ff;
    text-decoration: none;
  }

  .blueC a:hover {
    color: #3084E2;
    text-decoration: none;
  }

  a {
    color: #00c;
    text-decoration: underline;
    outline: 0;
    cursor: pointer;
  }

  a, input, select {
    font-size: 12px;
  }

  .sel-city-searchbar .btnbar {
    float: left;
    width: 108px;
    height: 23px;
    background-position: -302px 0;
  }

  .sel-city-searchbar .sel-city-btnl-sel {
    background-position: -302px -24px;
    font-weight: 500;
    background-color: #f0f0f0;
  }

  .sel-city-searchbar .sel-city-btnl {
    border: 1px solid #cbcbcb;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
    border-right-width: 0;
  }

  .sel-city-searchbar .sel-city-btnl, .sel-city-searchbar .sel-city-btnr {
    float: left;
    height: 22px;
    line-height: 23px;
    width: 52px;
    margin-left: 0;
    text-align: center;
    cursor: pointer;
  }

  .sel-city-searchbar .sel-city-btnr {
    border: 1px solid #cbcbcb;
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px;
  }

  .sel-city-searchbar .sel-city-btnl, .sel-city-searchbar .sel-city-btnr {
    float: left;
    height: 22px;
    line-height: 23px;
    width: 52px;
    margin-left: 0;
    text-align: center;
    cursor: pointer;
  }

  .sel-city-searchbar form {
    position: relative;
    float: right;
  }

  .sel_city form {
    margin-bottom: 5px;
  }

  .sel-city-searchinput {
    width: 100px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 22px;
    float: left;
    line-height: 22px;
    text-indent: 4px;
  }

  .sel-city-btn-submit {
    float: left;
    height: 22px;
    line-height: 22px;
    width: 46px;
    cursor: pointer;
    margin-left: 5px;
    text-align: center;
    border: 1px solid #cbcbcb;
    border-radius: 2px;
    background-color: #efefef;
    background: -webkit-linear-gradient(top, #fff, #efefef);
    background: -o-linear-gradient(top, #fff, #efefef);
    background: -moz-linear-gradient(top, #fff, #efefef);
    background: linear-gradient(top, #fff, #efefef);
  }

  .sel-city-searchbar form .sel-city-tip {
    position: absolute;
    top: 26px;
    left: 0;
    height: 20px;
    line-height: 20px;
    width: 121px;
    text-align: center;
    background: #FEFAF1;
    border: 1px solid #E8AA6C;
    color: #AE6B42;
    display: none;
  }

  #selCityPlaceListId {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .selCityPlaceList .sel-city-td-letter {
    padding: 0 14px 0 7px;
  }

  .selCityPlaceList td {
    padding-top: 3px;
  }

  .sel_city td {
    vertical-align: top;
  }

  .sel_city td, .sel_city tr {
    margin: 0;
    padding: 0;
  }

  .sel-city-td-letter div {
    font-size: 24px;
    line-height: 24px;
    font-weight: 500;
    color: #ccc;
    padding: 0;
    margin: 0;
  }

  .sel_city td.sel-city-td-sf {
    display: table-caption;
    width: 60px;
    line-height: 30px;
    padding-right: 10px;
    margin-top: 5px;
  }

  .sel_city td.sel-city-td-sf.index-td {
    width: 40px;
  }

  .sel_city .sel-city-td-sf {
    font-weight: 500;
  }

  .selCityPlaceList td {
    padding-top: 3px;
  }

  .sel_city td {
    vertical-align: top;
  }

  .sel_city td, .sel_city tr {
    margin: 0;
    padding: 0;
  }

  .sel_city .sel-city-td-sf a {
    font-size: 14px;
    margin: 0;
  }

  .selCityPlaceList .sel-city-td-item {
    padding-top: 3px;
  }

  .sel-city-td-item a {
    float: left;
  }

  .sel_city a {
    /*white-space: nowrap;*/
    margin-right: 9px;
    line-height: 24px;
    font-size: 13px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-button {
    height: 0;
    width: 0;
  }

  ::-webkit-scrollbar-thumb {
    background: #ccc;
  }

  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  .searchScore {
    background-color: #fff;
    border: 1px solid #ddd;
    width: 90px;
    padding: 0 5px;
    z-index: 999;
    top: 24px;
    position: absolute;
    height: 200px;
    overflow: auto;
    overflow-x: auto
  }

  .searchedArea {
    text-indent: 5px;
    white-space: nowrap;
    /*overflow: hidden;
    text-overflow: ellipsis;*/
  }

  .searchedArea:hover {
    background-color: #f5f5f5;
  }
</style>
