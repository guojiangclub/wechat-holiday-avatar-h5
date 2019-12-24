<template>
  <div class="pos">
    <div class="wrapper">
      <div class="operation-header">
        <div class="h-logo"></div>
        <div class="h-title"></div>
        <div class="h-slogan"></div>
      </div>
      <!--<div class="operation-number">目前已有&nbsp;<span>28477万</span>&nbsp;人次参与活动</div>-->
      <div class="operation-box">
        <div class="prev" @click="prev"></div>
        <div class="operation-img">
          <div class="cropper-content">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :outputSize="option.size"
              :outputType="option.outputType"
            >
            </vueCropper>
            <div class="cropper-boxs">
              <img :src="imgList[count]" class="frame-image" id="FrameImage">
            </div>
          </div>
        </div>
        <div class="next" @click="next"></div>
      </div>
      <div class="operation-btns"><div class="o-btn o-btn3" id="saveImg" @click="convert2canvas"></div></div>
      <div class="study">* 本教程仅供交流学习</div>
    </div>
    <div class="mask" v-if="dataUrl" @click="changeMask">
      <div class="saved-pic">
        <img :src="dataUrl" alt="">
        <div class="txt">长按图片保存</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios';
  import html2canvas from 'html2canvas';
  import { VueCropper }  from 'vue-cropper';

  export default {
    name: 'Pos',
    components:{
      VueCropper
    },
    data () {
      return {
        dataUrl:'',
        option: {
          img: '',
          outputSize:1, //剪切后的图片质量（0.1-1）
          full: false,//输出原图比例截图 props名full
          outputType: 'png',
          canMove: true,
          original: false,
          canMoveBox: true,
          autoCrop: true,
          autoCropWidth: 150,
          autoCropHeight: 150,
          fixedBox: true
        },
        imgList:[
          'https://cdn.guojiang.club/%E5%9C%A3%E8%AF%9Eh5%E4%BA%92%E5%8A%A8%E5%A4%B4%E5%83%8F_%E7%94%BB%E6%9D%BF%201%20%E5%89%AF%E6%9C%AC%202.png',
          'https://cdn.guojiang.club/%E5%9C%A3%E8%AF%9Eh5%E4%BA%92%E5%8A%A8%E5%A4%B4%E5%83%8F_%E7%94%BB%E6%9D%BF%201%20%E5%89%AF%E6%9C%AC%203.png',
          'https://cdn.guojiang.club/%E5%9C%A3%E8%AF%9Eh5%E4%BA%92%E5%8A%A8%E5%A4%B4%E5%83%8F_%E7%94%BB%E6%9D%BF%201%20%E5%89%AF%E6%9C%AC%204.png',
          'https://cdn.guojiang.club/%E5%9C%A3%E8%AF%9Eh5%E4%BA%92%E5%8A%A8%E5%A4%B4%E5%83%8F_%E7%94%BB%E6%9D%BF%201%20%E5%89%AF%E6%9C%AC.png',
          'https://cdn.guojiang.club/%E5%9C%A3%E8%AF%9Eh5%E4%BA%92%E5%8A%A8%E5%A4%B4%E5%83%8F_%E7%94%BB%E6%9D%BF%201.png'
        ],
        count:0,
        userInfo:'',
        token:''
      }
    },
    created(){
      let env = {
        isIPad: /ipad/i.test(window.navigator.userAgent),
        isIphone: /iphone|ipad|ipod/i.test(window.navigator.userAgent),
        isWechat: /MicroMessenger/i.test(window.navigator.userAgent)
      };
      if(env.isWechat){
        var openid = this.$route.query.openid || this.$route.query['?openid'];
        var url = window.location.href;
        if (url.indexOf('?') != -1) {
          url = url + '&'
        }
        if(!openid){
          var url = window.location.href;
          if (url.indexOf('?') != -1) {
            url = url + '&'
          }
          window.location.href = 'https://guojiang.club//oauth/wxlogin?redirect_url='+encodeURIComponent(url)
        } else{
          axios.post('https://guojiang.club/api/holiday/quickLogin',{open_id:openid}).then(res =>{
            if(res.status){
              console.log(res.data);
              if(res.data){
                  /*debugger*/
                var result=res.data.data;
                result.access_token =result.token_type + ' ' + result.access_token;
                result.expires_in = result.expires_in || 315360000;  // token不过期
                result.expires = Date.now() + (result.expires_in - 300) * 1000;
                this.token=sessionStorage.getItem('token');
                let avatar=result.user.avatar  || 'http://img5.imgtn.bdimg.com/it/u=3008142408,2229729459&fm=26&gp=0.jpg';
                Vue.set(this.option,'img',avatar)
              } else {

              }
            }
          }).catch(err =>{
            console.log('网络错误',err);
          })

        }

      }
    },
    methods:{
      //点击裁剪，这一步是可以拿到处理后的地址
      finish2() {
        this.$refs.cropper2.getCropData((data) => {
          this.modelSrc = data
          this.model = false;
          //裁剪后的图片显示
          this.example2.img = this.modelSrc;
          // this.toBlob(data)
          // console.log(data)
          // console.log(this.toBlob(data))
        })

      },

      changeMask(){
        this.dataUrl = ''
      },
      //点击next按钮
      next() {
          let count = this.count;
          count++;
          if(count == 5){
            count = 0
          }
          this.count = count
  },
  //    点击prev按钮
  prev() {
        let count = this.count;
        count--;
        if(count == -1){
          count = 4
        }
    this.count = count
  },

  convert2canvas(){
        var shareContent = document.querySelector(".cropper-content"); //获取囊括所有元素的最大的div元素
        var width = shareContent.offsetWidth; //获取dom宽度（包括元素宽度、内边距和边框，不包括外边距）
        var height = shareContent.offsetHeight; ////获取dom高度（包括元素高度、内边距和边框，不包括外边距）
        var canvas = document.createElement("canvas"); //创建一个canvas标签元素
        var scale = 2; //定义放大倍数，可以支持小数
        var imgType = "image/jpg";//设置默认下载的图片格式

        canvas.width = width * scale; //定义canvas宽度 * 倍数（图片的清晰度优化），默认宽度为300px
        canvas.height = height * scale; //定义canvas高度 * 倍数，默认高度为150px
        canvas.getContext("2d").scale(scale,
          scale); //创建canvas的context对象，设置scale，相当于画布的“画笔”拥有多种绘制路径、矩形、圆形、字符以及添加图像的方
        /*var shareContent = document.getElementById("dialog1"); //获取囊括所有元素的最大的div元素
        var width = shareContent.offsetWidth; //获取dom宽度（包括元素宽度、内边距和边框，不包括外边距）
        var height = shareContent.offsetHeight; ////获取dom高度（包括元素高度、内边距和边框，不包括外边距）
        var canvas = document.createElement("canvas"); //创建一个canvas标签元素
        var scale = 2; //定义放大倍数，可以支持小数
        var imgType = "image/jpg";//设置默认下载的图片格式

        canvas.width = width * scale; //定义canvas宽度 * 倍数（图片的清晰度优化），默认宽度为300px
        canvas.height = height * scale; //定义canvas高度 * 倍数，默认高度为150px
        canvas.getContext("2d").scale(scale,
          scale); //创建canvas的context对象，设置scale，相当于画布的“画笔”拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法
*/
        var opts = { //初始化对象
          scale: scale, //添加的scale参数
          canvas: canvas, //自定义canvas
          logging: true, //日志开关，便于查看html2canvas的内部执行流程
          width: width, //dom的原始宽度和高度
          height: height,
          useCORS: true //开启html2canvas的useCORS配置，跨域配置，以解决图片跨域的问题
        };
        let that = this;
        html2canvas(document.querySelector('.cropper-content'), opts).then(function (canvas) {
          let url = canvas.toDataURL()
          console.log(url);
          that.dataUrl = url
        });
      }
    },
    /*beforeRouteEnter(to,from,next){
        let env = {
          isIPad: /ipad/i.test(window.navigator.userAgent),
          isIphone: /iphone|ipad|ipod/i.test(window.navigator.userAgent),
          isWechat: /MicroMessenger/i.test(window.navigator.userAgent)
        };
        if(env.isWechat){
            next(vm => {
                //vm 为当前实例

              console.log('这是url',url);
             /!* var token = sessionStorage.getItem('token');*!/

            })
        }

    }*/
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .wrapper{
    position: relative;
    overflow-x: hidden;
    width: 100%;
    min-height: 100vh;
    max-width: 500px;
    margin: 0 auto;
    background-image: url(https://cdn.guojiang.club/%E5%9C%A3%E8%AF%9E%E8%83%8C%E6%99%AF.png);
    background-repeat: no-repeat;
    background-size: cover;
  }
  .study{
    color: #FDF9BF;
    font-size:10px;
    line-height: 36px;
  }
  .operation-header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-top:50px;
  }
  .operation-header div {
    background-size: contain;
    background-repeat: no-repeat;
    text-align: center;
  }
  .operation-header .h-logo {
    width:187px;
    height:21px;
    background-image: url("https://cdn.ibrand.cc/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190924180012.png");
  }
  .operation-header .h-title {
    margin-top:10px;
    width: 329px;
    height:119px;
    background-image: url(https://cdn.guojiang.club/%E5%9C%A3%E8%AF%9E%E5%BF%AB%E4%B9%90);
  }
  .operation-header .h-slogan {
    margin-top:3px;
    width:228px;
    height:15px;
    background-image: url(https://cdn.guojiang.club/%E9%A2%86%E5%8F%96%E4%BD%A0%E7%9A%84%E4%B8%93%E5%B1%9E%E5%A4%B4%E5%83%8F);
  }
  .operation-number {
    margin-top:8px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
  .operation-number span {
    display: inline-block;
    padding: 1px 5px;
    border-radius: 25px;
    background-color: #ea4727;
    color: #feee92;
  }
  .operation-box {
    margin-top: 20px;
    margin-bottom: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .operation-box .prev {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  .operation-box .next, .operation-box .prev {
    background-image: url(https://mat1.gtimg.com/bbs/static/20190829-btn.png);
    background-size: contain;
    border-radius: 50%;
    width:45.5px;
    height:45.5px;
  }
  .operation-box .operation-img {
    margin: 0 15px;
    background: #fff;
    border: 5px solid #fbe6b5;
    border-radius:5px;
    font-size: 0;
  }
  .operation-box .operation-img .cropper-content {
    border-radius:10px;
    position: relative;
    width: 132px;
    height:132px;
    margin-left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    overflow: hidden;
  }
  .operation-box .next, .operation-box .prev {
    background-image: url(https://mat1.gtimg.com/bbs/static/20190829-btn.png);
    background-size: contain;
    border-radius: 50%;
    width:45.5px;
    height:45.5px;
  }
  .operation-btns {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    margin-top:15px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .operation-btns .o-btn3 {
    width: 232.5px;
    height:75px;
    background-image: url(https://cdn.ibrand.cc/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190924190513.png);
  }
  .operation-btns .o-btn {
    background-size: 100% 100%;
  }
  .vue-cropper{
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    direction: ltr;
    touch-action: none;
    text-align: left;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .cropper-boxs{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    user-select: none;
    overflow: hidden;
  }
  .cropper-boxs .frame-image {
    position: absolute;
    right: 0;
    bottom: 0;
    /*z-index: 999;*/
    width: 100%;
    height: 100%;
  }
  .cropper-move[data-v-6dae58fd] {
    cursor: move;
    z-index: 100;
  }
  .mask{
    position:fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,.4);
  }
  .mask .saved-pic{
    background-color: #ffffff;
    position: absolute;
    width:66%;
    height:250px;
    left: 50%;
    top: 50%;
    margin-left: -33%;
    margin-top: -50%;
    border-radius:8px;
  }
  .mask .saved-pic img{
    margin-top: 20px;
    width:132px;
    height:132px;
  }
  .mask .saved-pic .txt{
    padding-top: 40px;

  }



</style>
