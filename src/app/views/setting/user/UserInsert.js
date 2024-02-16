import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Form,
  Input,
  Button,
  notification,
  Spin,
  Select,
  Card,
} from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { get, post } from "../../../functions/helper";
import qs from "qs";

export function UserInsert() {
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [custodyData, setCustodyData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const {
      data: {
        data: { rows: groupData },
      },
    } = await get(`/group/list/select`);

    const {
      data: {
        data: { rows: custodyData },
      },
    } = await get(`/custody/select`);

    custodyData.map((val) => {
      val.key = val.id;
      return val;
    });

    groupData.map((val) => {
      val.key = val.id;
      return val;
    });

    setGroupData(groupData);
    setCustodyData(custodyData);
    setIsLoading(false);
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    await post(
      `/user/signup`,
      qs.stringify({
        is_active: 1,
        email: values.email,
        password: values.password,
        aut_group_id: values.group,
        nama: values.nama,
        mst_bank_custody_id: values.custody,
      })
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
        // console.log(err.response.data);
        let errMsg = "";
        if (err.response.data.code === 409) {
          errMsg = "Email tidak unik";
        } else if (err.response.data.code === 400) {
          errMsg = "Email tidak valid";
        }
        notification.error({
          message: errMsg,
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
        Tambah User
      </Typography.Title>
      <Card>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Form Email harus diisi!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="password"
            name="password"
            rules={[
              {
                required: true,
                message: "Form Password harus diisi",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
                      value
                    )
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Password must be combination of letters and numbers and special characters"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              onPaste={e=>{
                e.preventDefault();
                return false
              }}
            />
          </Form.Item>
          <Form.Item
            label="Bank Custody"
            name="custody"
            rules={[
              { required: true, message: "Form Bank Custody harus diisi!" },
            ]}
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
