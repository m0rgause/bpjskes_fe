import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, notification, Spin } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { put, post } from "../../functions/helper";
import QueryString from "qs";
import logo from "../../../assets/images/Logo/BPJS.svg";

const useQuery = () => {
  let location = useLocation();
  return new URLSearchParams(location.search);
};

export function PassReset() {
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();
  const query = useQuery();

  useEffect(() => {
    if (!query.get("token")) {
      history("/auth/forgotpass");
    }
    checkToken();
    // eslint-disable-next-line
  }, []);

  const checkToken = async () => {
    await post(
      `/user/authToken`,
      QueryString.stringify({ token: query.get("token") })
    )
      .then((res) => {
        if (res.data.code === 200) {
          console.log("");
        } else {
          history("/auth/forgotpass");
        }
      })
      .catch((error) => {
        notification.error({
          message: "Gagal! silahkan verifikasi email anda!",
          placement: "top",
          duration: 2,
        });
        history("/auth/forgotpass");
      });
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    await put(
      `/user/changepassword`,
      QueryString.stringify({ ...values, token: query.get("token") })
    )
      .then((res) => {
        notification.success({
          message: "Berhasil! Silahkan login kembali!",
          placement: "top",
          duration: 2,
        });
        history("/auth/signin");
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Gagal! Silahkan verifikasi diri anda!",
          placement: "top",
          duration: 2,
        });
        history("/auth/forgotpass");
      });
    setIsLoading(false);
  };

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
        <Card className="card">
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
              label="Password Baru"
              name="newPass"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Konfirmasi Password Baru"
              name="confirmNewPass"
              rules={[
                { required: true, min: 6 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPass") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Konfirmasi Password tidak sama dengan Password Baru!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                style={{ width: "100%" }}
                loading={isLoading}
              >
                Simpan
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  );
}
