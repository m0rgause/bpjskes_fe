import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Layout, Menu, Typography } from "antd";
import logo from "../../assets/images/Logo/BPJS.svg";
import logoMobile from "../../assets/images/Logo/BPJSMobile.png";
import {
  // MenuFoldOutlined,
  // MenuUnfoldOutlined,
  UserOutlined,
  PoweroffOutlined,
  KeyOutlined,
  BellFilled,
  ClockCircleFilled,
} from "@ant-design/icons";
import qs from "qs";
import * as IconName from "@ant-design/icons";

import { useAuth } from "../context/Auth";
import { AppRoute } from "../routes/AppRoute";
import { post } from "../functions/helper";

export function AppLayout() {
  const history = useNavigate();
  const { user, signOut } = useAuth();
  const { Header, Sider, Content } = Layout;
  const [menuItems, setMenuItems] = useState([]);
  const [LoginName, setLoginName] = useState("Username");

  const IconMap = Object.keys(IconName).reduce((map, iconName) => {
    map[iconName] = IconName[iconName];
    return map;
  }, {});

  useEffect(() => {
    getMenuItem();
    // eslint-disable-next-line
  }, []);

  const getMenuItem = async () => {
    let email = user.email;
    post("/user/menu", qs.stringify({ email: email }))
      .then(({ data: { data } }) => {
        // reordering menu by urutan
        let access_list = data.aut_group.access_list.sort((a, b) => {
          return a.urutan - b.urutan;
        });

        setMenuItems(access_list);
        setLoginName(data.nama);
      })
      .catch(({ error }) => {
        console.log(error);
      });
  };

  const onSignOut = async () => {
    await signOut();
  };

  const onClickMenu = (path) => {
    history(path.keyPath[0]);
  };

  const IconWrapper = ({ icon }) => {
    const Icon = IconMap[icon] || null;
    return Icon ? <Icon /> : null;
  };

  const isMobile = window.innerWidth <= 768;
  const [collapsed, setCollapsed] = useState(isMobile);

  return (
    <Layout
      style={{
        minHeight: "98vh",
        padding: 0,
        margin: 0,
      }}
    >
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(e) => setCollapsed(e)}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={collapsed ? logoMobile : logo}
            alt="logo"
            style={{ height: 25 }}
          />
        </div>

        <Menu
          onClick={onClickMenu}
          defaultOpenKeys={
            isMobile
              ? []
              : ["/ckpn", "/porto", "/twrr", "/useraccess", "/setting"]
          }
          mode="inline"
        >
          {menuItems.map((item) => {
            let icon = item.icon.replace(/<|>|\/|\s/g, "");
            if (item.children) {
              return (
                <Menu.SubMenu
                  key={item.key}
                  title={item.label}
                  icon={<IconWrapper icon={icon} />}
                >
                  {item.children.map((child) => {
                    let subIcon = child.icon.replace(/<|>|\/|\s/g, "");
                    return (
                      <Menu.Item
                        key={child.key}
                        icon={<IconWrapper icon={subIcon} />}
                      >
                        {child.label}
                      </Menu.Item>
                    );
                  })}
                </Menu.SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.key} icon={<IconWrapper icon={icon} />}>
                  {item.label}
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </Sider>
      <Layout style={{ backgroundColor: "#F1F2F7" }}>
        <Header
          style={{
            backgroundColor: "white",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              height: "100%",
            }}
          >
            {!isMobile ? (
              <Typography.Title
                level={4}
                style={{
                  padding: 0,
                  margin: 0,
                  fontWeight: "600",
                  marginRight: "10px",
                }}
              >
                DASHBOARD MANAGEMENT SYSTEM
              </Typography.Title>
            ) : null}

            <div style={{ marginLeft: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="text"
                  icon={
                    <Badge
                      count={
                        <ClockCircleFilled
                          style={{ color: "#f5222d", fontSize: 10 }}
                        />
                      }
                      size="small"
                    >
                      <BellFilled />
                    </Badge>
                  }
                  onClick={() => history("/notification")}
                  style={{ marginRight: 10 }}
                />
                <Menu mode="horizontal">
                  <Menu.SubMenu
                    key="SubMenu"
                    title={LoginName}
                    icon={<UserOutlined />}
                  >
                    <Menu.Item
                      key="1"
                      icon={<KeyOutlined />}
                      onClick={() => history.push("/setting/user/resetpass")}
                    >
                      Reset Password
                    </Menu.Item>
                    <Menu.Item
                      key="2"
                      icon={<PoweroffOutlined />}
                      onClick={() => onSignOut()}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </div>
            </div>
          </div>
        </Header>
        <Content style={{ margin: 20 }}>
          <AppRoute />
        </Content>
      </Layout>
    </Layout>
  );
}
