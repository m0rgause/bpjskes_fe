import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { get, post } from "../../../functions/helper";
import qs from "qs";

export function AccessInsert() {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (parseInt(params.id) !== 0) {
      getData();
    }
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    setIsLoading(true);

    await get(`/access/list/${params.id}`, qs.stringify({})).then(
      ({ data }) => {
        form.setFieldsValue({
          parent: data.data.nama ?? "-",
        });
        setIsLoading(false);
      }
    );
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    let pid = params.id;

    await post(`/access/insert`, qs.stringify({ ...values, pid }))
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
          message: "Urutan sudah digunakan!",
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
        Tambah Access Child
      </Typography.Title>
      <Card>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item label="Parent" name="parent">
            <Input disabled={true} />
          </Form.Item>
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
            label="Path"
            name="path"
            rules={[
              {
                required: true,
                message: "Form Path harus diisi!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Icon"
            name="icon"
            rules={[
              {
                required: true,
                message: "Form Icon harus diisi!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Urutan"
            name="urutan"
            type="number"
            rules={[
              {
                required: true,
                message: "Form Urutan harus diisi!",
              },
              // {
              //   type: 'number',
              //   message: 'Form Urutan harus angka!',
              // },
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
