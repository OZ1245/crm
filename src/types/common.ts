import { QCheckbox, QInput, QSelect } from 'quasar';

export type ILoadingStatus = boolean;

type Attributes = {
  [key: string]: string
}

export interface IFieldsMap {
  text: { component: typeof QInput, attributes?: Attributes };
  textarea: { component: typeof QInput, attributes?: Attributes };
  number: { component: typeof QInput, attributes?: Attributes };
  select: { component: typeof QSelect, attributes?: Attributes };
  checkbox: { component: typeof QCheckbox, attributes?: Attributes };
}
