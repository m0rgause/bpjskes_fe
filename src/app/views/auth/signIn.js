import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, notification, Card } from "antd";
import { LoginOutlined, RedoOutlined } from "@ant-design/icons";
import captcha from "@bestdon/nodejs-captcha";

import logo from "../../../assets/images/Logo/BPJS.svg";
import { useAuth } from "../../context/Auth";

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const [newCaptcha, setNewCaptcha] = useState(captcha());
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
        // history(user.landing);
        window.location.href = user.landing;
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
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
                      value
                    )
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Password must be combination of letters and numbers and special characters"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              onPaste={e=>{
                e.preventDefault();
                return false
              }}
            />
          </Form.Item>
          <Form.Item
            label="Captcha"
            name="captcha"
            rules={[
              { required: true, message: "Please input the captcha you got!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value === newCaptcha.value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The captcha that you entered is incorrect!")
                  );
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={newCaptcha.image}
              alt="captcha"
              style={{ width: "150px", height: "75px" }}
            />
            <Button
              type="link"
              htmlType="button"
              onClick={() => {
                setNewCaptcha(captcha());
              }}
            >
              <b>
                <RedoOutlined />
              </b>
            </Button>
          </div>
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
              onClick={() => history("/auth/forgotpass")}
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
