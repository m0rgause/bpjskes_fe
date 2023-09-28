import React from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../functions/helper";
import {
  Form,
  Input,
  Button,
  notification,
  Card,
  Spin,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import QueryString from "qs";

export function PengelolaanInsert() {
  const history = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const {
      data: { error },
    } = await post("master/pengelolaan", QueryString.stringify(values));
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil disimpan",
      });
      history("/setting/bank?tab=pengelolaan");
    } else {
      notification.error({
        message: "Error",
        description: "Data gagal disimpan",
      });
    }
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        <Button
          type="link"
          className="icon-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => history(-1)}
        />
        Tambah Pengelolaan
      </Typography.Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Kode"
            name="kode"
            rules={[{ required: true, message: "Kode harus diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            rules={[{ required: true, message: "Nama harus diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Urutan"
            name="urutan"
            rules={[{ required: true, message: "Urutan harus diisi" }]}
          >
            <Input type="number" min={1} max={99} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
}
