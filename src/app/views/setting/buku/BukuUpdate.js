import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Spin,
  Typography,
  Form,
  Button,
  Space,
  Input,
  notification,
  Popconfirm,
  DatePicker,
  Select,
} from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { supabase } from "../../../config/supabase";

export function BukuUpdate() {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const dateFormat = "DD-MM-YYYY";

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("trx_buku")
      .select("judul, tanggal, pengarang")
      .eq("id", params.id)
      .single();
    if (data) {
      let tanggal = data.tanggal ? data.tanggal : new Date();
      form.setFieldsValue({
        judul: data.judul,
        tanggal: moment(tanggal),
        pengarang: data.pengarang,
      });
    } else {
      notification.error({ message: error.message, duration: 2 });
      history.push("/setting/buku/list");
    }
    setIsLoading(false);
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("trx_buku")
      .update([
        {
          judul: values.judul,
          tanggal: moment(values.tanggal).format("YYYY-MM-DD"),
          pengarang: values.pengarang,
        },
      ])
      .eq("id", params.id);

    if (error) {
      notification.error({ message: error.message, duration: 2 });
    } else {
      notification.success({ message: "Berhasil ubah data", duration: 2 });
      history.push("/setting/buku/list");
    }
    setIsLoading(false);
  };

  const onDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase.from("buku").delete().eq("id", params.id);

    if (error) {
      notification.error({
        message: error.message,
        placement: "top",
        duration: 2,
      });
    } else {
      notification.success({
        message: "Berhasil hapus data",
        placement: "top",
        duration: 2,
      });
      history.push("/buku/list");
    }
    setIsLoading(false);
  };

  const { Option } = Select;
  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4}>Ubah Buku</Typography.Title>

      <Form
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="judul"
          name="judul"
          rules={[{ required: true, message: "Please input your judul!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tanggal"
          name="tanggal"
          rules={[{ required: true, message: "Please input your!" }]}
        >
          <DatePicker format={dateFormat} />
        </Form.Item>

        <Form.Item
          label="Pengarang"
          name="pengarang"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Select showSearch style={{ width: 200 }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
          </Select>
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
    </Spin>
  );
}
