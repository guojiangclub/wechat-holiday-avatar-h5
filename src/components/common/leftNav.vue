<template>
  <div class="left-nav">
    <ul>
      <li>
        <div>收银</div>
      </li>

      <li>
        <div>店铺</div>
      </li>

      <li>
        <div>商品</div>
      </li>

      <li>
        <div>会员</div>
      </li>


      <li>
        <div>统计</div>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {
    name: 'leftNav',
    data () {
      return {
      }
    }
  }
</script>
<style>
  .left-nav{
    color:#fff;
    font-size:10px;
    height:100%;
    background-color: #1D8ce0;
    float:left;
    width:5%;
  }
  .left-nav ul{
    padding:0px;
    margin: 0px;
  }
  .left-nav li{
    list-style: none;
    text-align: center;
    border-bottom:1px solid #20a0ff;
    padding:10px;
  }

</style>
