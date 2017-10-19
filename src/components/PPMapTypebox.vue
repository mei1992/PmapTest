<template>
  <div id="mapType-wrapper">
    <div class="mapType-big">
      <div :class="[is_typeList_show ? 'expendClass' : 'miniClass','clearfix']"
           v-on:mouseover="selectedResponse(true)"
           v-on:mouseout="selectedResponse(false)">
        <div class="mapTypeSelected">
          <img v-bind:src="selectItem.image"></img>
          <span>{{selectItem.name}}</span>
        </div>
        <ul class="mapTypeCard">
          <li class="mapTypeCard-item" v-for="(item, index) in typeList" @click="itemResponse(item)">
            <img v-bind:src="item.image"></img>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import * as globals from '../globals'// 导入全局变量
  import eventBridge from '../globals/eventBridge'

  export default {
    name: 'PMMapTypebox',
    data () {
      return {
        is_typeList_show: false,
        /*typeList: [{                            //本地部署
         image: './static/images/ztt1.png',
         name: '标准地图',
         token: 'e5b28c654d784ae3961e38e5e2760e9c',
         solution: '3614',
         style: '3614'
         }, {
         image: './static/images/ztt2.png',
         name: '清新地图',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '3499',
         style: '3499'

         }, {
         image: './static/images/ztt3.png',
         name: '标准路况',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '3500',
         style: '3500'

         }, {
         image: './static/images/ztt4.png',
         name: '淡灰地图',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '3501',
         style: '3501'

         }, {
         image: './static/images/ztt5.png',
         name: '简洁地图',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '3502',
         style: '3502'

         }, {
         image: './static/images/ztt6.png',
         name: '淡雅蓝地图',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '3503',
         style: '3503'

         }, {
         image: './static/images/ztt7.png',
         name: '深海蓝地图',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '3504',
         style: '3504'

         }, {
         image: './static/images/ztt8.png',
         name: '黑夜地图',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '3505',
         style: '3505'

         }, {
         image: './static/images/ztt9.png',
         name: '动态交通',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '3588',
         style: '3588'

         }, {
         image: './static/images/ztt10.png',
         name: '卫星影像',
         token: '25cc55a69ea7422182d00d6b7c0ffa93',
         solution: '2356',
         style: '2356'
         }],
         selectItem: {
         image: './static/images/ztt1.png',
         name: '标准地图',
         token: 'e5b28c654d784ae3961e38e5e2760e9c',
         solution: '3614',
         style: '3614'
         },*/
        typeList: [
          {
            image: './static/images/ztt1.png',
            name: '标准地图',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3498',
            style: '3498'
          },
          {
            image: './static/images/ztt2.png',
            name: '清新地图',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3499',
            style: '3499'

          }, {
            image: './static/images/ztt3.png',
            name: '标准路况',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3500',
            style: '3500'

          }, {
            image: './static/images/ztt4.png',
            name: '淡灰地图',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3501',
            style: '3501'

          }, {
            image: './static/images/ztt5.png',
            name: '简洁地图',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3502',
            style: '3502'

          }, {
            image: './static/images/ztt6.png',
            name: '淡雅蓝地图',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3503',
            style: '3503'

          }, {
            image: './static/images/ztt7.png',
            name: '深海蓝地图',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3504',
            style: '3504'

          }, {
            image: './static/images/ztt8.png',
            name: '黑夜地图',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3505',
            style: '3505'

          }, {
            image: './static/images/ztt9.png',
            name: '动态交通',
            token: '62d44474da2a47249fe065a1ac504e55',
            solution: '3588',
            style: '3588'

          }, {
            image: './static/images/ztt10.png',
            name: '卫星影像',
            token: '25cc55a69ea7422182d00d6b7c0ffa93',
            solution: '2356',
            style: '2356'

          }],
        selectItem: {
          image: './static/images/ztt1.png',
          name: '标准地图',
          token: '62d44474da2a47249fe065a1ac504e55',
          solution: '3498',
          style: '3498'
        }
      }
    },
    computed: {
    },
    methods: {
      // 选择配图小图的响应
      itemResponse (item) {
        this.selectItem = item;
        eventBridge.$emit('selectedMapStyle', item);
      },
      // 选择配图大图的响应
      selectedResponse (bool) {
        eventBridge.$emit('clickDisable');
        this.is_typeList_show = bool === null ? !this.is_typeList_show : bool;
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>
  #mapType-wrapper {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .mapType-big {
    padding: 8px 8px 2px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    background-color: #fff;
    border: 1px solid #eee;
    overflow: hidden;
    border-radius: 6px;
    box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  }

  ul li.mapTypeCard-item {
    display: inline-block;
    width: 80px;
    height: 50px;
    cursor: pointer;
    position: relative;
    margin-right: 8px;
  }

  ul li img {
    width: 100%;
    height: 100%;
  }

  ul li.mapTypeCard-item:nth-child(1), ul li.mapTypeCard-item:nth-child(2), ul li.mapTypeCard-item:nth-child(3), ul li.mapTypeCard-item:nth-child(4), ul li.mapTypeCard-item:nth-child(5) {
    margin-bottom: 8px;
  }

  .mapTypeCard-item span {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 68px;
    padding: 4px 6px;
    text-align: right;
    font-size: 10px;
    color: #fff;
    pointer-events: none;
    background-color: #3385FF;
  }
  .mapTypeCard-item > span >img.tip-img{
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-right: 4px;
    vertical-align: text-bottom;
  }

  .mapTypeCard {
    float: right;
    overflow: hidden;
  }

  .mapTypeSelected {
    float: right;
    position: relative;
  }

  .expendClass .mapTypeCard {
    width: 442px;
    height: 110px;
    opacity: 1;
    transition: .3s all ease;
  }

  .miniClass .mapTypeCard {
    width: 0px;
    height: 70px;
    opacity: 0;
    transition: .3s all ease;
  }

  .miniClass > .mapTypeSelected {
    height: 70px;
    background-color: rgba(149, 149, 149, 0.6);
  }

  .expendClass > .mapTypeSelected {
    transition: .3s all ease;
  }

  .mapTypeSelected span {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: calc(100% - 12px);
    padding: 2px 6px;
    font-size: 10px;
    color: #fff;
    text-align: right;
    background-color: #3385FF;
    pointer-events: none;
  }

  .expendClass > .mapTypeSelected img {
    width: 170px;
    height: 108px;
    cursor: pointer;
    transition: .3s all ease;
  }

  .expendClass {
    width: 612px;
    padding-right: 2px;
    transition: .3s all ease;
  }

  .miniClass {
    width: 100px;
    height: 70px;
    transition: .3s all ease;
  }

  .miniClass > .mapTypeSelected img {
    width: 100px;
    height: 70px;
    transition: .3s all ease;
  }

  .mapTypeCard-item.singleLi {
    float: left;
  }

  .mapTypeCard-item.singleLi img {
    width: 140px;
    height: 110px;
  }
</style>
