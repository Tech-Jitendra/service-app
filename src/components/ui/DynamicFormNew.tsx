import axios, { AxiosError } from "axios";
import { Form, Input, Select, DatePicker } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import FullColumnLayout from "../templates/FullColumnLayout";
import ThreeColumnLayout from "../templates/ThreeColumnLayout";
import TwoColumnLayout from "../templates/TwoColumnLayout";
import {
  DropdownData,
  DynamicFormProps,
  Field,
  SubGroup,
} from "@/types/commonTypes";
export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export const fetchDropdownOptions = async (
  type: string,
  parentCode?: string,
  parentType?: string
): Promise<Array<{ code: string; name: string }>> => {
  try {
    let url = `/api/common?mdl=codes&type=${type}`;
    if (parentCode && parentType) {
      url += `&parentCode=${parentCode}&parentType=${parentType}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new ApiError(
      `Failed to fetch dropdown data: ${axiosError.message}`,
      axiosError.response?.status
    );
  }
};

export const saveFormData = async (
  processId: string,
  groupId: string,
  data: any,
  UniqueNumber: string
): Promise<void> => {
  try {
    const url = `/api/common?mdl=userData&groupId=${groupId}&processId=${processId}&data.PROJECT_CODE=${UniqueNumber}`;
    const existingData = await axios.get(url);

    if (existingData?.data?.length) {
      await axios.put("/api/common", {
        condtn: {
          "data.PROJECT_CODE": UniqueNumber,
          processId: parseInt(processId),
          groupId: parseInt(groupId),
        },
        data,
        mdl: "userData",
      });
    } else {
      await axios.post("/api/common", {
        processId,
        groupId,
        data,
        mdl: "userData",
      });
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new ApiError(
      `Failed to save form data: ${axiosError.message}`,
      axiosError.response?.status
    );
  }
};

// validation.ts
export const validateField = (
  value: string,
  dataType?: string,
  pattern?: string
): string => {
  if (!value) return "";
  // console.log("p=----------------- ", value,new RegExp(pattern).test(value));
  if (pattern && !new RegExp(pattern).test(value)) {
    return "This field does not match the required pattern";
  }

  const validations: Record<string, { regex: RegExp; message: string }> = {
    ALPHA_NUMERIC: {
      regex: /^[a-zA-Z0-9]+$/,
      message: "This field must be alphanumeric",
    },
    NUMERIC: {
      regex: /^\d+$/,
      message: "This field must be numeric",
    },
    ARABIC: {
      regex: /^[\u0600-\u06FF\u0750-\u077F\s]+$/,
      message: "This field must contain Arabic characters",
    },
  };

  const validation = validations[dataType || ""];
  if (validation && !validation.regex.test(value)) {
    return validation.message;
  }

  return "";
};

interface FormFieldProps {
  field: Field;
  value: any;
  onChange: (name: string, value: any) => void;
  dropdownOptions?: Array<{ code: string; name: string }>;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  dropdownOptions,
}) => {
  const renderInput = () => {
    switch (field.FIELD_TYPE) {
      case "TEXT":
        return (
          <Input
            value={value}
            disabled={false}
            className="input"
            placeholder={field.DISPLAY_NAME}
            onChange={(e) => onChange(field.FIELD_NAME, e.target.value)}
          />
        );

      case "TEXTAREA":
        return (
          <Input.TextArea
            rows={4}
            className={`txtarea ${
              field.FIELD_DATA_TYPE === "ARABIC" ? "textarea-rtl" : ""
            }`}
            placeholder={field.DISPLAY_NAME}
            value={value}
            onChange={(e) => onChange(field.FIELD_NAME, e.target.value)}
          />
        );

      case "DROPDOWN":
        return (
          <Select
            disabled={false}
            placeholder={field.DISPLAY_NAME}
            value={value}
            onChange={(value) => onChange(field.FIELD_NAME, value)}
          >
            {dropdownOptions?.map((option) => (
              <Select.Option key={option.code} value={option.code}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        );

      case "DATE":
        return (
          <DatePicker
            value={value}
            placeholder={field.DISPLAY_NAME}
            format="DD-MMM-YYYY"
            onChange={(date) => onChange(field.FIELD_NAME, date)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Form.Item
      hidden={field.hiddenInput}
      label={field.DISPLAY_NAME}
      name={field.FIELD_NAME}
      rules={[
        field.FIELD_TYPE === "DROPDOWN"
          ? {
              required: field.MANDATORY === "Y",
              message: `${field.DISPLAY_NAME} is required`,
            }
          : {
              required: field.MANDATORY === "Y",
              pattern: new RegExp(field.PATTERN as never),
              message: `${field.DISPLAY_NAME} is required`,
            },
      ]}
    >
      {renderInput()}
    </Form.Item>
  );
};

const DynamicFormNew: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  groupId,
  processId,
  subGroups,
  templates,
  UniqueNumber,
  form,
  setsubmitNovalidfunc,
  upDateGroupData,
  nextProcessIdKey,
  // ... other props
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dropdownData, setDropdownData] = useState<DropdownData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = useCallback(
    async (name: string, value: any, PATTERN: string) => {
      const field = fields.find((f) => f.FIELD_NAME === name);
      if (!field) return;
      if (field.FIELD_DATA_TYPE !== "DROPDOWN") {
        const error = validateField(value, field.FIELD_DATA_TYPE, PATTERN);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
      const updatedData = { ...formData, [name]: value };
      const dependentFields = fields.filter(
        (f) => f.DEPENDENCY === field.FIELD_ID
      );
      for (const depField of dependentFields) {
        updatedData[depField.FIELD_NAME] = "";
        try {
          const options = await fetchDropdownOptions(
            depField.FIELD_NAME || "",
            value,
            field.FIELD_NAME
          );
          setDropdownData((prev) => ({
            ...prev,
            [depField.FIELD_NAME]: options,
          }));
        } catch (error) {
          const apiError = error as ApiError;
          setErrors((prev) => ({
            ...prev,
            [depField.FIELD_NAME]: apiError.message,
          }));
        }
      }

      setFormData(updatedData);
    },
    [fields, formData]
  );

  const handleSubmit = async (values: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        PROJECT_CODE: UniqueNumber,
      };

      await saveFormData(processId, groupId, data, UniqueNumber);

      const updatedAllData = { ...values, [groupId]: { ...data } };
      setFormData({});
      onSubmit(updatedAllData);

      if (nextProcessIdKey) {
        setsubmitNovalidfunc(true);
        upDateGroupData(updatedAllData);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setErrors((prev) => ({
        ...prev,
        submit: apiError.message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadDropdownData = async () => {
      const dropdownFields = fields.filter(
        (f) => f.FIELD_TYPE === "DROPDOWN" && !f.DEPENDENCY
      );

      for (const field of dropdownFields) {
        try {
          const options = await fetchDropdownOptions(field.FIELD_NAME || "");
          setDropdownData((prev) => ({
            ...prev,
            [field.FIELD_NAME]: options,
          }));
        } catch (error) {
          const apiError = error as ApiError;
          setErrors((prev) => ({
            ...prev,
            [field.FIELD_NAME]: apiError.message,
          }));
        }
      }
    };

    loadDropdownData();
  }, [fields]);

  const renderSubGroup = (subGroup: SubGroup) => {
    const subGroupFields = fields.filter(
      (field) => field.SUBGROUP === subGroup.SUB_GROUP_ID
    );

    const template = templates.find((t) => t.TEMPLATE_ID === subGroup.TEMPLATE);
    const Layout =
      template?.TEMPLATE_ID === 3
        ? FullColumnLayout
        : template?.TEMPLATE_ID === 2
        ? ThreeColumnLayout
        : TwoColumnLayout;

    return (
      <div key={subGroup.SUB_GROUP_ID}>
        {subGroup.ShowHeader && (
          <h3 className="in-progress top-gap-12">{subGroup.SUB_GROUP_NAME}</h3>
        )}
        {!subGroup.TABLE && (
          <Layout
            field={subGroupFields.map((field) => (
              <FormField
                key={field.FIELD_ID}
                field={field}
                value={formData[field.FIELD_NAME]}
                onChange={handleFieldChange}
                dropdownOptions={dropdownData[field.FIELD_NAME]}
              />
            ))}
          />
        )}
      </div>
    );
  };

  return (
    <Form
      layout="vertical"
      name={`Prjform${groupId}`}
      onFinish={handleSubmit}
      form={form}
      onFinishFailed={(errorInfo) => {
        console.error("Form validation failed:", errorInfo);
        setErrors((prev) => ({
          ...prev,
          form: "Please fix the validation errors before submitting",
        }));
      }}
    >
      {subGroups.map(renderSubGroup)}
      {errors.submit && <div className="error-message">{errors.submit}</div>}
      {errors.form && <div className="error-message">{errors.form}</div>}
    </Form>
  );
};

export default DynamicFormNew;
