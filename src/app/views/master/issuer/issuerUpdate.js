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

export function IssuerUpdate() {
  const { id } = useParams();
  const history = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [rating, setRating] = React.useState([]);

  const { Option } = Select;

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    const {
      data: { data: issuer, error: issuerError },
    } = await get(`issuer/${id}`, {});
    const {
      data: { data: rating, error: ratingError },
    } = await get("rating/select", {});
    if (!issuerError || !ratingError) {
      setRating(rating);
      form.setFieldsValue({
        rating: issuer.mst_rating.id,
        kode: issuer.kode,
        nama: issuer.nama,
        pd: issuer.pd,
        lgd: issuer.lgd,
        urutan: issuer.urutan,
        warna: issuer.warna,
      });
    } else {
      notification.error({
        message: "Error",
        description: "Data gagal diambil",
      });
      history("/setting/bank");
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const {
      data: { error },
    } = await put(`issuer/${id}`, QueryString.stringify(values));
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil disimpan",
      });
      history("/setting/bank");
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
    } = await del(`issuer/${id}`);
    if (!error) {
      notification.success({
        message: "Success",
        description: "Data berhasil dihapus",
      });
      history("/setting/bank");
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
        Ubah Issuer
      </Typography.Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[
              {
                required: true,
                message: "Rating harus diisi",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Pilih Rating"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {rating.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.nama}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kode"
            name="kode"
            rules={[
              {
                required: true,
                message: "Kode harus diisi",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            rules={[
              {
                required: true,
                message: "Nama harus diisi",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="PD (%)"
            name="pd"
            rules={[
              {
                required: true,
                message: "PD harus diisi",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="LGD (%)"
            name="lgd"
            rules={[
              {
                required: true,
                message: "LGD harus diisi",
              },
            ]}
          >
            <Input type="number" min="0" max="999" />
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
            label="Warna"
            name="warna"
            rules={[
              {
                required: true,
                message: "Warna harus diisi",
              },
            ]}
          >
            <Input
              type="color"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "none",
                padding: "0px",
                margin: "0px",
                outline: "none",
              }}
            />
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
