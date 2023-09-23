import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Form, Input, Button, notification, Spin } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabase";
import { useAuth } from "../../../context/Auth";

export function UserResetPassword() {
  const history = useHistory();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);

    const { session, error } = await supabase.auth.signIn({
      email: user.email,
      password: values.currPass,
    });
    if (error) {
      notification.error({
        message: "Password Lama tidak valid!",
        placement: "top",
        duration: 2,
      });
    } else {
      const { error: resetError } = await supabase.auth.api.updateUser(
        session.access_token,
        {
          password: values.newPass,
        }
      );

      if (error) {
        notification.error({
          message: resetError.message,
          placement: "top",
          duration: 2,
        });
      } else {
        notification.success({
          message: "Berhasil simpan data",
          placement: "top",
          duration: 2,
        });
        history.push("/setting/group/list");
      }
    }

    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4}>Reset Password</Typography.Title>

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
              message: "Form Password Lama harus diisi & minimal 6 karakter!",
              min: 6,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Password Baru"
          name="newPass"
          rules={[
            {
              required: true,
              message: "Form Password Baru harus diisi & minimal 6 karakter!",
              min: 6,
            },
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
                "Form Konfirmasi Password Baru harus diisi & minimal 6 karakter!",
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
    </Spin>
  );
}
