export interface Field {
  FIELD_TYPE: string;
  FIELD_NAME: string;
  FIELD_ID: string;
  DEPENDENCY?: string;
  TYPE?: string;
}

export interface FormData {
  [key: string]: string | number | boolean;
}

export interface DropdownData {
  [key: string]: any;
}
