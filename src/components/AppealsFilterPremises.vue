<template>
  <md-field>
    <label for="premises">Дом</label>
    <md-select
      id="premises"
      v-model="premises"
      :disabled="$store.state.appeals.status === 'pending'"
    >
      <md-option value="" />
      <md-option
        v-for="{id, address} of $store.state.appeals.premises"
        :key="id"
        :value="id"
      >
        {{ address }}
      </md-option>
    </md-select>
  </md-field>
</template>

<script>
export default {
  name: 'AppealsFilterPremises',

  computed: {
    premises: {
      get() {
        return this.$store.state.appeals.premiseId;
      },
      set(premiseId) {
        this.$store.dispatch('appeals/fetch', {page: 1, premiseId});
      },
    },
  },

  created() {
    this.$store.dispatch('appeals/loadPremises');
  }
};
</script>
