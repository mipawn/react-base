<template>
  <div class="register-container">
    <div class="header">
      <div></div>
      <div class="menu">
        <!-- <Lang /> -->
      </div>
    </div>
    <div class="body">
      <div class="cover">
        <div class="logo">
          <img src="@/assets/img/common/logo.png" :alt="t('global.name')">
          <span>Console</span>
        </div>
        <div class="desc">
          <p>
            <img src="@/assets/img/login/login-box-bg.svg" alt="">
          </p>
          <p>{{t('register.desc.title')}}</p>
          <p class="info">{{t('register.desc.info')}}</p>
        </div>
      </div>
      <div class="main">

        <div class="form-title">{{t('register.registerForm.title')}}</div>
        <el-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerFromEl"
          class="form"
          @keyup.enter.prevent="handleRegiste"
          >
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              :placeholder="t('register.registerForm.phonePlaceholder')"
              name="phone"
              type="text"
              tabindex="1"
              autocomplete="on"
              prefix-icon="el-icon-mobile-phone"
            />
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              :placeholder="t('register.registerForm.accountPlaceholder')"
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
              v-model="registerForm.password"
              :placeholder="t('register.registerForm.passwordPlaceholder')"
              name="password"
              tabindex="2"
              autocomplete="on"
              prefix-icon="el-icon-key"
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
          <el-form-item prop="code">
            <div class="code-container">
              <el-input
                v-model="registerForm.code"
                :placeholder="t('register.registerForm.codePlaceholder')"
                name="code"
                type="text"
                tabindex="3"
                autocomplete="on"
                >
              </el-input>
              <el-button
                type="primary"
                :disabled="codeTime > 0"
                @click="sendCode"
                >
                <span v-if="codeTime > 0">{{codeTime}}s 后重新获取</span>
                <span v-else>获取短信验证码</span>
              </el-button>
            </div>
          </el-form-item>

          <el-form-item style="margin-bottom: 0">
            <el-button
              :loading="loading"
              :disabled="!isCanRegist"
              type="primary"
              style="
                width: 100%;
              "
              @click.prevent="handleRegiste"
            >
              {{t('register.registerForm.registerButton')}}
            </el-button>
          </el-form-item>

          <div class="form-tips">
            <span class="info">已有账号，去&nbsp;</span>
            <span class="is-link primary" @click="goLogin">登录</span>
          </div>
        </el-form>

        <div class="footer">
          <div class="footer-item">
            <span>Copyright © 2020 BA Inc. All rights reserved.</span>
          </div>
          <div class="footer-item" v-if="locale === 'zh-CN'">
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
import { useI18n } from 'vue-i18n'

import {
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElLink,
  ElMessage as message,
} from 'element-plus'
import Lang from '@/components/Lang.vue'

export default defineComponent({
  name: 'Register',
  components: {
    ElForm,
    ElFormItem,
    ElButton,
    ElInput,
    ElLink,
    // Lang,
  },
  setup() {
    const { t, locale } = useI18n()

    const passwordType = ref('password')
    const passwordEl = ref<HTMLInputElement | null>(null)
    const registerFromEl = ref<HTMLFormElement | null>(null)
    const loading = ref(false)
    const registerForm = reactive({
      username: '',
      password: '',
      code: '',
      phone: '',
    })
    const router = useRouter()
    const handleRegiste = async () => {
      (registerFromEl.value as any)
        .validate((valid: any) => {
          if (valid) {
            if (loading.value) return
            loading.value = true
            loading.value = false
            message.success(t('register.registerForm.registerSuccessTips'))
            router.push({ path: '/login' })
          }
        })
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
    const isCanRegist = computed(() => {
      return registerForm.username && registerForm.password
    })

    // 验证码
    const codeTimer = ref<number | undefined>(undefined)
    const codeTime = ref(0)
    const sendCode = () => {
      codeTime.value = 60
      window.setInterval(() => {
        if (codeTime.value > 0) {
          codeTime.value -= 1
        } else {
          window.clearInterval(codeTimer.value)
          codeTimer.value = undefined
          codeTime.value = 60
        }
      }, 1000)
    }

    const goLogin = () => {
      router.push('/login')
    }

    return {
      registerForm,
      registerRules: {
        username: [{ required: true, trigger: 'blur', message: t('register.registerForm.accountPlaceholder') }],
        password: [{ required: true, trigger: 'blur', message: t('register.registerForm.passwordPlaceholder') }],
        phone: [{ required: true, trigger: 'blur', message: t('register.registerForm.phonePlaceholder') }],
        code: [{ required: true, trigger: 'blur', message: t('register.registerForm.codePlaceholder') }],
      },
      passwordType,
      loading,
      isCanRegist,
      locale,
      codeTime,
      registerFromEl,
      passwordEl,

      handleRegiste,
      showPwd,
      t,
      sendCode,
      goLogin,
    }
  },
})
</script>

<style lang="scss" scoped>
.register-container {
  background: #FFF;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
  padding: 0 16px;
  position: relative;
  width: 100%;

  &::before {
    background-image: url("~@/assets/img/login/login-bg.svg");
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    content: "";
    height: 100%;
    left: 0;
    margin-left: -48%;
    position: absolute;
    top: 0;
    width: 100%;
  }
}

.header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  position: relative;
  z-index: 2;
}

.body {
  display: flex;
  height: calc(100% - 30px - 1rem);
  justify-content: space-between;
  margin: 0 auto;

  padding: 0.5rem 2.5rem;
  position: relative;
  width: 90%;
  z-index: 4;
}

.cover {
  box-sizing: border-box;
  height: 100%;
  width: 50%;
}

.logo {
  align-items: center;
  color: #FFF;
  display: flex;
  margin-top: 20px;

  img {
    width: 40px;
  }

  span {
    font-size: 30px;
    margin-left: 20px;
  }
}

.desc {
  color: #FFF;
  font-size: 30px;
  font-weight: 500;
  margin: 18vh auto 0;

  img {
    width: 80%;
  }

  .info {
    font-size: 14px;
    font-weight: 400;
    margin-top: 1.25rem;
  }
}

.main {
  position: relative;
  width: 40%;
}

.form {
  margin-top: 24px;
  max-width: 300px;
  width: 80%;
}

.form-title {
  color: #333;
  font-size: 30px;
  font-weight: 500;
  margin-top: 32vh;
}

.footer {
  bottom: 0;
  position: absolute;
  width: 100%;
}

.footer-item {
  font-weight: normal;
  padding: 5px 0;

  :deep(.el-link) {
    margin-left: 30px;
  }

  :deep(.el-link:first-child) {
    margin-left: 0;
  }
}

.icon-view {
  color: #C0C4CC;
  cursor: pointer;

  &:hover {
    color: #409EFF;
  }

  &.active {
    color: #409EFF;
  }
}

.code-container {
  display: flex;
  align-items: center;
  button {
    margin-left: 20px;
  }
}

.form-tips {
  .info {
    color: #acb3bd;
  }
  margin: 10px 0 0;
  font-size: 14px;
  display: flex;
  align-items: center;
}
</style>
