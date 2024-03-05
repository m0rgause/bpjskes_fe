import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, put, del } from "../../../functions/helper";
import {
  Form,
  Input,
  Button,
  notification,
  Card,
  Spin,
  Typography,
  Space,
  Popconfirm,
  Select,
} from "antd";

import {
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import QueryString from "qs";

export function TenorUpdate() {
  const { id } = useParams();
  const history = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [tag, setTag] = React.useState([]);
  const dataTag = ["sbn", "sbi", "deposito", "obligasi"];

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    const {
      data: { data, error },
    } = await get(`/master/tenor/${id}`, {});
    if (data !== null && !error) {
      form.setFieldsValue({
        kode: data.kode,
        nama: data.nama,
        urutan: data.urutan,
        tipe: data.tipe.split(","),
      });
    } else {
      notification.error({
        message: "Error",
        description: "Data gagal diambil",
      });
      history("/setting/bank?tab=tenor");
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    values.tipe = tag.join(",");
    const {
      data: { error },
    } = await put(`/master/tenor/${id}`, QueryString.stringify(values));
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

  const onDelete = async () => {
    setLoading(true);
    const {
      data: { error },
    } = await del(`/master/tenor/${id}`);
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil dihapus",
      });
      history("/setting/bank?tab=tenor");
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
        Ubah Tenor
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
              onChange={(value) => setTag(value)}
            >
              {dataTag.map((item) => (
                <Select.Option key={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Urutan"
            name="urutan"
            rules={[{ required: true, message: "Urutan harus diisi" }]}
          >
            <Input type="number" min={1} max={99} />
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
