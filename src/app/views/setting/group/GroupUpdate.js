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
  Card,
} from "antd";
import {
  SaveOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { get, put, del } from "../../../functions/helper";
import qs from "qs";

export function GroupUpdate() {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    setIsLoading(true);

    await get(`/group/list/${params.id}`, {})
      .then(({ data }) => {
        form.setFieldsValue({
          nama: data.data.nama,
          landing: data.data.landing,
        });
      })
      .catch((err) => {
        notification.error({
          message: err,
          placement: "top",
          duration: 2,
        });
        history("/setting/group/list");
      });
    setIsLoading(false);
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    await put(`/group/update/${params.id}`, qs.stringify(values))
      .then((res) => {
        notification.success({
          message: "Berhasil ubah data",
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

  const onDelete = async () => {
    setIsLoading(true);

    await del(`/group/delete/${params.id}`, {})
      .then((res) => {
        notification.success({
          message: "Berhasil hapus data",
          placement: "top",
          duration: 2,
        });
        history("/setting/group/list");
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

  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4} className="page-header">
        <Button
          type="link"
          className="icon-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => history(-1)}
        />
        Ubah Group
      </Typography.Title>
      <Card>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label=" Nama"
            name="nama"
            rules={[{ required: true, message: "Form Nama harus diisi!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Landing"
            name="landing"
            rules={[{ required: true, message: "Form Landing harus diisi!" }]}
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
