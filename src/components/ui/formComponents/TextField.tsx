import { BaseFieldProps } from "@/types/commonTypes";
import { Form, Input } from "antd";

export const TextField: React.FC<BaseFieldProps> = ({
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
    <Input
      value={value}
      disabled={false}
      className="input"
      placeholder={field.DISPLAY_NAME}
      onChange={(e) => onChange(field.FIELD_NAME, e.target.value)}
    />
  </Form.Item>
);
