<template>
  <div class="login-view">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: 'LoginView',

  components: {
    LoginForm,
  }
};
</script>

<style lang="scss" scoped>
.login-view {
  align-items: center;
  background: url("@/assets/main-bg.png") 50% 50% / cover no-repeat;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}
</style>
