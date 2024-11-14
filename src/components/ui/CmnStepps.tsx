import React from "react";
import { Progress } from "antd";

export default function CmnStepps({
  onClick,
  items,
  processId,
  prosessData,
  allGroupData,
}) {
  // Check if there is a matching number between processData and allGroupData
  function hasMatchingNumber(processId) {
    const groupKeys = Object.keys(allGroupData) ?? [];

    // Iterate from 1 up to the current processId
    const processDataArray = prosessData?.[processId] ?? [];

    // Check if any item in processDataArray is found in groupKeys
    if (processDataArray.some((num) => groupKeys.includes(num?.toString()))) {
      return true;
    }
    return false;
  }

  // Calculate progress percentage based on the current processId
  const progressPercentage = Math.round((processId / items?.length) * 100) - 10;

  return (
    <div className="cmn_stepper">
      <div className="prog-bar">
        <Progress strokeLinecap="butt" percent={progressPercentage} />
        <p>PMI Compliance Percentage</p>
      </div>

      <div className="step_cont">
        {items?.map((item, index) => {
          const isInProgress = item?.PROCESS_ID === processId;
          const isCompleted = hasMatchingNumber(item?.PROCESS_ID);

          return (
            <div
              key={index}
              onClick={() => onClick(item?.PROCESS_ID)}
              className={`each_step ${
                isInProgress ? "in-progress" : isCompleted ? "completed" : ""
              } d-flex`}
            >
              <div className="circle"></div> {item?.PROCESS_NAME}
            </div>
          );
        })}
      </div>
    </div>
  );
}
