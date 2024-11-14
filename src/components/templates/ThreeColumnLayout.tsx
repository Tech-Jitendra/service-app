// templates/ThreeColumnLayout.js
import React from 'react';
import { Row, Col } from 'antd';

const ThreeColumnLayout = (props) => {
  return (
    <Row gutter={16}>
      {props.field.map((child, index) => (
        <Col span={8} key={index}>
          {child}
        </Col>
      ))}
    </Row>
  );
};

export default ThreeColumnLayout;
