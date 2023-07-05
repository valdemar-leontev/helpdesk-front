export enum RequirementStates {
  created = 1,

  underConsideration,

  agreed,

  inExecution,

  rejected,

  closed,

  completed,

  reassigned
}

export const RequirementStateDescriptions = {
  created: 'Создана',

  underConsideration: 'В рассмотрениии',

  agreed: 'Согласована',

  inExecution: 'В исполнении',

  rejected: 'Отказано',

  closed: 'Закрыта',

  completed: 'Выполнена',

  reassigned: 'Переназначено'
};