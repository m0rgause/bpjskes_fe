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
  Select,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import QueryString from "qs";

export function TenorInsert() {
  const history = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [tag, setTag] = React.useState([]);
  const dataTag = ["sbn", "sbi", "deposito", "obligasi"];

  const onFinish = async (values) => {
    setLoading(true);
    values.tipe = tag.join(",");
    const {
      data: { error },
    } = await post("/master/tenor", QueryString.stringify(values));
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil disimpan",
      });
      history("/setting/bank?tab=tenor");
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
        Tambah Tenor
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
            label="Tipe"
            name="tipe"
            rules={[{ required: true, message: "Tipe harus diisi" }]}
          >
            {/* Multiple */}
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Pilih tipe"
              onChange={(value) => {
                setTag(value);
              }}
            >
              {dataTag.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
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
