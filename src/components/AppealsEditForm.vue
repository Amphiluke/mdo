<template>
  <md-dialog
    class="appeals-edit-dialog"
    :md-active.sync="isOpen"
    @md-opened="onDialogOpen"
    @md-closed="onDialogClose"
  >
    <form
      action="#"
      autocomplete="off"
      class="appeals-edit-form md-layout"
      @submit.prevent="submitAppeal"
    >
      <h2 class="md-layout-item md-size-75 md-subheading appeal-heading">
        <template v-if="appeal">
          Заявка № {{ appeal.number }} (от {{ new Date(appeal.created_at).toLocaleDateString('ru') }})
        </template>
        <template v-else>
          Создание заявки
        </template>
      </h2>
      <div class="md-layout-item md-size-25 appeal-status end-aligned-item">
        {{ appeal?.status.name || 'Новая' }}
      </div>

      <div class="md-layout-item md-size-33">
        <md-autocomplete
          v-model="premisesQuery"
          :md-options="premisesOptions"
        >
          <label>Дом</label>
          <md-icon class="dropdown-arrow">
            arrow_drop_down
          </md-icon>
        </md-autocomplete>
      </div>
      <div class="md-layout-item md-size-33">
        <md-autocomplete
          v-model="apartmentQuery"
          :md-options="aparementsOptions"
          :disabled="!premisesId"
        >
          <label>Квартира</label>
          <md-icon class="dropdown-arrow">
            arrow_drop_down
          </md-icon>
        </md-autocomplete>
      </div>
      <div class="md-layout-item md-size-33">
        <date-picker
          v-model="dueDate"
          type="datetime"
          value-type="timestamp"
          format="DD.MM.YYYY HH:mm"
          :clearable="false"
          prefix-class="mdo-mx"
        >
          <template #input="{props: {value}}">
            <md-field>
              <label>Срок</label>
              <md-input
                readonly
                :value="value"
              />
            </md-field>
          </template>
          <template #icon-calendar>
            &nbsp;
          </template>
        </date-picker>
      </div>

      <div class="md-layout-item md-size-25">
        <md-field>
          <label>Фамилия</label>
          <md-input v-model="lastName" />
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field>
          <label>Имя</label>
          <md-input v-model="firstName" />
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field>
          <label>Отчество</label>
          <md-input v-model="patronymicName" />
        </md-field>
      </div>
      <div class="md-layout-item md-size-25">
        <md-field>
          <label>Телефон</label>
          <md-input v-model="userName" />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100">
        <md-field class="appeal-description">
          <label>Описание заявки</label>
          <md-textarea v-model="description" />
        </md-field>
      </div>

      <div class="md-layout-item md-size-100 end-aligned-item">
        <md-button
          class="md-raised md-primary appeal-save"
          :disabled="!isFormValid"
          type="submit"
        >
          {{ appeal ? 'Сохранить' : 'Создать' }}
        </md-button>
      </div>
    </form>

    <md-snackbar
      md-position="center"
      :md-active.sync="isFailMessageVisible"
      class="error-snackbar"
    >
      {{ failMessage }}
    </md-snackbar>
  </md-dialog>
</template>

<script>
import debounce from 'lodash.debounce';
import DatePicker from 'vue2-datepicker';
import {extractAPIError} from '@/api';
import {getPremises, getApartments} from '@/api/geo.js';
import {createAppeal, updateAppeal} from '@/api/appeals.js';

const getInitialData = () => ({
  isOpen: false,

  premisesQuery: null,
  premises: [],

  apartmentQuery: null,
  apartments: [],

  dueDate: null,

  firstName: null,
  lastName: null,
  patronymicName: null,
  userName: null,

  description: null,

  isFailMessageVisible: false,
  failMessage: null,
});

