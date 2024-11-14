import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Row, Col, Form, Tabs } from "antd";
import submit from "../../public/Images/submit.svg";
import FooterBtn from "./FooterBtn";
import BreadCrumb from "./BreadCrumb";
import CmnStepps from "./CmnStepps";
import DynamicFormNew from "./DynamicFormNew"; 

const { TabPane } = Tabs;

interface Role {
  ReviewerRoleID: number;
}

interface UserInfo {
  AQ_UserId: number;
  AQ_UserData: string;
  Role: Role[];
  AQ_User: string;
}

interface GroupData {
  [key: number]: Record<string, any>;
}

interface ProcessItem {
  PROCESS_ID: number;
  isActive: boolean;
}

interface Group {
  PROCESS_ID: number;
  GROUP_ID: number;
  GROUP_NAME: string;
  PATH: string;
  RULE?: any;
}

interface SubGroup {
  GROUP_ID: number;
  [key: string]: any;
}

interface Field {
  GROUP: number;
  PROCESS: number;
  [key: string]: any;
}

interface HomeProps {
  processId: number;
  setprocessId: (id: number) => void;
}

interface ProcessIdResult {
  nextProcessId: number | null;
  previousProcessId: number | null;
}

const Home: React.FC<HomeProps> = ({ processId, setprocessId }) => {
  const [stepItems, setStepItems] = useState<ProcessItem[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subGroups, setSubGroups] = useState<SubGroup[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    AQ_UserId: 0,
    AQ_UserData: "",
    Role: [],
    AQ_User: "",
  });
  const [form] = Form.useForm();
  const router = useRouter();
  const [allGroupData, setAllGroupData] = useState<GroupData>({});
  const [UniqueNumber, setUniqueNumber] = useState<string>("");
  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const [EnableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [PrjName, setPrjName] = useState<string>("");
  const [submitNovalid, setsubmitNovalid] = useState<boolean>(false);
  const [nextTabkey, setnextTabkey] = useState<number>(0);
  const [nextProcessIdKey, setnextProcessIdKey] = useState<string>("");
  const [ddd, setDDD] = useState<Record<number, any>>({});

  useEffect(() => {
    const fetchBase = async () => {
      const query = new URLSearchParams(window.location.search);
      const code = query?.get("code");
      const processResp = await axios.get(`/api/common?mdl=process`);
      setStepItems(processResp?.data?.filter((x) => x.isActive));
      if (code) {
        setUniqueNumber(code);
        const responseUserdata = await axios.get(
          `/api/common?mdl=userData&data.PROJECT_CODE=${code}`
        );
        let y = {};
        let userDtInfo =
          typeof window !== "undefined"
            ? JSON.parse(sessionStorage?.getItem?.("userSession"))
            : {};
        responseUserdata.data?.[0]?.["groupId"] === 1 &&
          setPrjName(responseUserdata.data?.[0]?.data?.["PROJECT_NAME"]);
        responseUserdata.data?.forEach((itm) => {
          if (itm["groupId"] === 1) {
            if (!itm["data"]?.["AGENCYORSECTOR_NAME"]) {
              itm["data"]["AGENCYORSECTOR_NAME"] =
                userDtInfo?.["AgencyorSectorName"];
            }
            if (!itm["data"]?.["DEPARTMENT"]) {
              itm["data"]["DEPARTMENT"] = userDtInfo?.["Department"];
            }
            if (!itm["data"]?.["SECTION_NAME"]) {
              itm["data"]["SECTION_NAME"] = userDtInfo?.["sectionName"];
            }
            if (!itm["data"]?.["CONTACT_DETAILS"]) {
              itm["data"]["CONTACT_DETAILS"] = userDtInfo?.["AQ_Name"];
            }
          }
          y[itm["groupId"]] = itm["data"];
        });
        if (responseUserdata.data?.length === 0) {
          y = {
            1: {
              AGENCYORSECTOR_NAME: userDtInfo?.["AgencyorSectorName"],
              DEPARTMENT: userDtInfo?.["Department"],
              SECTION_NAME: userDtInfo?.["sectionName"],
              CONTACT_DETAILS: userDtInfo?.["AQ_Name"],
            },
          };
        }
        setAllGroupData(y);
      } else {
        // const getUniqueNumber = await axios.get(`/api/generateNumber`);
        // setUniqueNumber(getUniqueNumber?.data?.number);
        setUniqueNumber(new Date()?.toString());
      }
      //  const setUserInfoData = await axios.get(`/api/common?mdl=AQ_User_Data&AQ_UserId=11`);
      setUserInfo(
        typeof window !== "undefined"
          ? JSON.parse(sessionStorage?.getItem?.("userSession"))
          : {}
      );
    };
    fetchBase();
  }, []);
  useEffect(() => {
    if (processId === 0) {
      changeStep(1, true);
    }
  }, []);

  useEffect(() => {
    if (processId) {
      const fetchConfig = async () => {
        const field = await axios.get(
          `/api/common?mdl=masterFields&PROCESS=${processId}`
        );
        console.log("response --------  ", field.data);
        const groups = await axios.get(
          `/api/common?mdl=processGroups&PROCESS_ID=${processId}`
        );
        const subGroups = await axios.get(
          `/api/common?mdl=processSubGroups&PROCESS_ID=${processId}`
        );
        const templates = await axios.get(`/api/common?mdl=templateMaster`);
        setFields(field?.data);
        setGroups(groups?.data);
        setSubGroups(subGroups?.data);
        setTemplates(templates?.data);  
      };
      fetchConfig();
    }
  }, [processId]);

  useEffect(() => {
    (async () => {
      const fields = await axios.get(`/api/common?mdl=masterFields`);
      stepItems?.forEach(async (item) => {
        const uniqueGroups = [
          ...new Set(
            fields?.data
              ?.filter((element) => {
                if (item?.PROCESS_ID === element?.PROCESS) return element;
              })
              ?.map((element) => element?.GROUP)
          ),
        ];
        setDDD((prev) => ({ ...prev, [item?.PROCESS_ID]: uniqueGroups }));
      });
    })();
  }, [stepItems]);

  const getNextAndPreviousProcessId = (processId, processes) => {
    const index = processes.findIndex((p) => p.PROCESS_ID === processId);

    if (index === -1) {
      return { nextProcessId: null, previousProcessId: null };
    }

    const nextProcessId =
      index < processes.length - 1 ? processes[index + 1].PROCESS_ID : null;
    const previousProcessId =
      index > 0 ? processes[index - 1].PROCESS_ID : null;

    return { nextProcessId, previousProcessId };
  };

  const handleNextGroup = (updatedData) => {
    const { nextProcessId } = getNextAndPreviousProcessId(
      currentGroup?.PROCESS_ID || processId,
      stepItems
    );
    if (nextProcessId === 12) {
      router.push(
        `/ReviewForm?view=true&requestNumber=${UniqueNumber}&role=PM`
      );
    } else {
      if (!groups?.length) {
        setCurrentGroupIndex(0);
        setprocessId(nextProcessId);
      }
      if (currentGroupIndex < groups.length - 1) {
        setCurrentGroupIndex(currentGroupIndex + 1);
      }
      if (currentGroupIndex === groups.length - 1) {
        if (
          currentGroup?.PROCESS_ID === 1 &&
          currentGroupIndex === groups.length - 1
        ) {
          setModalOpen(EnableSubmit);
          if (!EnableSubmit) {
            setCurrentGroupIndex(0);
            setprocessId(nextProcessId);
          }
        } else {
          if (nextProcessId === 12)
            router.push(
              `/ReviewForm?view=true&requestNumber=${UniqueNumber}&role=PM`
            );
          else setCurrentGroupIndex(0);
          setprocessId(nextProcessId);
        }
      }
    }
    updatedData && setAllGroupData(updatedData);
  };
  const upDateGroupData = (updatedData) => {
    setAllGroupData(updatedData);
  };
  const handleSubmit = async (allGroupData) => {
    const finalData = { ...allGroupData };
    const data = { ...finalData };
    let response = await axios.post("/api/common", {
      processId,
      PROJECT_CODE: UniqueNumber,
      ...data,
      mdl: "userDataFinal",
    });
    if (
      response?.data?.acknowledged &&
      (processId === 1 || currentGroup?.PROCESS_ID === 1)
    ) {
      let responseDelete = await axios.delete(`/api/common`, {
        data: {
          condition: { "data.PROJECT_CODE": UniqueNumber },
          mdl: "userData",
        },
      });
      let payloadTrans = {
        ProjectCode: UniqueNumber,
        ReviewerRole: userInfo?.Role?.[0]?.ReviewerRoleID,
        ReviewerId: userInfo?.AQ_UserId,
        ReviewerName: userInfo?.AQ_User,
        ReviewerAction: "Request Initiated",
        ActionDateTime: moment()?.format("YYYY-MM-DD hh:mm:ss"),
        ReviewerComments: "",
        mdl: "TransactionHistory",
      };
      let TransacResponse = await axios.post("/api/common", {
        ...payloadTrans,
      });
      setEnableSubmit(false);
      // return AqForsubmission(userInfo, allGroupData?.[1]);
    }
  };

  const handlePrevGroup = () => {
    const { previousProcessId } = getNextAndPreviousProcessId(
      currentGroup?.PROCESS_ID || processId,
      stepItems
    );
    if (!groups?.length) {
      setCurrentGroupIndex(0);
      setprocessId(previousProcessId);
    }
    if (currentGroupIndex >= 0 && currentGroupIndex <= groups.length - 1) {
      if (currentGroupIndex === 0) {
        currentGroup?.PROCESS_ID > 1 && setprocessId(previousProcessId);
      }
      setCurrentGroupIndex(currentGroupIndex === 0 ? 0 : currentGroupIndex - 1);
    }
  };

  const changeStep = (num, initialSet = false) => {
    // if (num === 12) {
    //   router.push(`/ReviewForm?view=true&requestNumber=${UniqueNumber}&role=PM`);
    // } else {
    if (initialSet || [2, 4, 7, 8]?.includes(processId)) {
      setprocessId(num);
      setCurrentGroupIndex(0);
    } else {
      setnextProcessIdKey(num);
      setsubmitNovalid(true);
    }
    // }
  };

  const currentGroup = groups[currentGroupIndex];
  const currentGroupSubGroups =
    subGroups?.length &&
    subGroups.filter(
      (subGroup) => subGroup.GROUP_ID === currentGroup?.GROUP_ID
    );
  const currentFields =
    fields?.length > 0
      ? fields?.filter((field) => field.GROUP === currentGroup?.GROUP_ID)
      : [];
  const currentGroupRules = currentGroup ? [currentGroup.RULE] : [];
  const currentGroupPath = currentGroup ? currentGroup.PATH : "";

  const handleok = async () => {
    const { nextProcessId } = getNextAndPreviousProcessId(
      currentGroup?.PROCESS_ID || processId,
      stepItems
    );
    let otput = await handleSubmit(allGroupData);
    const state = { requestNumber: UniqueNumber };
    if (otput)
      router.push(
        `/SuccessPage?state=${encodeURIComponent(JSON.stringify(state))}`
      );
    setCurrentGroupIndex(0);
    setprocessId(nextProcessId);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setEnableSubmit(false);
    setModalOpen(false);
  };

  const submitclicked = () => {
    setEnableSubmit(true);
    form.submit();
  };

  const setsubmitNovalidfunc = (prcs = false) => {
    setsubmitNovalid(false);
    setCurrentGroupIndex(Number(!prcs ? nextTabkey : 0));
    if (nextProcessIdKey === 12) {
      router.push(
        `/ReviewForm?view=true&requestNumber=${UniqueNumber}&role=PM`
      );
    } else prcs && setprocessId(nextProcessIdKey);
    prcs && setnextProcessIdKey("");
  };

  return (
    <>
      <Row className="crt_proj_row">
        <Col md={4}>
          <CmnStepps
            onClick={(num: string | number) => changeStep(num)}
            items={stepItems}
            processId={processId}
            prosessData={ddd}
            allGroupData={allGroupData}
          />
        </Col>
        <Col md={20}>
          <BreadCrumb />
          {!groups?.length && processId === 12 ? (
            <h3>to be programmed</h3>
          ) : (
            <div className="content_sec">
              <div className="white-card p-20">
                <div className="cust_tab">
                  {/* <div className="margin_bott_15">
                    <Row justify={"space-between"}>
                      <Col md={16}>
                        <span className="bold-font">Project Name : </span>
                        {PrjName}
                      </Col>
                      <Col md={6}>
                        <span className="cmn_box_value_2">
                          {UniqueNumber || form.getFieldValue("PROJECT_CODE")}
                        </span>
                      </Col>
                    </Row>
                  </div> */}
                  {groups.length > 0 && (
                    <Tabs
                      activeKey={`${currentGroupIndex}`}
                      onChange={(key) => {
                        setsubmitNovalid(true);
                        setnextTabkey(Number(key));
                      }}
                    >
                      {groups.map((group, index) => (
                        <TabPane tab={group.GROUP_NAME} key={index}>
                          {currentGroupIndex === index && (
                            <DynamicFormNew
                              fields={currentFields}
                              onSubmit={handleNextGroup}
                              groupId={currentGroup.GROUP_ID}
                              processId={processId}
                              isLastGroup={
                                currentGroupIndex === groups.length - 1
                              }
                              groupRules={currentGroupRules}
                              subGroups={currentGroupSubGroups}
                              templates={templates}
                              customPagePath={currentGroupPath}
                              userInfo={userInfo}
                              allGroupData={allGroupData}
                              UniqueNumber={UniqueNumber}
                              form={form}
                              setPrjName={setPrjName}
                              submitNovalid={submitNovalid}
                              setsubmitNovalidfunc={setsubmitNovalidfunc}
                              upDateGroupData={upDateGroupData}
                              nextProcessIdKey={nextProcessIdKey}
                            />
                          )}
                        </TabPane>
                      ))}
                    </Tabs>
                  )}
                  {!groups?.length &&
                    ([2, 4, 7, 8]?.includes(processId) ? (
                      <div> To be Developed</div>
                    ) : (
                      <h4>Loading.............</h4>
                    ))}
                </div>
              </div>
              <FooterBtn
                handlePrevGroup={handlePrevGroup}
                groupId={currentGroup?.GROUP_ID}
                frmname={`Prjform${currentGroup?.GROUP_ID}`}
                handleNextGroup={handleNextGroup}
                showSubmit={
                  currentGroupIndex === groups.length - 1 &&
                  currentGroup?.PROCESS_ID === 1
                }
                submitclicked={submitclicked}
              />
            </div>
          )}
        </Col>
      </Row>
      {/* <ModalComponent
        title={"SUBMIT"}
        open={ModalOpen}
        content={
          <div className="text-center modal_msg p-30">
            <Image src={submit} alt="Submit Icon" />
            <h3>Are you sure you want to submit this project?</h3>
          </div>
        }
        handleCancel={() => handleCancel()}
        handleok={() => handleok()}
      /> */}
    </>
  );
};

export default Home;
