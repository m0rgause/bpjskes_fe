import React from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../../../functions/helper";
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  Card,
  Spin,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import QueryString from "qs";

export function TWRRCOAInsert() {
  const history = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const tipe = ["assets", "liabilities"];

  const { Option } = Select;

  const onFinish = async (values) => {
    setLoading(true);
    const {
      data: { error },
    } = await post("twrr_coa", QueryString.stringify(values));
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil disimpan",
      });
      history("/setting/twrr_coa");
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
        Tambah TWRR COA
      </Typography.Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tipe"
            name="tipe"
            rules={[
              {
                required: true,
                message: "Tipe harus diisi",
              },
            ]}
          >
            <Select placeholder="Pilih Tipe">
              {tipe.map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kolom"
            name="kolom"
            rules={[
              {
                required: true,
                message: "Kolom harus diisi",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Label"
            name="label"
            rules={[
              {
                required: true,
                message: "Label harus diisi",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Urutan"
            name="urutan"
            rules={[
              {
                required: true,
                message: "Urutan harus diisi",
              },
            ]}
          >
            <Input type="number" min="0" max="999" />
          </Form.Item>
          <Form.Item
            label="Tampil"
            name="tampil"
            rules={[
              {
                required: true,
                message: "Tampil harus diisi",
              },
            ]}
          >
            <Select placeholder="Pilih Tampil">
              <Option value={true}>Show</Option>
              <Option value={false}>Hide</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Kolom XLS"
            name="kolom_xls"
            rules={[
              {
                required: true,
                message: "Kolom XLS harus diisi",
              },
            ]}
          >
            <Input />
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