export default {
  name: 'AppealsEditForm',

  components: {
    DatePicker,
  },

  data: () => getInitialData(),

  computed: {
    appeal() {
      return this.$store.getters['appeals/activeAppeal'];
    },

    premisesOptions() {
      return this.premises.map(({address}) => address);
    },

    aparementsOptions() {
      return this.apartments.map(({label}) => label);
    },

    premisesId() {
      return this.premises.find(({address}) => address === this.premisesQuery)?.id;
    },

    apartmentId() {
      return this.apartments.find(({label}) => label === this.apartmentQuery)?.id;
    },

    isFormValid() {
      return !!(this.premisesId && this.apartmentId && this.lastName && this.userName && this.description);
    },
  },

  watch: {
    premisesQuery() {
      this.debouncedUpdatePremises();
    },

    apartmentQuery() {
      this.debouncedUpdateAppartments();
    },
  },

  created() {
    this.$watch(
      () => this.$store.state.appeals.activeAppealId,
      (appealId) => this.isOpen = !!appealId
    );
    this.debouncedUpdatePremises = debounce(this.updatePremises.bind(this), 500);
    this.debouncedUpdateAppartments = debounce(this.updateAppartments.bind(this), 500);
  },

  methods: {
    updatePremises() {
      if (!this.premisesQuery) {
        this.premises = [];
      } else {
        getPremises(this.premisesQuery)
          .then((premises) => this.premises = premises.map(({id, address}) => ({id, address})));
      }
    },

    updateAppartments() {
      if (!this.apartmentQuery) {
        this.apartments = [];
      } else {
        getApartments({premisesId: this.premisesId, search: this.apartmentQuery})
          .then((apartments) => this.apartments = apartments.map(({id, label}) => ({id, label})));
      }
    },
  
    submitAppeal() {
      const payload = {
        premisesId: this.premisesId,
        apartmentId: this.apartmentId,
        lastName: this.lastName,
        firstName: this.firstName,
        patronymicName: this.patronymicName,
        userName: this.userName,
        description: this.description,
        dueDate: this.dueDate,
      };
      const promise = this.appeal ? updateAppeal(this.appeal.id, payload) : createAppeal(payload);
      promise
        .then(() => {
          this.isOpen = false;
          this.$store.dispatch('appeals/fetch', {page: 1});
        })
        .catch((reason) => {
          this.failMessage = extractAPIError(reason.response);
          this.isFailMessageVisible = true;
        });
    },

    onDialogOpen() {
      if (!this.appeal) {
        return;
      }
      this.premisesQuery = this.appeal.premise?.address || null;
      this.apartmentQuery = this.appeal.apartment?.label || null;
      this.dueDate = Date.parse(this.appeal.due_date) || null;
      this.firstName = this.appeal.applicant?.first_name;
      this.lastName = this.appeal.applicant?.last_name;
      this.patronymicName = this.appeal.applicant?.patronymic_name;
      this.userName = this.appeal.applicant?.username;
      this.description = this.appeal.description;
      this.updatePremises();
    },

    onDialogClose() {
      this.$store.commit('appeals/setActiveAppeal', null);
      Object.entries(getInitialData()).forEach(([key, value]) => this[key] = value);
    }
  }
};
</script>

<style lang="scss" scoped>
.appeals-edit-dialog {
  ::v-deep .md-dialog-container {
    border-radius: 8px;
    padding: 24px 32px;
  }

  ::v-deep .mdo-mx-datepicker {
    width: 100%;
  }
}

.appeals-edit-form {
  max-width: 674px;

  .md-field {
    padding-bottom: 10px;

    &.md-has-value label {
      color: var(--md-theme-default-primary);
    }
  }

  ::v-deep .md-clear {
    display: none;
  }
}

.appeal-heading {
  font-weight: 500;
}

.appeal-heading,
.appeal-status {
  margin: 8px 0 24px;
}

.md-size-33 + .md-size-33 {
  padding-inline-start: 14px;
}

.md-size-25 + .md-size-25 {
  padding-inline-start: 16px;
}

.end-aligned-item {
  text-align: end;
}

.dropdown-arrow {
  pointer-events: none;
  position: absolute;
  right: 0;
}

.appeal-description {
  &.md-has-textarea:not(.md-autogrow) {
    &::before {
      border-style: none none solid;
    }
    &::after {
      border-color: transparent transparent #ccc;
    }

    label {
      left: 0;
    }
  }
}

.appeal-save {
  font-weight: normal;
  margin-inline: 0;
  text-transform: none;
}
</style>
