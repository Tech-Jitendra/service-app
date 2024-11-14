import { FormInstance } from "antd";
// export interface Field {
//   FIELD_TYPE: string;
//   FIELD_NAME: string;
//   FIELD_ID: string;
//   DEPENDENCY?: string;
//   TYPE?: string;
// }

export interface FormData {
  [key: string]: string | number | boolean;
}

// export interface DropdownData {
//   [key: string]: any;
// }

export interface Field {
  FIELD_ID: string;
  FIELD_NAME: string;
  FIELD_TYPE: "TEXT" | "TEXTAREA" | "DROPDOWN" | "DATE";
  DISPLAY_NAME: string;
  MANDATORY: "Y" | "N";
  PATTERN?: string;
  FIELD_DATA_TYPE?: string;
  DEPENDENCY?: string;
  SUBGROUP: string;
  TYPE?: string;
  hiddenInput?: boolean;
}

export interface SubGroup {
  SUB_GROUP_ID: string;
  SUB_GROUP_NAME: string;
  ShowHeader?: boolean;
  TEMPLATE?: number;
  TABLE?: boolean;
}

export interface Template {
  TEMPLATE_ID: number;
}

export interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
  groupId: string;
  processId: string;
  isLastGroup: boolean;
  groupRules: any;
  subGroups: SubGroup[];
  templates: Template[];
  customPagePath: string;
  allGroupData: Record<string, any>;
  UniqueNumber: string;
  userInfo: any;
  form: FormInstance;
  setPrjName: (name: string) => void;
  submitNovalid: boolean;
  setsubmitNovalidfunc: (value: boolean) => void;
  upDateGroupData: (data: any) => void;
  nextProcessIdKey: string;
}

export interface DropdownData {
  [key: string]: Array<{ code: string; name: string }>;
}

export interface BaseFieldProps {
  field: Field;
  value: any;
  onChange: (name: string, value: any) => void;
}

export interface DropdownFieldProps extends BaseFieldProps {
  dropdownOptions: Array<{ code: string; name: string }>;
}
