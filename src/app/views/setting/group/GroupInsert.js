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
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { post } from "../../../functions/helper";

export function GroupInsert() {
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);

    await post(`/group/insert`, values)
      .then((res) => {
        notification.success({
          message: "Berhasil simpan data",
          placement: "top",
          duration: 2,
        });
        history("/setting/group/list");
      })
      .catch((err) => {
        notification.error({
          message: "Nama tidak unik",
          placement: "top",
          duration: 2,
        });
      });

    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4} className="page-header">
        <Button
          type="link"
          className="icon-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => history(-1)}
        />
        Tambah Group
      </Typography.Title>
      <Card>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Nama"
            name="nama"
            rules={[
              {
                required: true,
                message: "Form Nama harus diisi!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Landing"
            name="landing"
            rules={[
              {
                required: true,
                message: "Form Landing harus diisi!",
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
      </Card>
    </Spin>
  );
}
