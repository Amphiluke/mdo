<template>
  <div class="appeals-table">
    <md-table v-model="appealsConfig.mdData">
      <md-table-toolbar class="appeals-filters">
        <AppealsFilterSearch class="md-toolbar-section-start" />
        <AppealsFilterPremises class="md-toolbar-section-end" />
      </md-table-toolbar>

      <AppealsEmptyState />

      <md-table-row
        slot="md-table-row"
        slot-scope="{item}"
        @click="$store.commit('appeals/setActiveAppeal', item.id)"
      >
        <md-table-cell
          md-label="№" 
          class="appeals-number"
        >
          {{ item.number }}
        </md-table-cell>
        <md-table-cell
          md-label="Создана"
          class="appeals-created"
        >
          {{ item.created_at | date }}
        </md-table-cell>
        <md-table-cell
          md-label="Адрес"
          class="appeals-address"
        >
          {{ [item.premise?.address, item.apartment?.label].filter(Boolean).join(', ') }}
        </md-table-cell>
        <md-table-cell
          md-label="Заявитель"
          class="appeals-applicant"
        >
          {{ item.applicant.last_name }}
          {{ item.applicant.first_name | initial }}
          {{ item.applicant.patronymic_name | initial }}
        </md-table-cell>
        <md-table-cell
          md-label="Описание"
          class="appeals-description"
        >
          {{ item.description }}
        </md-table-cell>
        <md-table-cell
          md-label="Срок"
          class="appeals-due"
        >
          {{ item.due_date | date }}
        </md-table-cell>
        <md-table-cell
          md-label="Статус"
          class="appeals-status"
        >
          {{ item.status.name }}
        </md-table-cell>
      </md-table-row>

      <md-table-pagination
        v-show="appeals.length > 0"
        md-label=""
        md-separator="из"
        :md-page-size="pageSize"
        :md-page-options="[10, 25, 50]"
        :md-update="resetPagination"
        :md-data="appealsConfig"
        class="appeals-pagination"
      />
    </md-table>

    <div
      v-show="status === 'pending'"
      class="appeals-overlay"
    >
      <md-progress-spinner md-mode="indeterminate" />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import AppealsFilterSearch from '@/components/AppealsFilterSearch.vue';
import AppealsFilterPremises from '@/components/AppealsFilterPremises.vue';
import AppealsEmptyState from '@/components/AppealsEmptyState.vue';

export default {
  name: 'AppealsTable',

  components: {
    AppealsFilterSearch,
    AppealsFilterPremises,
    AppealsEmptyState,
  },

  filters: {
    date: (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('ru') : '',

    initial: (name) => name ? name[0] + '.' : '',
  },

  computed: {
    ...mapState('appeals', ['appeals', 'page', 'pageSize', 'count', 'status']),

    appealsConfig() {
      return {
        mdCount: this.count,
        mdPage: this.page,
        mdData: this.appeals,
      };
    },
  },

  created() {
    this.resetPagination();
  },

  methods: {
    async resetPagination(page, pageSize) {
      if (page < 1) {
        return;
      }
      if (page === this.page && pageSize === this.pageSize && this.appeals.length) {
        return;
      }
      await this.$store.dispatch('appeals/fetch', {page, pageSize});
    },
  },
};
</script>

<style lang="scss" scoped>
.appeals-table {
  position: relative;

  ::v-deep th {
    --md-theme-default-text-accent-on-background: var(--md-theme-default-primary);
    font-weight: normal;
  }
}

$widths: ("number": 8.3%, "created": 12.4%, "address": 16.5%, "applicant": 16.5%, "description": 21.5%, "due": 12.4%, "status": 12.4%);

@each $id, $width in $widths {
  .appeals-#{$id} {
    max-width: 0;
    width: $width;
  }
}

.appeals-table ::v-deep :is(.md-table-cell, .md-table-head) {
  font-size: inherit;
}

.appeals-table ::v-deep .md-table-cell-container {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appeals-number ::v-deep .md-table-cell-container {
  background: var(--md-theme-default-primary);
  border-radius: 4px;
  color: var(--md-theme-default-text-primary-on-primary);
  display: inline-block;
  padding: 4px 14px;
}

.appeals-filters {
  gap: 15px;
  padding: 16px 0;
}

.appeals-pagination {
  justify-content: flex-start;

  ::v-deep .md-table-pagination-label,
  ::v-deep .md-field {
    order: 1;
  }

  ::v-deep .md-table-pagination-previous,
  ::v-deep .md-table-pagination-next {
    order: 2;
  }

  ::v-deep .md-table-pagination-previous {
    margin-inline-start: auto;
  }
}

.appeals-overlay {
  align-items: center;
  background: #fffa;
  display: flex;
  inset: 0;
  justify-content: center;
  position: absolute;
  z-index: 10;
}
</style>
