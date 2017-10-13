<template>
  <div class="map_home">
    <div id="map"></div>
    <!--<a href="http://10.2.67.33/index" class="logo_link"></a>-->
    <div class="fix-footer">Copyright @2017 公安部第一研究所，All Rights Reserved. | <a href="http://10.2.67.33/index"
                                                                               title="跳转到开放平台首页">开放平台</a></div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import * as globals from '../globals'
  import eventBridge from '../globals/eventBridge'
  import HomeController from '../controller/home_controller'
  import * as marker_helper from '../utils/marker_helper'
  import * as popup_helper from '../utils/popup_helper'
  export default {
    name: 'PPMapHome',
    data () {
      return {
        map: null,
        trafficShow: true,
        trafficArr: [],    //路况
        meaPopupList: [],  //测距
        meaMarkerList: [],  //测距marker
        activeTool: '',      //激活状态的工具
        userId: '',
        curPopup:null,
        curMarker:null,
      }
    },
    mounted(){
      let _this = this;
      _this.controller = new HomeController(_this);
      _this.$nextTick(() => {
        //初始化地图
        _this.controller.initMapEdit(null, null, null, 'minemap');

        //切换配图方案
        eventBridge.$on('selectedMapStyle', function (item) {
          let wxStyle = {
            "glyphs": "minemap://fonts/{fontstack}/{range}",
            "layers": [{
              "id": "1",
              "maxzoom": 22,
              "source": "",
              "layout": {
                "visibility": "visible"
              },
              "source-layer": "",
              "paint": {
                "background-color": "#F9F5ED"
              },
              "minzoom": 0,
              "type": "background"
            }],
            "sprite": "minemap://sprite/sprite",
            "sources": {},
            "version": 8
          };
          let itemStyle = item.name === "卫星影像" ? wxStyle : globals.STYLE_PRE_URL + item.style;
          let mapType = item.name === "卫星影像" ? 'minemapwmts' : 'minemap';
          if (item.name === "卫星影像") {
            if (_this.map) _this.map.remove();
            _this.controller.initMapEdit(item.token, item.solution, itemStyle, mapType);
            _this.map.on("load", function () {
              _this.map.addSource("ditu", {
                "type": "raster",
                "scheme": "wmts",
                "tileSize": 256,
                //"tiles": ["http://t0.tianditu.com/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&TileMatrix={z}&TileCol={x}&TileRow={y}&Style=default&Format=tiles&Layer=vec&TileMatrixSet=c&Version=1.0.0"]
                "tiles": ["http://10.2.67.33/yx/rest/1.0.0/tile/{z}/{y}/{x}"]
              });
              _this.map.addLayer({
                "id": "ditu",
                "type": "raster",
                "source": "ditu",
                "minzoom": 1,
                "maxzoom": 20,
                "layout": {
                  "visibility": "visible"
                }
              });
              _this.map.setCenter([116.46, 39.92]);
            });
          } else {
            if (_this.cur_solution === '2356') {    //切回普通地图
              if (_this.map) _this.map.remove();
              _this.controller.initMapEdit(item.token, item.solution, itemStyle, mapType);
            } else {
              _this.map.accessToken = item.token;
              _this.map.solution = item.solution;
              _this.map.setStyle(itemStyle);
              if (item.name === "动态交通") {
                _this.map.setCenter([116.35262870035166, 39.94016905322823]);
                _this.map.setZoom(16);
                _this.map.setPitch(60);
                _this.map.setBearing(-32);
              } else {
                _this.map.setCenter([116.46, 39.92]);
                _this.map.setZoom(10);
                _this.map.setPitch(0);
                _this.map.setBearing(0);
              }
            }
          }
          _this.updateCurSolution(item.solution);
          /*_this.updateCurCityName("北京市");
           _this.updateCurCode(110000);*/
        });

        //路况切换
        eventBridge.$on('trafficResponse', function (isShow) {
          _this.trafficShow = isShow;
          if (isShow) {
            _this.controller.showTraffic();
          } else {
            _this.controller.hideTraffic();
          }
        });

        //测距
        eventBridge.$on('measure', function () {
          _this.edit.draw.deleteAll();
          _this.edit.onBtnCtrlActive('line');
          _this.activeTool = 'measure';
          if(_this.curMarker) _this.map.removeMarker(_this.curMarker);
        });

        //画点
        eventBridge.$on('point', function () {
          _this.doEditResponse('point');
        });

        //画线
        eventBridge.$on('line', function () {
          _this.doEditResponse('line');
        });

        //画面
        eventBridge.$on('polygon', function () {
          _this.doEditResponse('polygon');
        });
      })
    },
    computed: {
      ...mapGetters(['cur_solution'])
    },
    methods: {
      ...mapActions(['updateCurSolution']),

      //注册edit绘图完成事件
      regEvent(obj){
        const _this = this;
        obj.on("edit.record.create", function (e) {
          if (_this.activeTool === 'measure') return;
          /*判断是否登录*/
          if (localStorage.getItem("user")) {
            let actionType = e.record.type;
            if (actionType === 3) {    //图形新增
              let type = e.record.features[0].geometry.type;
              let geometry = e.record.features[0].geometry;
              let coordinates = geometry.coordinates;
              let curEditId = e.record.features[0].id;
              let title = '添加标记';
              let inputName = '请输入名称';
              let inputContent = '请输入内容';
              var lngLat = null;
              let markType = null;
              var marker = null;
              switch (type) {
                case "Point":
                  lngLat = coordinates;
                  markType = 1;
                  let pointIcon = marker_helper.createPointMarker();

                  marker = new minemap.Marker(pointIcon, {offset: [-15, -26]})
                    .setLngLat([coordinates[0], coordinates[1]]);
                  _this.map.addMarker(marker);
                  break;
                case "LineString":
                  lngLat = coordinates[coordinates.length - 1];
                  markType = 2;
                  break;
                case 'Polygon':
                  lngLat = coordinates[0][coordinates[0].length - 2];
                  markType = 3;
                  break;
                default:
                  break;
              }

              var popBox = popup_helper.createPopupDom(title, inputName, inputContent, confirmFunc, cancelFunc);

              function confirmFunc() {
                var name = document.getElementById('_marker_name').value;
                var desc = document.getElementById('_marker_desc').value;
                if (name) {
                  popup.remove();
                  _this.controller.addToMarkers(geometry, name, desc, markType);
                } else {
                  alert("请填写标注信息");
                }
              }

              function cancelFunc() {
                popup.remove();
                _this.edit.draw.delete(curEditId);  //取消则删除标注
                if (type = "Point") {
                  _this.map.removeMarker(marker);
                }
              }

              var popup = new minemap.Popup({closeOnClick: false}).setDOMContent(popBox).setLngLat(lngLat).addTo(_this.map);
              _this.curPopup = popup;
              _this.curMarker = marker;
            }
          } else {
            _this.$emit('loginShow', true);
            _this.edit.draw.deleteAll();
          }
        });
        //测距功能
        obj.on("edit.record.create", function (e) {
          if (_this.activeTool !== 'measure') return;

          let lineArr = ['0.00'];
          let geojson = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": []
            }
          };
          let order = 0;
          let linePopups;

          if (e.record.features[0].geometry.type !== 'LineString') return;


          let lineItem = {
            lineId: null,
            pops: [],
            markers: [],
          };

          if (e.record.type === 1) {
            return
          }

          lineItem.lineId = e.record.features[0].id;

          ++order;
          let coordinat = e.record.features[0].geometry.coordinates;

          let item = e.record.features[0];

          for (var i = 0; i < coordinat.length - 1; i++) {
            geojson.geometry.coordinates = coordinat.slice(0, i + 2);
            lineArr.push(turf.lineDistance(geojson, 'kilometers').toFixed(2));
          }
          for (var j = 0; j < lineArr.length; j++) {
            linePopups = new minemap.Popup({closeOnClick: false, closeButton: false})
              .setLngLat(coordinat[j])
              .setHTML("<h3>" + lineArr[j] + "km</h3>")
              .addTo(_this.map);
            lineItem.pops.push(linePopups);
          }
          let closeBox = marker_helper.createMeasureMarker();

          let marker = new minemap.Marker(closeBox, {offset: [5, 5]})
            .setLngLat(coordinat[lineArr.length - 1])
            .addTo(_this.map);
          lineItem.markers.push(marker);

          closeBox.onclick = function () {
            _this.clearMea(lineItem);
          };

//        var innerHTML = '<div class="c1">'
//          + '<div class="f1">测量：<span>' + order + '</span></div>'
//          + '<div class="f1">总长度：<span>' + lineArr[lineArr.length - 1] + 'km</span></div>'
//        // +'<div class="f1">标注描述：<span>hhh哈哈或或或或或或或或</span></div></div>';
//        $('.allLength').append(innerHTML)

          lineArr = ['0.00'];

          _this.meaPopupList.push(lineItem);
        });

      },

      //点线面操作
      doEditResponse(type){
        this.edit.draw.deleteAll();
        this.clearAllMea();         //清除测距
        this.edit.onBtnCtrlActive(type);
        this.activeTool = type;
        if(this.curPopup) this.curPopup.remove();
        if(this.curMarker) this.map.removeMarker(this.curMarker);
      },

      //清除当前测距线内容
      clearMea(lineItem){
        let _this = this;
        edit.draw.delete(lineItem.lineId);
        lineItem.pops.map(function (pop) {
          pop.remove();
        });
        lineItem.markers.map((marker) => {
          _this.map.removeMarker(marker);
        })
      },
      //清除所有测距线内容
      clearAllMea(){
        let _this = this;
        _this.meaPopupList.map(function (item) {
          edit.draw.delete(item.lineId);
          item.pops.map(function (pop) {
            pop.remove();
          });
          item.markers.map((marker) => {
            _this.map.removeMarker(marker);
          })
        });
        _this.meaPopupList = [];
      }

    }
  }
</script>

<style scoped>
  .map_home, #map {
    height: 100%;
  }

  .fix-footer {
    position: absolute;
    left: 20px;
    bottom: 6px;
  }

</style>
