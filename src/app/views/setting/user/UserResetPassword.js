import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Form,
  Input,
  Button,
  notification,
  Spin,
  Card,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
// import { supabase } from "../../../config/supabase";
import { useAuth } from "../../../context/Auth";
import { post } from "../../../functions/helper";

export function UserResetPassword() {
  const history = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    let oldPassword = values.currPass;
    let newPassword = values.newPass;
    let confirmNewPassword = values.confirmNewPass;
    let email = user.email;

    await post("/user/changepassword2", {
      email,
      oldPassword,
      newPassword,
      confirmNewPassword,
    })
      .then((res) => {
        notification.success({
          message: "Berhasil! Password berhasil diubah!",
          placement: "top",
          duration: 2,
        });
        history("/setting/user/list");
      })
      .catch((error) => {
        notification.error({
          message: "Gagal! Password lama tidak sesuai!",
          placement: "top",
          duration: 2,
        });
      });
    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4} className="">
        Reset Password
      </Typography.Title>
      <Card className="card">
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Password Lama"
            name="currPass"
            rules={[
              {
                required: true,
                message: "Form Password Lama harus diisi",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Password Baru"
            name="newPass"
            // combination of letters and numbers and special characters
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
                      "Password must be combination of letters, numbers & special characters with minimum length of 8 characters"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Konfirmasi Password Baru"
            name="confirmNewPass"
            rules={[
              {
                required: true,
                message:
                  "Form Konfirmasi Password Baru harus diisi & minimal 8 karakter!",
                min: 6,
              },
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
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
}
