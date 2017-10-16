/**
 * Created by limei on 2017/10/9.
 */

export const SERVICE_ADDRESS = 'http://minedata.cn/service/'

export const ppmapServiceAddress =  'http://182.254.228.149:18989/ppmapService/service/'    //开发用

export const APP_DOMAIN_ROOT = 'http://minedata.cn'

export const MAP_SOLUTION = 3498;
export const MAP_ACCESS_TOKEN = '62d44474da2a47249fe065a1ac504e55';
export const MAP_STYLE_URL = '3498';

export const STYLE_PRE_URL = SERVICE_ADDRESS + 'solu/style/id/';

/*export const SERVICE_ADDRESS = 'http://10.2.67.33/service/'    //本地部署修改

 let ppmapServiceAddress = 'http://10.2.67.33:9080/ppmapService/service/'          //本地部署修改


 export const APP_DOMAIN_ROOT = 'http://10.2.67.33'  // 本地部署的地址

 export const MAP_SOLUTION = 3614;                                       //本地部署
 export const MAP_ACCESS_TOKEN = 'e5b28c654d784ae3961e38e5e2760e9c';
 export const MAP_STYLE_URL = '3614';

 export const STYLE_PRE_URL = SERVICE_ADDRESS + 'solu/style/id/';
 */

export const CUR_CITY_INFO = {
  "code": "110000",
  "cname": "北京市",
  "ename": "Beijing City",
  "pyname": "Bei Jing Shi",
  "lon": "116.40717",
  "lat": "39.90469"
};

export const MAP_SPRITE_URL = APP_DOMAIN_ROOT + '/minemapapi/v1.3/sprite/sprite';
export const MAP_FONTS_URL = APP_DOMAIN_ROOT + '/minemapapi/v1.3/fonts';

/************************* 地图配置 start***********************************/
export const MAP_CENTER = [116.46, 39.92];
export const MAP_ZOOM = 10;
export const MAP_PITCH = 0;
export const MAP_MIN_ZOOM = 3;
export const MAP_MAX_ZOOM = 17;
/************************* 地图配置 end***********************************/

/*********************** 接口地址配置 start *******************************/
/*POI关键字搜索接口*/
export const GETKEYWORD_DATA_URL = SERVICE_ADDRESS + 'search/keyword';
/*用户登录接口*/
export const GETUSERLOGIN_DATA_URL = ppmapServiceAddress + 'userLogin';
/*用户注册接口*/
export const GETUSERREG_DATA_URL = ppmapServiceAddress + 'insertUser';
/*添加标注接口*/
export const INSERTMARKER_DATA_URL = ppmapServiceAddress + 'insertMarker';
/*添加标注接口*/
export const UPDATEMARKER_DATA_URL = ppmapServiceAddress + 'updateMarker';
/*获取标注接口*/
export const GETMARKER_DATA_URL = ppmapServiceAddress + 'getMarker';
/*删除标注接口*/
export const DELETEMARKER_DATA_URL = ppmapServiceAddress + 'deleteMarker';
/*********************** 接口地址配置 start *******************************/

/*********************** vuex状态设置 start *******************************/
export const UPDATE_CUR_SOLUTION = 'UPDATE_CUR_SOLUTION';    //更新当前配图solution
export const UPDATE_CUR_CITY = 'UPDATE_CUR_CITY';    //更新当前城市信息
export const UPDATE_CUR_TOKEN = 'UPDATE_CUR_TOKEN';    //当前token
/*********************** vuex状态设置 end *******************************/
