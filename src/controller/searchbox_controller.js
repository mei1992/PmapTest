/**
 * Created by limei on 2017/10/9.
 */
import * as globals from '../globals'
class SearchboxController {
  constructor(_view) {
    this._view = _view
  }

  //获取用户id
  getUserId(){
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return user.userId;
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
        console.log(response);
        this._view.markerList = response.data
      });
  }

  //获取poi列表
  getSearchTest(val){
    let curCode = this._view.cur_city.code;
    let curPage = this._view.curPage;
    let curToken = this._view.cur_token;
    let poi_data = {
      "token": curToken,
      "adCode": curCode,
      "searchType": 'poi',
      "key": val,
      "pageNumber": curPage,
      "pageCount": 10,
      "source":3
    };

    /*this._view.$http({
      method:'GET',
      url:globals.GETKEYWORD_DATA_URL,
      data:poi_data,
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      emulateJSON: true
    }).then(function(data){
      console.log(data);
    })
*/
   /* this._view.$http.post(globals.GETKEYWORD_DATA_URL,
      JSON.stringify(poi_data),
      {emulateJSON: true})
      .then((response) => {
        response = response.body;
        console.log(response);
      });*/

    minemap.service.queryPoiSearchResult(curCode, val, curPage, 10, function (error, results) {
      console.log(results);
    });
  }

}

export default SearchboxController
