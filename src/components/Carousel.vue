<template>
  <div class="carousel-main">
    <el-carousel :interval="4000" type="card" height="350px" :autoplay="true">
      <el-carousel-item v-for="item in cardList" :key="item.title" @click="jumpBlogPage(item.url)">
        <div class="main-card">
          <div class="card-img">
            <img :src="item.img" alt="#" />
          </div>
          <p class="card-title">
            {{item.title}}
          </p>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script setup>
defineProps({cardList:Array,interval:Number})
</script>

<style scoped lang="scss">
 .carousel-main {
        height: 428px;
        padding: 48px 0;
        padding-top: 43px;
        color: #333;
        border-bottom: 1px solid #ddd;
        .el-carousel--horizontal{
            padding-top: 5px;
        }
        .el-carousel__item{
            background-color: rgba($color: #fff, $alpha: 0);
            box-shadow: 0 0 5px #999;
            h3{
                height: 100%;
                color: #475669;
                font-size: 14px;
                opacity: 0.75;
                line-height: 200px;
                margin: 0;
            }
        }
        .is-in-stage{
            background-color: rgba($color: #fff, $alpha: 1.0);
        }
        .is-active{
            background-color: rgba($color: #fff, $alpha: 0.7);
        }
        .main-card{
            height: 350px;
            padding: 25px;
            padding-bottom: 0;
            display: flex;
            flex-direction: column;
            opacity: 1;
            .card-img{
                flex: 1;
                height: 280px;
                border-radius: 5px;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .card-title{
                height: 40px;
                font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                line-height: 40px;
            }
        }
    }
.m-footer{
  height: calc(15%);
}
</style>
