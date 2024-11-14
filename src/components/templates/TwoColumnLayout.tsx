// templates/TwoColumnLayout.js
import React from 'react';
import { Row, Col } from 'antd';

const TwoColumnLayout = (props) => {
  return (
    <Row gutter={16}>
      {props.field.map((child, index) => (
        <Col span={12} key={index}>
          {child}
        </Col>
      ))}
    </Row>
  );
};

export default TwoColumnLayout;
