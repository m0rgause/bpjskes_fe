import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  notification,
  Spin,
  Typography,
} from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { post } from "../../functions/helper";
import QueryString from "qs";
import logo from "../../../assets/images/Logo/BPJS.svg";

export function PassForgot() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  const onFinish = async (values) => {
    setIsLoading(true);
    await post(`/user/resetpassword`, QueryString.stringify(values))
      .then((res) => {
        notification.success({
          message: "Berhasil! Buka email untuk reset password!",
          placement: "top",
          duration: 2,
        });
      })
      .catch((error) => {
        notification.error({
          message: "Email tidak terdaftar!",
          placement: "top",
          duration: 2,
        });
      });

    setIsLoading(false);
  };
  const isMobile = window.innerWidth <= 768;
  return (
    <Spin spinning={isLoading}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card
          className="card"
          style={{
            width: isMobile ? "100%" : "25%",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              width: "65%",
              padding: "10px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <Form
            name="login"
            layout="vertical"
            style={{ margin: 20 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* <Typography.Title level={4}>Forgot Password</Typography.Title> */}
            <Form.Item
              label="Email"
              name="email"
              className="form-control"
              rules={[{ type: "email", required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                style={{ width: "100%" }}
                loading={isLoading}
              >
                Send Email
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="link"
                htmlType="button"
                onClick={() => history("/auth/signin")}
                style={{ width: "100%" }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  );
}
