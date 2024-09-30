<template>
  <form
    action="#"
    autocomplete="off"
    class="login-form"
    @submit.prevent="authorize"
  >
    <h1 class="md-subheading login-header">
      Авторизация
    </h1>

    <md-field
      class="icon-field"
      :class="{'md-invalid': login !== null && !isLoginLegal}"
    >
      <label>Логин или Телефон</label>
      <md-input
        v-model="login"
        required
      />
      <md-icon>phone</md-icon>
    </md-field>

    <md-field 
      class="icon-field" 
      :class="{'md-invalid': password !== null && !isPasswordLegal}"
    >
      <label>Пароль</label>
      <md-input
        v-model="password" 
        type="password"
        required
      />
      <md-icon>lock</md-icon>
    </md-field>

    <md-button
      class="md-raised md-primary login-button"
      :disabled="!isLoginLegal || !isPasswordLegal || isPending"
      type="submit"
    >
      Войти
    </md-button>

    <md-snackbar
      md-position="center"
      :md-active.sync="isFailMessageVisible"
      class="login-snackbar"
    >
      {{ $store.state.auth.failMessage }}
    </md-snackbar>
  </form>
</template>

<script>
export default {
  name: 'LoginForm',

  data: () => ({
    login: null,
    password: null,
    isPending: false,
    isFailMessageVisible: false,
  }),

  computed: {
    isLoginLegal() {
      return this.login?.trim().length > 0;
    },

    isPasswordLegal() {
      return this.password?.length > 0;
    },
  },

  methods: {
    async authorize() {
      this.isPending = true;
      this.isFailMessageVisible = false;
      try {
        await this.$store.dispatch('auth/authorize', {username: this.login, password: this.password});
        this.$router.replace({name: 'appeals'});
      } catch (e) {
        this.isFailMessageVisible = true;
      } finally {
        this.isPending = false;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.login-form {
  background: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 340px;
}

.login-header {
  background: var(--md-theme-default-primary);
  border-radius: 5px;
  color: var(--md-theme-default-text-primary-on-primary);
  font-weight: 500;
  margin: -40px 0 30px;
  padding: 18px;
  text-align: center;
}

.icon-field {
  $gap: 8px;

  gap: $gap;

  > label {
    font-size: inherit;
    left: 24px + $gap;
  }

  &:not(.md-invalid) > label {
    color: #999;
  }

  &.md-required label::after {
    content: none;
  }

  .md-icon {
    order: -1;
  }
}

.login-button {
  font-weight: 400;
  margin-inline: auto;
  min-width: 110px;
  text-transform: none;
}

:global(.md-snackbar.md-theme-default.login-snackbar) {
  background: #a00;
}
</style>
