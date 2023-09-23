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
  Select,
} from "antd";
import { SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabase";

export function AccessUpdate() {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataTotal, setDataTotal] = useState([]);
  const dateFormat = "DD-MM-YYYY";

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("aut_access")
      .select("pid, nama, path,icon,urutan,urutan_path")
      .eq("id", params.id)
      .single();
    if (data) {
      form.setFieldsValue({
        pid: data.pid,
        nama: data.nama,
        path: data.path,
        icon: data.icon,
        urutan: data.urutan,
        urutan_path: data.urutan_path,
      });
    } else {
      notification.error({ message: error.message, duration: 2 });
      history.push("/setting/access/list");
    }

    let query = supabase.rpc("aut_access_tree").eq("pos", 0);

    const { data: dataTree, count } = await query;

    let dataList = [];
    dataTree.map((row) => dataList.push({ ...row, key: row.id }));
    setData(dataList);
    setDataTotal(count);

    setIsLoading(false);
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    let isValid = true;

    //change pid
    const { data: dataOld, error } = await supabase
      .from("aut_access")
      .select("pid, nama, path,icon,urutan,urutan_path")
      .eq("id", params.id)
      .single();

    if (values.pid) {
      if (dataOld.pid != values.pid) {
        const {
          data: dataCount,
          error,
          count,
        } = await supabase
          .from("aut_access")
          .select("id", { count: "exact" })
          .eq("pid", values.pid)
          .eq("urutan", values.urutan);

        if (count !== 0) {
          notification.error({
            message: "Urutan sudah digunakan",
            duration: 2,
          });
          isValid = false;
        }

        if (isValid) {
          const { data: dataParent, error } = await supabase
            .from("aut_access")
            .select("urutan_path")
            .eq("id", values.pid)
            .single();

          let urutan_path = dataParent.urutan_path + "-" + values.urutan;

          const { data: update, error: errUpdate } = await supabase
            .from("aut_access")
            .update([
              {
                pid: values.pid == 0 ? null : values.pid,
                nama: values.nama,
                path: values.path,
                icon: values.icon,
                urutan: values.urutan,
                urutan_path: urutan_path,
              },
            ])
            .eq("id", params.id);

          if (error) {
            notification.error({ message: errUpdate.message, duration: 2 });
          } else {
            const { data: dataChild, error: errDataChild } = await supabase
              .from("aut_access")
              .select("id,urutan")
              .eq("pid", params.id);

            dataChild.map(async (val) => {
              let urutan_path_child = urutan_path + "-" + val.urutan;

              const { data: updateChild, error: errUpdateChild } =
                await supabase
                  .from("aut_access")
                  .update([
                    {
                      urutan_path: urutan_path_child,
                    },
                  ])
                  .eq("id", val.id);
            });

            if (error) {
              notification.error({ message: errUpdate.message, duration: 2 });
            } else {
              notification.success({
                message: "Berhasil ubah data",
                duration: 2,
              });
              history.push("/setting/access/list");
            }
          }
        }
      } else {
        const { data: update, error: errUpdate } = await supabase
          .from("aut_access")
          .update([
            {
              nama: values.nama,
              path: values.path,
              icon: values.icon,
              urutan: values.urutan,
              urutan_path: values.urutan_path,
            },
          ])
          .eq("id", params.id);

        if (error) {
          notification.error({ message: errUpdate.message, duration: 2 });
        } else {
          notification.success({ message: "Berhasil ubah data", duration: 2 });
          history.push("/setting/access/list");
        }
      }
    } else {
      //validate
      const {
        data: checkUrutan,
        error: errUrutan,
        count,
      } = await supabase
        .from("aut_access")
        .select("urutan_path", { count: "exact" })
        .eq("pid", null)
        .eq("urutan_path  ", values.urutan);

      if (count) {
        notification.error({ message: "Urutan sudah digunakan", duration: 2 });
      } else {
        const { data: update, error: errUpdate } = await supabase
          .from("aut_access")
          .update([
            {
              pid: values.pid == 0 && null,
              nama: values.nama,
              path: values.path,
              icon: values.icon,
              urutan: values.urutan,
              urutan_path: values.urutan,
            },
          ])
          .eq("id", params.id);

        if (error) {
          notification.error({ message: errUpdate.message, duration: 2 });
        } else {
          notification.success({ message: "Berhasil ubah data", duration: 2 });
          history.push("/setting/access/list");
        }
      }
    }

    setIsLoading(false);
  };

  const onDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("aut_access")
      .delete()
      .eq("id", params.id);

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
      history.push("/setting/access/list");
    }
    setIsLoading(false);
  };

  const { Option } = Select;
  return (
    <Spin spinning={isLoading}>
      <Typography.Title level={4}>Ubah Access</Typography.Title>

      <Form
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.Item label="PID" name="pid">
          <Select showSearch style={{ width: 200 }}>
            <Option value="0">No Parent</Option>
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
              judul="Yakin menghapus data ini?"
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
