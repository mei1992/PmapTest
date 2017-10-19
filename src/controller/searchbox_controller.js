/**
 * Created by limei on 2017/10/9.
 */
import * as globals from '../globals'
import eventBridge from '../globals/eventBridge'
class SearchboxController {
  constructor(_view) {
    this._view = _view
  }

  //获取用户id
  getUserId(){
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return user.userId;
    }else{
      return null;
    }
  }

  //获取标注列表
  getMarkerList(type){
    let userId = this.getUserId();
    let saveType = type === "marker" ? 1 : 2;
    let marker_data = {
      "userId": userId,
      "saveType": saveType
    };
    this._view.$http.post(globals.GETMARKER_DATA_URL,
      JSON.stringify(marker_data),
      {emulateJSON: true})
      .then((response) => {
        response = response.body;
        let markerData = response.data;
        if (type === "marker") {
          this._view.markerList = markerData;
        } else {
          this._view.collectionList = markerData;
        }
      });
  }

  //删除marker
  delMarker(marker){
    let saveType = marker.saveType;
    let dataList = saveType===1 ?this._view.markerList:this._view.collectionList;
    this._view.$http.post(globals.DELETEMARKER_DATA_URL,
      JSON.stringify({"markerId": marker.markerId}),
      {emulateJSON: true})
      .then((response) => {
        response = response.body;
        let index = dataList.findIndex((value, index) => {
          return value.markerId === marker.markerId;
        });
        if(saveType===1){
          this._view.markerList.splice(index, 1);
        }else{
          this._view.collectionList.splice(index, 1);
        }
      });
  }
  //修改标注信息
  updateMarker(userId, markerId, markerType, markerGeom, markerName, markerContent){
    let marker_data = {
      "markerName": markerName,
      "markerContent": markerContent,
      "userId": userId,
      'markerId': markerId,
      "markerGeom": JSON.stringify(markerGeom),
      "markerType": markerType,
      "saveType": 1
    };

    this._view.$http.post(globals.UPDATEMARKER_DATA_URL,
      JSON.stringify(marker_data),
      {emulateJSON: true})
      .then((response) => {
        response = response.body;
        this._view.markerList = response.data
      });
  }

  //获取poi列表
  getSearchTest(val,page){
    var _this = this;
    let curCode = _this._view.cur_city.code;
    let curToken = _this._view.cur_token;
    let poiData = null;
    let poiList = null;
    /*let poi_data = {
      "token": curToken,
      "adCode": curCode,
      "searchType": 'poi',
      "key": val,
      "pageNumber": page,
      "pageCount": 10,
      "source":3
    };

    this._view.$http.post(globals.GETKEYWORD_DATA_URL,
     JSON.stringify(poi_data),
     {emulateJSON: true})
     .then((response) => {
     response = response.body;
     console.log(response);
     });*/

    minemap.service.queryPoiSearchResult(curCode, val, page, 10, function (error, results) {
      poiData = results.data;
      poiList = results.data.rows;
      _this._view.poiList = poiList;
      _this._view.pageCount = Math.ceil(poiData.totalCount / 10);

      eventBridge.$emit("poiMarker",poiList);
    });
  }

  //添加到收藏
  addToCollection(){
    let poiItem = this._view.cur_poi;
    if (localStorage && localStorage.getItem("user")) {
      if (this._view.is_collected) {
        return;
      } else {
        let geometry = poiItem.geom;
        let name = poiItem.name;
        let addr = poiItem.address;
        let userId = this.getUserId();
        let tempData = {
          "markerName": name,
          "markerContent": addr,
          "userId": userId,
          "markerGeom": JSON.stringify(geometry),
          "markerType": 1,
          "saveType": 2
        };
        this._view.$http.post(globals.INSERTMARKER_DATA_URL,
          JSON.stringify(tempData),
          {emulateJSON: true})
          .then((response) => {
            this._view.is_collected = true;
          });
      }
    } else {
      this._view.$emit('loginShow', true);
    }
  }

  getActionClassName(action) {
    let a = parseInt(action || '0')
    switch (a) {
      case 1:
        return 'iconfont icon-pxtubiao_turn-left'
      case 2:
        return 'iconfont icon-turn-righ'
      case 3:
        return 'iconfont icon-turn-front-left'
      case 4:
        return 'iconfont icon-turn-front-righ'
      case 5:
        return 'iconfont icon-turn-front-left'
      case 6:
        return 'iconfont icon-turn-front-righ'
      case 7:
        return 'iconfont icon-turn-hard-left'
      case 8:
        return 'iconfont icon-turn-hard-right'
      case 9:
        return 'iconfont icon-U-turn-left'
      case 10:
        return 'iconfont icon-U-turn-right'
      case 11:
        return 'iconfont icon-changes-of-lane'
      case 13:
        return 'iconfont icon-ahead'
      case 16:
        return 'iconfont icon-enter-roundabout'
      case 17:
        return 'iconfont icon-roundabout-exit'
    }
    return 'iconfont icon-no-action'
  }

  getActionName(action) {
    let a = parseInt(action || '0')
    switch (a) {
      case 1:
        return '左转'
      case 2:
        return '右转'
      case 3:
        return '靠左'
      case 4:
        return '靠右'
      case 5:
        return '偏左转'
      case 6:
        return '偏右转'
      case 7:
        return '左后转'
      case 8:
        return '右后转'
      case 9:
        return '左转掉头'
      case 10:
        return '右转掉头'
      case 11:
        return '并线'
      case 13:
        return '直行'
      case 16:
        return '进入环岛'
      case 17:
        return '退出环岛'
    }
    return '无动作'
  }

}

export default SearchboxController
