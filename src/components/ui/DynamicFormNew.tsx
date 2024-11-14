import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Select, DatePicker } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import FullColumnLayout from "../templates/FullColumnLayout";
import ThreeColumnLayout from "../templates/ThreeColumnLayout";
import TwoColumnLayout from "../templates/TwoColumnLayout";
import { DropdownData } from "@/types/commonTypes";
const { TextArea } = Input;

export async function getServerSideProps() {
  console.log("propsss", "test");
}

const DynamicFormNew = (props: {
  fields: any;
  onSubmit: any;
  groupId: any;
  processId: any;
  isLastGroup: any;
  groupRules: any;
  subGroups: any;
  templates: any;
  customPagePath: any;
  allGroupData: any;
  UniqueNumber: any;
  userInfo: any;
  form: any;
  setPrjName: any;
  submitNovalid: any;
  setsubmitNovalidfunc: any;
  upDateGroupData: any;
  nextProcessIdKey: any;
}) => {
  const {
    fields,
    onSubmit,
    groupId,
    processId,
    isLastGroup,
    groupRules,
    subGroups,
    templates,
    customPagePath,
    allGroupData,
    UniqueNumber,
    userInfo,
    form,
    setPrjName,
    submitNovalid,
    setsubmitNovalidfunc,
    upDateGroupData,
    nextProcessIdKey,
  } = props;
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [dropdownData, setDropdownData] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [tableData, setTableData] = useState({});
  const [customPageData, setCustomPageData] = useState({});
  const [tableColumn, setTableColumn] = useState([]);
  const [uploadedFiles2, setUploadedFiles2] = useState({});

  const expandIcon = ({ isActive }) =>
    isActive ? <MinusOutlined /> : <PlusOutlined />;

  const fetchDepDropdownData = async (
    fieldName: string,
    type: string,
    setDropdownData: React.Dispatch<React.SetStateAction<DropdownData>>,
    parentCode: string = "",
    parentType: string = ""
  ): Promise<void> => {
    if (!type) return;

    let url = `/api/common?mdl=codes&type=${type}`;
    if (parentCode && parentType) {
      url += `&parentCode=${parentCode}&parentType=${parentType}`;
    }

    try {
      const response = await axios.get(url);
      setDropdownData((prevData) => ({
        ...prevData,
        [fieldName]: response.data,
      }));
    } catch (error) {
      console.error(`Failed to fetch dropdown data for ${fieldName}:`, error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      for (const field of fields) {
        const { FIELD_TYPE, FIELD_NAME, DEPENDENCY, FIELD_ID } = field;
        if (FIELD_TYPE === "DROPDOWN") {
          if (DEPENDENCY) {
            const dependentField = fields.find(
              (f) => f.FIELD_ID === DEPENDENCY
            );
            if (dependentField && formData[dependentField.FIELD_NAME]) {
              await fetchDepDropdownData(
                FIELD_NAME,
                FIELD_NAME,
                setDropdownData,
                formData[dependentField.FIELD_NAME],
                dependentField.FIELD_NAME
              );
            }
          } else {
            await fetchDepDropdownData(FIELD_NAME, FIELD_NAME, setDropdownData);
          }
        }
      }
    };
    fetchData();
  }, [fields, formData, setDropdownData]);

  const handleSave = async (val) => {
    // const ruleError = !customPagePath && (await executeGroupRules());
    // if (ruleError) {
    //   setErrors({ ...errors, rules: ruleError });
    //   return;
    // }
    const data = {
      ...formData,
      PROJECT_CODE: UniqueNumber,
      attachments: uploadedFiles2,
      customPageData,
      tableData,
    };
    const updatedData = { ...allGroupData, [groupId]: { ...data } };
    let url = `/api/common?mdl=userData&groupId=${groupId}&processId=${processId}&data.PROJECT_CODE=${UniqueNumber}`;
    let checkDataExist = await axios.get(url);
    if (checkDataExist?.data?.length) {
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

    setFormData({}); // Clear form data for the next group
    onSubmit(updatedData);
  };

  const handleSaveNoval = async (val) => {
    const data = {
      ...formData,
      PROJECT_CODE: UniqueNumber,
      attachments: uploadedFiles2,
      customPageData,
      tableData,
    };
    const updatedData = { ...allGroupData, [groupId]: { ...data } };
    let url = `/api/common?mdl=userData&groupId=${groupId}&processId=${processId}&data.PROJECT_CODE=${UniqueNumber}`;
    let checkDataExist = await axios.get(url);
    if (checkDataExist?.data?.length) {
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
    setsubmitNovalidfunc(nextProcessIdKey ? true : false);
    setFormData({}); // Clear form data for the next group
    upDateGroupData(updatedData);
  };

  const handleEdit = (subGroupId) => {
    setShowPreview(false);
    onSubmit(subGroupId);
  };

  const validateField = (name, value, dataType, pattern) => {
    let error = "";
    if (pattern && !new RegExp(pattern).test(value)) {
      error = "This field does not match the required pattern";
    } else if (dataType === "ALPHA_NUMERIC" && !/^[a-zA-Z0-9]+$/.test(value)) {
      error = "This field must be alphanumeric";
    } else if (dataType === "NUMERIC" && !/^\d+$/.test(value)) {
      error = "This field must be numeric";
    } else if (
      dataType === "ARABIC" &&
      !/^[\u0600-\u06FF\u0750-\u077F\s]+$/.test(value)
    ) {
      error = "This field must contain Arabic characters";
    }
    return error;
  };

  const handleChange = async (e) => {
    console.log("----------- working ------------------");
    const { name, value } = e.target;
    const field = fields.find((f) => f.FIELD_NAME === name);
    const error = validateField(
      name,
      value,
      field?.FIELD_DATA_TYPE,
      field?.PATTERN
    );

    setErrors({
      ...errors,
      [name]: error,
    });

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    fields
      ?.filter((f) => f.DEPENDENCY === field?.FIELD_ID)
      .forEach((depField) => {
        updatedFormData[depField.FIELD_NAME] = "";
        setDropdownData((prevData) => ({
          ...prevData,
          [depField.FIELD_NAME]: [],
        }));
        fetchDropdownData(
          depField?.TYPE,
          depField?.FIELD_NAME,
          value,
          field?.TYPE
        );
      });
    setFormData(updatedFormData);
  };

  const renderField = (field) => {
    switch (field.FIELD_TYPE) {
      case "TEXT":
        return (
          <Form.Item
            hidden={field.hiddenInput ? true : false}
            label={field.DISPLAY_NAME}
            name={field.FIELD_NAME}
            key={field.FIELD_ID}
            rules={[
              {
                required: field.MANDATORY === "Y",
                pattern: field.PATTERN,
                message: `${field.DISPLAY_NAME} is required`,
              },
            ]}
          >
            <Input
              disabled={false}
              rootClassName={"input"}
              placeholder={field.DISPLAY_NAME}
              name={field.FIELD_NAME}
              onChange={handleChange}
              value={formData?.[field.FIELD_NAME]}
            />
          </Form.Item>
        );
      case "TEXTAREA":
        return (
          <Form.Item
            label={field.DISPLAY_NAME}
            name={field.FIELD_NAME}
            key={field.FIELD_ID}
            rules={[
              {
                required: field.MANDATORY === "Y",
                pattern: field.PATTERN,
                message: `${field.DISPLAY_NAME} is required`,
              },
            ]}
          >
            <TextArea
              rows={4}
              rootClassName={"txtarea"}
              placeholder={field.DISPLAY_NAME}
              name={field.FIELD_NAME}
              onChange={handleChange}
              className={
                field.FIELD_DATA_TYPE === "ARABIC" ? "textarea-rtl" : ""
              }
              value={formData?.[field.FIELD_NAME]}
            />
          </Form.Item>
        );
      case "DROPDOWN":
        return (
          <Form.Item
            label={field.DISPLAY_NAME}
            name={field.FIELD_NAME}
            key={field.FIELD_ID}
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
              value={formData[field.FIELD_NAME] ?? undefined}
              onChange={(value) =>
                handleDropdownChange(field.FIELD_NAME, value)
              }
            >
              {dropdownData[field.FIELD_NAME]?.map((option, index) => (
                <Select.Option key={index} value={option.code}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      case "DATE":
        return (
          <Form.Item
            label={field.DISPLAY_NAME}
            name={field.FIELD_NAME}
            key={field.FIELD_ID}
            rules={[
              {
                required: field.MANDATORY === "Y",
                message: `${field.DISPLAY_NAME} is required`,
              },
            ]}
          >
            <DatePicker
              value={formData?.[field.FIELD_NAME]}
              placeholder={field.DISPLAY_NAME}
              name={field.FIELD_NAME}
              format={"DD-MMM-YYYY"}
              onChange={(e, vl) =>
                handleChange({ name: field.FIELD_NAME, value: e })
              }
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const fetchDropdownData = async (
    type,
    fieldName,
    parentCode = "",
    parentType = ""
  ) => {
    let url = `/api/common?mdl=codes&type=${type}`;
    if (parentCode && parentType) {
      url += `&parentCode=${parentCode}&parentType=${parentType}`;
    }
    const response = await axios.get(url);
    setDropdownData((prevData) => ({
      ...prevData,
      [fieldName]: response.data,
    }));
  };

  const handleDropdownChange = async (
    name: string,
    value: string | number | boolean | any
  ): Promise<void> => {
    const field = fields.find((f) => f.FIELD_NAME === name);
    if (!field) {
      console.error(`Field not found for ${name}`);
      return;
    }
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    const dependentFields = fields.filter(
      (f) => f.DEPENDENCY === field.FIELD_ID
    );
    for (const depField of dependentFields) {
      updatedFormData[depField.FIELD_NAME as keyof typeof updatedFormData] = "";
      setDropdownData((prevData: DropdownData) => ({
        ...prevData,
        [depField.FIELD_NAME]: [],
      }));
      try {
        await fetchDropdownData(
          depField.TYPE,
          depField.FIELD_NAME,
          value,
          field.TYPE
        );
      } catch (error) {
        console.error(
          `Error fetching dropdown data for ${depField.FIELD_NAME}:`,
          error
        );
      }
    }
    setFormData(updatedFormData);
  };

  return (
    <Form
      layout="vertical"
      name={`Prjform${groupId}`}
      onFinish={(values) => handleSave(values)}
      form={form}
      onFinishFailed={(err) => {
        console.log("err", err);
      }}
    >
      {subGroups.map((subGroup) => {
        const templateData = templates.find(
          (t) => t.TEMPLATE_ID === subGroup.TEMPLATE
        )?.TEMPLATE_ID;
        return (
          <div key={subGroup.SUB_GROUP_ID}>
            {subGroup?.ShowHeader && (
              <h3 className="in-progress top-gap-12">
                {subGroup.SUB_GROUP_NAME}
              </h3>
            )}
            {templateData === 3 && !subGroup.hasOwnProperty("TABLE") ? (
              <FullColumnLayout
                field={fields
                  ?.filter((field) => field.SUBGROUP === subGroup.SUB_GROUP_ID)
                  .map(renderField)}
              />
            ) : templateData === 2 && !subGroup.hasOwnProperty("TABLE") ? (
              <ThreeColumnLayout
                field={fields
                  ?.filter((field) => field.SUBGROUP === subGroup.SUB_GROUP_ID)
                  .map(renderField)}
              />
            ) : (
              !subGroup.hasOwnProperty("TABLE") && (
                <TwoColumnLayout
                  field={fields
                    ?.filter(
                      (field) => field.SUBGROUP === subGroup.SUB_GROUP_ID
                    )
                    .map(renderField)}
                />
              )
            )}
          </div>
        );
      })}
      {/* {errors.rules ? <p className="c_red">{errors.rules}</p> : ""} */}
    </Form>
  );
};

export default DynamicFormNew;
