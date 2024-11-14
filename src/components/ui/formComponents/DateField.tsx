import { BaseFieldProps } from "@/types/commonTypes";
import { DatePicker, Form, Input } from "antd";

export const DateField: React.FC<BaseFieldProps> = ({
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
        message: `${field.DISPLAY_NAME} is required`,
      },
    ]}
  >
    <DatePicker
      value={value}
      className="input"
      placeholder={field.DISPLAY_NAME}
      format="DD-MMM-YYYY"
      onChange={(date) => onChange(field.FIELD_NAME, date)}
    />
  </Form.Item>
);
