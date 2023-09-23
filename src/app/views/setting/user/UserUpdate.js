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
import QueryString from "qs";

export function UserUpdate() {
  const [form] = Form.useForm();

  const params = useParams();
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [groupData, setGroupData] = useState([]);
  // eslint-disable-next-line
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    setIsLoading(true);

    await get(`/user/list/${params.id}`, {})
      .then(({ data: { data } }) => {
        setUserData(data);
        form.setFieldsValue({ nama: data.nama, group: data.aut_group_id });
        setIsLoading(false);
      })
      .catch((err) => {
        notification.error({ message: "Contact Administrator", duration: 2 });
        console.log(err);
        history("/setting/user/list");
      });

    await get(`/group/list/select`, {})
      .then(({ data }) => {
        let listData = [];
        data.data.rows.map((val, index) => {
          listData.push({
            key: index,
            id: val.id,
            nama: val.nama,
          });
          return true;
        });
        setGroupData(listData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    await put(
      `/user/updategroup/${params.id}`,
      QueryString.stringify({ nama: values.nama, aut_group_id: values.group })
    )
      .then(({ data }) => {
        notification.success({
          message: "Berhasil simpan data",
          placement: "top",
          duration: 2,
        });
        history("/setting/user/list");
      })
      .catch((err) => {
        console.log(err.response.data);
        let errMsg = "";
        if (err.response.data.code === 409) {
          errMsg = "Nama tidak unik";
        }
        notification.error({
          message: errMsg,
          placement: "top",
          duration: 2,
        });
      });

    setIsLoading(false);
  };

  const onDelete = async () => {
    await del(`/user/delete/${params.id}`, {})
      .then(({ data }) => {
        notification.success({
          message: "Berhasil hapus data",
          placement: "top",
          duration: 2,
        });
        history("/setting/user/list");
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Gagal",
          placement: "top",
          duration: 2,
        });
      });

    setIsLoading(false);
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
        Ubah User
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
            label="Nama"
            name="nama"
            rules={[{ required: true, message: "Form Nama harus diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Group"
            name="group"
            rules={[{ required: true, message: "Form Group harus diisi!" }]}
          >
            <Select showSearch style={{ width: 200 }}>
              {groupData.map((val) => (
                <Option key={val.key} value={val.id}>
                  {val.nama}
                </Option>
              ))}
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
      </Card>
    </Spin>
  );
}
