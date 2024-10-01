<template>
  <md-table-empty-state
    :md-label="label"
    :md-description="description"
  />
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: 'AppealsEmptyState',

  computed: {
    ...mapState('appeals', ['search', 'failMessage', 'status']),
  
    label() {
      if (this.status === 'pending') {
        return 'Пожалуйста, ждите…';
      }
      if (this.failMessage) {
        return 'Что-то пошло не так…';
      }
      return 'Ничего не найдено';
    },

    description() {
      if (this.status === 'pending') {
        return 'Загружается список заявок';
      }
      if (this.failMessage) {
        return this.failMessage;
      }
      if (this.search) {
        return `По запросу «${this.search}» не найдено ни одной заявки. Попробуйте использовать другой запрос или создайте новую заявку.`;
      }
      return 'Вы можете создать первую заявку.';
    },
  },
};
</script>
