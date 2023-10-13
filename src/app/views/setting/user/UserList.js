import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, Table, Tag, Card } from "antd";
import { SearchOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import { get } from "../../../functions/helper";

export function UserList() {
  const history = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataRange, setDataRange] = useState({ start: 0, end: 9 });
  const [dataTotal, setDataTotal] = useState(0);
  const [dataSearch, setDataSearch] = useState("");

  const columns = [
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Group",
      dataIndex: "aut_group_nama",
      key: "aut_group.nama",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (text) => (
        <Tag
          color={text === 1 ? "green" : "red"}
          style={{ padding: 5 }}
          key={text}
        >
          {text === 1 ? "Aktif" : "Tidak Aktif"}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => history(`/setting/user/${text}`)}
        >
          Ubah
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [dataSearch, dataRange.start]);

  const getData = async () => {
    setIsLoading(true);
    await get(
      `/user/list?startRange=${dataRange.start}&endRange=${dataRange.end}&email=${dataSearch}`
    ).then(({ data }) => {
      let dataList = [];
      data.data.rows.map((row, index) => {
        dataList.push({
          key: index,
          id: row.id,
          email: row.email,
          nama: row.nama,
          is_active: parseInt(row.is_active),
          aut_group_nama: row.aut_group.nama,
        });
        return true;
      });

      setData(dataList);
      setDataTotal(data.data.count);
      setIsLoading(false);
    });
  };

  const onTableChange = (newPagination, filters, sorter) => {
    let startRange = (newPagination.current - 1) * newPagination.pageSize;
    let endRange = newPagination.current * newPagination.pageSize - 1;

    setDataRange({
      start: startRange,
      end: endRange,
    });
  };

  const onSearch = (text) => {
    setDataSearch(text);
    setDataRange({ start: 0, end: 9 });
  };

  return (
    <>
      <Typography.Title level={4} className="page-header">
        USER
      </Typography.Title>
      <div style={{ display: "flex" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history("/setting/user/insert")}
          style={{ marginBottom: 10 }}
        >
          Tambah
        </Button>

        <Input
          placeholder="Cari email"
          prefix={<SearchOutlined />}
          onChange={(event) => onSearch(event.target.value)}
          style={{
            maxWidth: "50%",
            width: 200,
            marginBottom: 10,
            marginLeft: "auto",
          }}
        />
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          onChange={onTableChange}
          bordered
          pagination={{
            total: dataTotal,
            showSizeChanger: false,
            hideOnSinglePage: true,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </>
  );
}
