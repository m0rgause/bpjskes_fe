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
  const [custodyData, setCustodyData] = useState([]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const {
      data: { data: userData },
    } = await get(`/user/list/${params.id}`);

    const {
      data: {
        data: { rows },
      },
    } = await get(`/group/list/select`);

    rows.map((val) => {
      val.key = val.id;
      return val;
    });

    const {
      data: {
        data: { rows: custody },
      },
    } = await get(`/custody/select`);
    custody.map((val) => {
      val.key = val.id;
      return val;
    });

    form.setFieldsValue({
      nama: userData.nama,
      group: userData.aut_group_id,
      custody: userData.mst_bank_custody_id,
    });

    setCustodyData(custody);
    setGroupData(rows);
    setIsLoading(false);
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
            label="Bank Custody"
            name="custody"
            rules={[{ required: true, message: "Form Custody harus diisi!" }]}
          >
            <Select style={{ width: 200 }}>
              {custodyData.map((val) => (
                <Option key={val.key} value={val.id}>
                  {val.nama}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Group"
            name="group"
            rules={[{ required: true, message: "Form Group harus diisi!" }]}
          >
            <Select style={{ width: 200 }}>
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
