import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Spin,
  Typography,
  Form,
  Button,
  Space,
  Input,
  notification,
  Popconfirm,
  Select,
  Card,
} from "antd";
import {
  SaveOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import { del, get, put } from "../../../functions/helper";
import qs from "qs";

export function AccessUpdate() {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    setIsLoading(true);

    await get(`/access/list/${params.id}`, qs.stringify({}))
      .then(({ data }) => {
        form.setFieldsValue({
          pid: data.data.pid,
          kode: data.data.kode,
          nama: data.data.nama,
          path: data.data.path,
          icon: data.data.icon,
          urutan: data.data.urutan,
        });
      })
      .catch((err) => {
        notification.error({
          message: err.message,
          placement: "top",
          duration: 2,
        });
      });
    setIsLoading(false);

    let dataList = [];

    setData(dataList);

    setIsLoading(false);
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    await put(
      `/access/update/${params.id}`,
      qs.stringify({ id: params.id, ...values })
    )
      .then(({ data }) => {
        notification.success({
          message: "Berhasil simpan data",
          placement: "top",
          duration: 2,
        });
        history("/setting/access/list");
      })
      .catch((err) => {
        notification.error({
          message: err.response.data.message,
          placement: "top",
          duration: 2,
        });
      });

    setIsLoading(false);
  };

  const onDelete = async () => {
    setIsLoading(true);

    await del(`/access/delete/${params.id}`, qs.stringify({}))
      .then(({ data }) => {
        notification.success({
          message: "Berhasil hapus data",
          placement: "top",
          duration: 2,
        });
        history("/setting/access/list");
      })
      .catch(({ response }) => {
        notification.error({
          message: "Uncheck data dari Group Access terlebih dahulu!",
          placement: "top",
          duration: 2,
        });
        setIsLoading(false);
      });
  };

  const { Option } = Select;
  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4} className="page-header">
        <Button
          type="link"
          className="icon-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => history(-1)}
        />
        Ubah Access
      </Typography.Title>
      <Card>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item label="PID" name="pid">
            <Select showSearch style={{ width: 200 }}>
              <Option value="">No Parent</Option>
              {data.map((val) => (
                <Option value={val.id} style={{ paddingLeft: val.pos * 10 }}>
                  {val.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            rules={[{ required: true, message: "Form Nama harus diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Path"
            name="path"
            rules={[{ required: true, message: "Form Path harus diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Icon"
            name="icon"
            rules={[{ required: true, message: "Form Icon harus diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Urutan"
            name="urutan"
            rules={[{ required: true, message: "Form Urutan harus diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Simpan
              </Button>

              <Popconfirm
                title="Yakin menghapus data ini?"
                onConfirm={onDelete}
                okText="Ya"
                cancelText="Batal"
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
