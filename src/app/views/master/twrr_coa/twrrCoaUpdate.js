import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, put, del } from "../../../functions/helper";
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  Card,
  Spin,
  Typography,
  Space,
  Popconfirm,
} from "antd";

import {
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import QueryString from "qs";

export function TWRRCOAUpdate() {
  const { id } = useParams();
  const history = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  //   const [data, setData] = React.useState({});
  const tipe = ["assets", "liabilities"];

  const { Option } = Select;

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    const {
      data: { data, error },
    } = await get(`/twrr_coa/${id}`, {});
    if (!error) {
      //   setData(data);
      console.log(data);
      form.setFieldsValue(data);
    } else {
      notification.error({
        message: "Error",
        description: "Data gagal diambil",
      });
      history("/setting/twrr_coa");
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const {
      data: { error },
    } = await put(`/twrr_coa/${id}`, QueryString.stringify(values));
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

  const onDelete = async () => {
    setLoading(true);
    const {
      data: { error },
    } = await del(`/twrr_coa/${id}`);
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil dihapus",
      });
      history("/setting/twrr_coa");
    } else {
      notification.error({
        message: "Error",
        description: "Data gagal dihapus",
      });
    }
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
        Ubah TWRR COA
      </Typography.Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Tipe"
            name="tipe"
            rules={[{ required: true, message: "Tipe harus diisi" }]}
          >
            <Select>
              {tipe.map((item) => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kolom"
            name="kolom"
            rules={[{ required: true, message: "Kolom harus diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Label"
            name="label"
            rules={[{ required: true, message: "Label harus diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Urutan"
            name="urutan"
            rules={[{ required: true, message: "Urutan harus diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tampil"
            name="tampil"
            rules={[{ required: true, message: "Tampil harus diisi" }]}
          >
            <Select placeholder="Pilih Tampil">
              <Option value={true}>Show</Option>
              <Option value={false}>Hide</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Kolom XLS"
            name="kolom_xls"
            rules={[{ required: true, message: "Kolom XLS harus diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                className="btn-submit"
              >
                Simpan
              </Button>
              <Popconfirm
                title="Yakin ingin menghapus data ini?"
                onConfirm={onDelete}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button type="ghost" icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
}
