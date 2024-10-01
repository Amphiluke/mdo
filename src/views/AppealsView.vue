<template>
  <div class="appeals-view">
    <h1 class="appeals-headline md-headline">
      Список заявок
    </h1>

    <div class="appeals-widget">
      <md-button class="appeals-create md-dense md-raised md-primary">
        Создать
      </md-button>
      <AppealsTable />
    </div>
  </div>
</template>

<script>
import AppealsTable from '@/components/AppealsTable.vue';

export default {
  name: 'AppealsView',

  components: {
    AppealsTable,
  },
}
</script>

<style lang="scss" scoped>
.appeals-view {
  display: flow-root;
  margin: 0 auto;
  width: min(1250px, 100vw - 40px);
}

.appeals-headline {
  color: #454545;
}

.appeals-widget {
  background: #fff;
  border-radius: 8px;
  padding: 10px 20px;
}

.appeals-create {
  display: block;
  font-size: 0.7rem;
  font-weight: normal;
  height: 26px;
  margin: 0 0 0 auto;
}
</style>
