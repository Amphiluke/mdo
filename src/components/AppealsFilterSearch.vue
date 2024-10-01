<template>
  <md-field>
    <label>Поиск (№ заявки, название)</label>
    <md-input
      v-model="query" 
      type="search"
      :readonly="$store.state.appeals.status === 'pending'"
    />
    <md-icon>search</md-icon>
  </md-field>
</template>

<script>
import debounce from 'lodash.debounce';

export default {
  name: 'AppealsFilterSearch',

  data: () => ({
    query: '',
  }),

  watch: {
    query() {
      this.updateSearch();
    }
  },

  created() {
    this.updateSearch = debounce(() => {
      this.$store.dispatch('appeals/fetch', {page: 1, search: this.query});
    }, 1000);
  },
};
</script>
