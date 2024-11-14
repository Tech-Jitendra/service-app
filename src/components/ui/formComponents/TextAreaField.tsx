import { BaseFieldProps } from "@/types/commonTypes";
import { Form, Input } from "antd";

export const TextAreaField: React.FC<BaseFieldProps> = ({
  field,
  value,
  onChange,
}) => (
  <Form.Item
    label={field.DISPLAY_NAME}
    name={field.FIELD_NAME}
    rules={[
      {
        required: field.MANDATORY === "Y",
        pattern: new RegExp(field.PATTERN || ""),
        message: `${field.DISPLAY_NAME} is required`,
      },
    ]}
  >
    <Input.TextArea
      rows={4}
      className={`txtarea ${
        field.FIELD_DATA_TYPE === "ARABIC" ? "textarea-rtl" : ""
      }`}
      placeholder={field.DISPLAY_NAME}
      value={value}
      onChange={(e) => onChange(field.FIELD_NAME, e.target.value)}
    />
  </Form.Item>
);
