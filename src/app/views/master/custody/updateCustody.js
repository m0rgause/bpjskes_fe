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
} from "antd";

import {
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import QueryString from "qs";

export function CustodyUpdate() {
  const { id } = useParams();
  const history = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    const {
      data: { data, error },
    } = await get(`/master/bankCustody/${id}`, {});
    if (!error) {
      //   setData(data);
      form.setFieldsValue(data);
    } else {
      notification.error({
        message: "Error",
        description: "Data gagal diambil",
      });
      history("/setting/bank?tab=custody");
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const {
      data: { error },
    } = await put(`/master/bankCustody/${id}`, QueryString.stringify(values));
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil disimpan",
      });
      history("/setting/bank?tab=custody");
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
    } = await del(`/master/bankCustody/${id}`);
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil dihapus",
      });
      history("/setting/bank?tab=custody");
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
        Ubah Bank Custody
      </Typography.Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
