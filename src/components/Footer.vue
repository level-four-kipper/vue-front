<template>
  <!-- 底部 -->
  <div class="footer">
    <div class="friendly-link">
      <div class="project-introduce">
        <div class="footer-project-logo">
          <img src="@/assets/img/index/logo-foot.png" alt />
        </div>
        <div class="introduce-text">
          <p>技术提升平台是弗迪科技研究院研发的技术交流平台。</p>
          <p>汇聚海量开发者经验。旨在加强技术交流，专业互助、分享心得。</p>
        </div>
      </div>
      <div class="more-links">
        <div class="support-service">
          <div class="more-links-title">支持与服务</div>
          <div class="more-links-content">
            <!-- <a>资料下载</a> -->
            <router-link to @click="jumpFeedback">
              <span>用户反馈</span>
            </router-link>
            <!-- <a>违规举报</a> -->
          </div>
        </div>
        <div class="more-friendly-links">
          <div class="more-links-title">友情链接</div>
          <div class="more-links-content">
            <!-- <a href="https://www.bydglobal.com/cn/index.html" target="_blank">比亚迪官网</a> -->
            <a href="https://oa.byd.com/" target="_blank">比亚迪门户系统</a>
            <a href="http://prm.byd.com.cn:8888/swb/login.do" target="_blank">PRM系统</a>
          </div>
        </div>
        <!-- <div class="links-share">
                    <div class="more-links-title">分享</div>
                    <div class="more-links-share">
                        <img src="@/assets/img/index/wechar.png" alt="微信" />
                        <img src="@/assets/img/index/company-wechar.png" alt="企业微信" />
                        <img src="@/assets/img/index/QQ-circle-fill.png" alt="QQ" />
                    </div>
        </div>-->
      </div>
    </div>
    <div class="footer-copyRights">
      <p>Copyrights © {{currentYear}} &nbsp;弗迪科技 All rights Reserved</p>
    </div>
  </div>
</template>

<script setup name="Footer">
import { useRouter } from 'vue-router'
const router = useRouter()
function jumpFeedback() {
  const routeUrl = router.resolve({
    path: `/feedback`
  })
  window.open(routeUrl.href, '_blank')
}

const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>

<style lang="scss" scoped>
.footer {
  background-color: #535c6c;
  min-width: 1200px;
  height: 253px;
  box-sizing: border-box;
  // width: 1920px;
  .friendly-link {
    width: 1200px;
    margin: 0 auto;
    height: 194px;
    padding-top: 50px;
    padding-bottom: 30px;
    display: flex;
    justify-content: space-between;
    .project-introduce {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      .footer-project-logo {
        line-height: 0;
        margin-bottom: 24px;
        img {
          height: 46px;
        }
      }
      .introduce-text {
        line-height: 20px;
      }
    }
    .more-links {
      display: flex;
      flex-direction: row;
      .support-service,
      .more-friendly-links {
        margin-right: 100px;
      }
      .more-links-share {
        margin-top: 26px;
        display: flex;
        > img {
          margin-right: 12px;
          cursor: pointer;
        }
      }
    }
  }
  .more-links-title {
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
    color: #ffffff;
    letter-spacing: 0;
    margin-bottom: 8px;
    user-select: none;
  }
  .more-links-content {
    display: flex;
    flex-direction: column;
    a {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 28px;
      user-select: none;
      background: none;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  .footer-copyRights {
    height: 58px;
    border-top: 1px solid #667083;
    display: flex;
    justify-content: center;
    align-items: center;
    P {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      line-height: 16px;
      letter-spacing: 0;
    }
  }
}
</style>
