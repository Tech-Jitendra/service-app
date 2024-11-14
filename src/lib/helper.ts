import axios from "axios";
import moment from "moment";

export const checkNum = (val) => {
  return /^\d+$/.test(val);
};

type Field = {
  [key: string]: string | Date;
  type: "DateTime" | "Text";
};

type FormattedField = {
  InternalName: string;
  Type: "DateTime" | "Text";
  DateTimeValue?: string;
  TextValue?: string;
};

const createDynamicFieldsWithPrefix = (data: Field[]): FormattedField[] => {
  return data.map((field) => {
    const fieldName = Object.keys(field)[0];
    const type = field.type;
    const value = field[fieldName];
    return {
      InternalName: `3_${fieldName}`,
      Type: type,
      [`${type}Value`]:
        type === "DateTime"
          ? moment(value as Date).format("YYYY-MM-DD")
          : (value as string),
    } as FormattedField;
  });
};

// export const getSubmissionFormat = async (data,userInfo): Promise<FormattedField[]> => {
//   const data: Field[] = [
//     { "Request Date": new Date(), type: "DateTime" },

//   ];

//   return createDynamicFieldsWithPrefix(data);
// };
