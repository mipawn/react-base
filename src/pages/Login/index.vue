<template>
  <div class="login-container">
    <div class="header">
      <div></div>
      <div class="menu">
        <!-- <Lang /> -->
      </div>
    </div>
    <div class="body">
      <div class="cover">
        <div class="logo">
          <img src="@/assets/img/common/logo.png" alt="字节方舟">
          <span>Console</span>
        </div>
        <div class="desc">
          <p>
            <img src="@/assets/img/login/login-box-bg.svg" alt="">
          </p>
          <p>欢迎访问Console 系统</p>
          <p class="info">输入您的账户信息开始使用！</p>
        </div>
      </div>
      <div class="main">

        <div class="form-title">登录</div>
        <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="ruleForm"
          class="form"
          >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="输入账户"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
              prefix-icon="el-icon-user-solid"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              :type="passwordType"
              ref="passwordEl"
              v-model="loginForm.password"
              placeholder="输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.enter="handleLogin"
              prefix-icon="el-icon-s-check"
            >
              <template #suffix>
                <div
                  class="icon-view"
                  :class="{ active: passwordType.value === '' }"
                  @click="showPwd"
                  >
                  <i class="el-icon-view"></i>
                </div>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              :disabled="!isCanLogin"
              type="primary"
              style="width: 100%; margin-bottom: 30px"
              @click.prevent="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="footer">
          <div class="footer-item">
            <span>Copyright © 2020 BA Inc. All rights reserved.</span>
          </div>
          <div class="footer-item">
            <el-link href="http://beian.miit.gov.cn">浙ICP备19025601号</el-link>
            <el-link href="http://www.beian.gov.cn/portal/registerSystemInfo">浙公网安备 33011002014295号</el-link>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>


<script lang="ts">
import {
  defineComponent,
  nextTick,
  ref,
  reactive,
  computed,
} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import {
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElLink,
  ElMessage as message
} from 'element-plus'
import Lang from '@/components/Lang.vue'

export default defineComponent({
  name: 'Login',
  components: {
    ElForm,
    ElFormItem,
    ElButton,
    ElInput,
    ElLink,
    // Lang
  },
  setup() {
    const passwordType = ref('password')
    const passwordEl = ref<HTMLInputElement | null>(null)
    const loading = ref(false)
    const loginForm = reactive({
      username: '',
      password: ''
    })
    const store = useStore()
    const router = useRouter()
    const isLogin = computed(() => store.state.user.isLogin)
    const handleLogin = async () => {
      if(loading.value) return
      loading.value = true
      await store.dispatch('user/login', {
        accessKey: loginForm.username,
        secretKey: loginForm.password
      })
      loading.value = false
      if (isLogin.value) {
        message.success('登录成功')
        router.push({ path: '/' })
      }
    }
    const showPwd = () => {
      if (passwordType.value === 'password') {
        passwordType.value = ''
      } else {
        passwordType.value = 'password'
      }
      nextTick(() => {
        if (!passwordEl.value) return
        passwordEl.value.focus()
      })
    }
    const isCanLogin = computed(() => loginForm.username && loginForm.password)
    return {
      loginForm,
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入账户' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      passwordType,
      loading,
      handleLogin,
      showPwd,
      isCanLogin
    }
  },
})
</script>

<style lang="scss" scoped>
.login-container {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  padding: 0 16px;
  background: #FFFFFF;
  position: relative;
  box-sizing: border-box;
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -48%;
    background-image: url('~@/assets/img/login/login-bg.svg');
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    content: '';
  }
}
.header {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
}
.body {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 90%;

  padding: 0.5rem 2.5rem;
  height: calc(100% - 30px - 1rem);
  z-index: 4;
  margin: 0 auto;
}
.cover {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
}
.logo {
  color: #FFFFFF;
  display: flex;
  align-items: center;
  margin-top: 20px;
  img {
    width: 40px;
  }
  span {
    margin-left: 20px;
    font-size: 30px;
  }
}
.desc {
  margin: 18vh auto 0;
  font-size: 30px;
  color: #FFFFFF;
  font-weight: 500;
  img {
    width: 80%;
  }
  .info {
    margin-top: 1.25rem;
    font-weight: 400;
    font-size: 14px;
  }
}
.main {
  width: 40%;
  position: relative;
}
.form {
  margin-top: 24px;
  width: 80%;
  max-width: 300px;
}
.form-title {
  font-size: 30px;
  color: #333;
  font-weight: 500;
  margin-top: 32vh;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.footer-item {
  padding: 5px 0;
  font-weight: normal;
  :deep(.el-link) {
    margin-left: 30px;
  }
  :deep(.el-link:first-child) {
    margin-left: 0px;
  }
}
.icon-view {
  cursor: pointer;
  color: #C0C4CC;
  &:hover {
    color: #409EFF;
  }
  &.active {
    color: #409EFF;
  }
}
</style>
