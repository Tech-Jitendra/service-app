import { Button } from 'antd'
import React from 'react'
import {CheckOutlined} from '@ant-design/icons'

export default function FooterBtn({alignment=false,showSubmit,handlePrevGroup,groupId,frmname,handleNextGroup,submitclicked}) {
  return (
    <div className='cmn_btn'>
      {!alignment && <div className='d-flex'>
        {console.log("groupId",groupId)}
        {(groupId > 1 || groupId === undefined) && <Button className='img-btn-transparent' onClick={()=>{handlePrevGroup()}}>
          <span className='rectangle'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="11.045" viewBox="0 0 16 11.045">
            <path id="arrow-right" d="M5.768,9.385,9.154,5.963a.875.875,0,0,1,1.243,0h0a.875.875,0,0,1,0,1.234L7.282,10.339H20.125a.875.875,0,0,1,.875.875h0a.875.875,0,0,1-.875.875H7.229L10.4,15.248a.875.875,0,0,1,0,1.243h0a.875.875,0,0,1-1.243,0L5.768,13.1A2.625,2.625,0,0,1,5.768,9.385Z" transform="translate(-5 -5.704)" fill="#fff" />
          </svg></span> Go Back
        </Button>}
        {showSubmit && <Button name="submitbtn" className='img-btn-filled-sbmt' form={groupId === undefined ? null: frmname}
        //  htmlType={groupId === undefined ? null :"submit"}
        onClick={()=>submitclicked()}
         >
        Submit for Approval  <span className='rectangle'><CheckOutlined /></span>
        </Button>}
        
        <Button className='img-btn-filled'
         name='nextbtn'
         form={groupId === undefined ? null: frmname}
         htmlType={groupId === undefined ? null :"submit"}
         onClick={()=>groupId === undefined ? handleNextGroup() :()=>{}}
        >
          Save <span className='rectangle'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="11.045" viewBox="0 0 16 11.045">
            <path id="arrow-right" d="M5.768,9.385,9.154,5.963a.875.875,0,0,1,1.243,0h0a.875.875,0,0,1,0,1.234L7.282,10.339H20.125a.875.875,0,0,1,.875.875h0a.875.875,0,0,1-.875.875H7.229L10.4,15.248a.875.875,0,0,1,0,1.243h0a.875.875,0,0,1-1.243,0L5.768,13.1A2.625,2.625,0,0,1,5.768,9.385Z" transform="translate(-5 -5.704)" fill="#fff" />
          </svg></span>
        </Button>
        
      </div>}
      {alignment && <div className='d-flex alignmentgoal-btn'>
        <Button className='img-btn-transparent' onClick={()=>{handlePrevGroup()}}>
          <span className='rectangle up'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="11.045" viewBox="0 0 16 11.045">
            <path id="arrow-right" d="M5.768,9.385,9.154,5.963a.875.875,0,0,1,1.243,0h0a.875.875,0,0,1,0,1.234L7.282,10.339H20.125a.875.875,0,0,1,.875.875h0a.875.875,0,0,1-.875.875H7.229L10.4,15.248a.875.875,0,0,1,0,1.243h0a.875.875,0,0,1-1.243,0L5.768,13.1A2.625,2.625,0,0,1,5.768,9.385Z" transform="translate(-5 -5.704)" fill="#fff" />
          </svg></span> Go to Previous
        </Button>
        <Button className='img-btn-transparent' onClick={()=>handleNextGroup()}>
          Go to Next<span className='rectangle down'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="11.045" viewBox="0 0 16 11.045">
            <path id="arrow-right" d="M5.768,9.385,9.154,5.963a.875.875,0,0,1,1.243,0h0a.875.875,0,0,1,0,1.234L7.282,10.339H20.125a.875.875,0,0,1,.875.875h0a.875.875,0,0,1-.875.875H7.229L10.4,15.248a.875.875,0,0,1,0,1.243h0a.875.875,0,0,1-1.243,0L5.768,13.1A2.625,2.625,0,0,1,5.768,9.385Z" transform="translate(-5 -5.704)" fill="#fff" />
          </svg></span> 
        </Button>
      
      </div>}
    </div>
  )
}
