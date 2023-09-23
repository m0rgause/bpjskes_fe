import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, notification, Card } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import logo from "../../../assets/images/Logo/BPJS.svg";

import { useAuth } from "../../context/Auth";

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const history = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    await signIn(values)
      .then((user) => {
        // Handle successful sign-in here
        notification.success({
          message: "Berhasil login",
          placement: "top",
          duration: 2,
        });

        history(user.landing);
      })
      .catch((error) => {
        // Handle sign-in error here
        notification.error({
          message: "Email atau password salah",
          placement: "top",
          duration: 2,
        });
      });
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Card
        className="card"
        style={{
          width: "600px",
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
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              style={{ width: "100%" }}
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              htmlType="button"
              onClick={() => history.push("/auth/forgotpass")}
              style={{ width: "100%" }}
            >
              Forgot Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
