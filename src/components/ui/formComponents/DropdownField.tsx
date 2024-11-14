import { BaseFieldProps, DropdownFieldProps } from "@/types/commonTypes";
import { DatePicker, Form, Select } from "antd";

export const DropdownField: React.FC<DropdownFieldProps> = ({
  field,
  value,
  onChange,
  dropdownOptions,
}) => (
  <Form.Item
    label={field.DISPLAY_NAME}
    name={field.FIELD_NAME}
    rules={[
      {
        required: field.MANDATORY === "Y",
        message: `${field.DISPLAY_NAME} is required`,
      },
    ]}
  >
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
  </Form.Item>
);
