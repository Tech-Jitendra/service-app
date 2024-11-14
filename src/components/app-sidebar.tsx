"use client";
import React from "react";
import Image from "next/image";
import ProfImage from "../../public/Images/prof_image.png";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Select } from "antd";
// import { useProps } from '@/context/AppProvider';
import { useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";

export default function SideMenu() {
  //   const { roles, handleRoleChange, fetchData } = useProps();
  const roleinfo =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage?.getItem?.("userSession"))?.["Roles"]
      : [];
  const pathname = usePathname();
  const history = useRouter();
  const [activeMenu, setActiveMenu] = useState("");
  const profileDetail =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage?.getItem?.("userSession"))
      : {};
  const rolesData = roleinfo?.map((role) => ({
    value: role.ReviewerRoleID,
    label:
      role.ReviewerRoleID === "SPA"
        ? "Sub - Portfolio"
        : role.ReviewerRoleID === "PPP"
        ? "Portfolio Analysis"
        : role.ReviewerRoleID === "PPMSC"
        ? "Supervision Committee"
        : role.ReviewerRoleID === "GBC"
        ? "General Budget Committee"
        : role.ReviewerRoleID === "DG"
        ? "Director General Office"
        : role.ReviewerRoleID === "HEDG"
        ? "HEDG Office"
        : role.ReviewerRoleID === "FA"
        ? "Department of Finance"
        : role.ReviewerRoleID,
  }));

  const menuItems = [
    {
      title: "Home",
      path: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            id="home-svgrepo-com"
            d="M2.623,8.987C2,10.126,2,11.5,2,14.245V16.07c0,4.681,0,7.022,1.406,8.476S7.075,26,11.6,26h4.8c4.525,0,6.788,0,8.194-1.454S26,20.751,26,16.07V14.245c0-2.746,0-4.119-.623-5.257S23.616,7.143,21.339,5.73l-2.4-1.49C16.533,2.747,15.329,2,14,2s-2.533.747-4.939,2.24l-2.4,1.49C4.384,7.143,3.246,7.849,2.623,8.987ZM10.4,20.3a.9.9,0,1,0,0,1.8h7.2a.9.9,0,0,0,0-1.8Z"
            transform="translate(-2 -2)"
            fill="#fff"
            fill-rule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Mytask",
      path: "/Mytask",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24.602"
          height="26.36"
          viewBox="0 0 24.602 26.36"
        >
          <g id="record-create-svgrepo-com" transform="translate(-3.6 -2)">
            <path
              id="Path_79791"
              data-name="Path 79791"
              d="M40.8,7.7h0"
              transform="translate(-17.82 -1.784)"
              fill="#fff"
            />
            <g
              id="Group_18243"
              data-name="Group 18243"
              transform="translate(3.6 2)"
            >
              <path
                id="Path_79792"
                data-name="Path 79792"
                d="M16.7,8.6H28.792a1.085,1.085,0,0,0,1.1-1.1V5.3a3.344,3.344,0,0,0-3.3-3.3H18.9a3.344,3.344,0,0,0-3.3,3.3V7.5A1.085,1.085,0,0,0,16.7,8.6Z"
                transform="translate(-10.445 -2)"
                fill="#fff"
              />
              <path
                id="Path_79793"
                data-name="Path 79793"
                d="M25.566,6h-.879a.4.4,0,0,0-.439.429V8.146a3.5,3.5,0,0,1-3.515,3.434H11.069A3.5,3.5,0,0,1,7.554,8.146V6.429A.4.4,0,0,0,7.115,6H6.236A2.643,2.643,0,0,0,3.6,8.576v18.46a2.643,2.643,0,0,0,2.636,2.576h19.33A2.643,2.643,0,0,0,28.2,27.035V8.576A2.643,2.643,0,0,0,25.566,6Zm-3.24,15.133a.467.467,0,0,1-.439.429H17.054a.257.257,0,0,0-.275.268v4.722a.467.467,0,0,1-.439.429h-.879a.467.467,0,0,1-.439-.429V21.83a.257.257,0,0,0-.275-.268H9.915a.467.467,0,0,1-.439-.429v-.859a.467.467,0,0,1,.439-.429h4.833a.257.257,0,0,0,.275-.268V14.854a.467.467,0,0,1,.439-.429h.879a.467.467,0,0,1,.439.429v4.722a.257.257,0,0,0,.275.268h4.833a.467.467,0,0,1,.439.429Z"
                transform="translate(-3.6 -3.252)"
                fill="#fff"
              />
            </g>
          </g>
        </svg>
      ),
    },
    {
      title: "Report",
      path: "#",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 1c-0.55 0-1 0.45-1 1v9H3c-0.55 0-1 0.45-1 1v8c0 0.55 0.45 1 1 1h9v9c0 0.55 0.45 1 1 1s1-0.45 1-1v-9h9c0.55 0 1-0.45 1-1v-8c0-0.55-0.45-1-1-1h-9V2c0-0.55-0.45-1-1-1zM21 12h-8v8h-4v-8H3v-6h8v-8h6v8h8v6z"
            fill="#fff"
          />
        </svg>
      ),
      submenu: [
        { title: "SPD", path: "/Spd" },
        { title: "EPMO", path: "/Epmo" },
      ],
    },
  ];

  const handleMenuClick = (path) => {
    if (path) {
      window.location.href = path;
    }
  };

  const handleSubmenuClick = (path) => {
    setActiveMenu(path);
  };

  const renderProfileSection = (roleItem) => (
    <div className="flex-align prof_sec">
      <Image src={ProfImage} alt="Profile Image" />
      <div className="sidemenu_dropdown">
        {/* <h6>{roleItem.AQ_User}</h6> */}
        <h6>Satish K</h6>
        {/* <Select
          defaultValue={roleItem?.["Roles"]?.[0]?.["ReviewerRoleID"]}
          allowClear
          options={rolesData}
          onChange={handleRoleChange}
        /> */}
      </div>
    </div>
  );
  const Logout = () => {
    typeof window !== "undefined" && sessionStorage.removeItem("userSession");
    history.push("/Login");
  };
  return (
    <>
      <div className="side-menu">
        {profileDetail && renderProfileSection(profileDetail)}
        <nav className="menu">
          {menuItems.map((item, index) => (
            <Link href={item.path} key={index}>
              <div
                className={`flex-align menu_sec ${
                  pathname === item.path ? "active" : ""
                }`}
                onClick={() => {
                  if (item.path === "/Mytask") {
                    fetchData();
                  } else {
                    item.submenu
                      ? handleSubmenuClick(item.path)
                      : handleMenuClick(item.path);
                  }
                }}
              >
                <div
                  className={
                    pathname === item.path ? "rectangle active" : "rectangle"
                  }
                >
                  {item.icon}
                </div>
                <h6>{item.title}</h6>
              </div>
              {item.submenu && activeMenu === item.path && (
                <div className="submenu" style={{ paddingLeft: "90px" }}>
                  {item.submenu.map((subitem, subindex) => (
                    <div
                      key={subindex}
                      className={`submenu-item ${
                        pathname === subitem.path ? "active" : ""
                      }`}
                      style={{ padding: "16px", color: "#fff" }}
                      onClick={() => handleMenuClick(subitem.path)}
                    >
                      {subitem.title}
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
          {/* <Link href={"#"} key={9}> */}
          <div
            className={`flex-align menu_sec`}
            onClick={() => {
              Logout();
            }}
          >
            <div className={"rectangle"}>
              {<LogoutOutlined style={{ color: "#fff", fontSize: "20px" }} />}
            </div>
            <h6>Logout</h6>
          </div>
          {/* </Link> */}
        </nav>
      </div>
    </>
  );
}
