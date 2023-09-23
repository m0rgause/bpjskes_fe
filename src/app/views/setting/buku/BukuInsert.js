import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Form, Input, Button, notification, Spin } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabase";

export function BukuInsert() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    const { error } = await supabase.from("trx_buku").insert([
      {
        judul: values.judul,
      },
    ]);

    if (error) {
      notification.error({
        message: error.message,
        placement: "top",
        duration: 2,
      });
    } else {
      notification.success({
        message: "Berhasil simpan data",
        placement: "top",
        duration: 2,
      });
      history.push("/setting/buku/list");
    }
    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4}>Tambah Buku</Typography.Title>

      <Form
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="judul"
          name="judul"
          rules={[
            {
              required: true,
              message: "Please input!",
            },
          ]}
        >
          <Input />
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
