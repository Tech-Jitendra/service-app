// templates/ThreeColumnLayout.js
import React from 'react';
import { Row, Col } from 'antd';

const FullColumnLayout = (props) => {
  return (
    <Row gutter={16}>
      {props.field.map((child, index) => (
        <Col span={24} key={index}>
          {child}
        </Col>
      ))}
    </Row>
  );
};

export default FullColumnLayout;
