import SideMenu from "@/components/app-sidebar";
import { Col, Row } from "antd";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Row>
        <Col md={2} className="left_menu">
          <SideMenu />
        </Col>
        <Col md={22} className="main_cont">
          {children}
        </Col>
      </Row>
    </>
  );
};

export default Layout;
