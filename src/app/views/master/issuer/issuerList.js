import React from "react";
import { Card, Button, Input, Table, Spin } from "antd";
import { get } from "../../../functions/helper";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export function IssuerList() {
  const history = useNavigate();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [dataRange, setDataRange] = React.useState({ start: 0, end: 9 });
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRange]);

  const onTableChange = (newPagination, filters, sorter) => {
    let startRange = (newPagination.current - 1) * newPagination.pageSize;
    let endRange = newPagination.current * newPagination.pageSize - 1;

    setDataRange({
      start: startRange,
      end: endRange,
    });
  };

  const getData = async () => {
    setLoading(true);
    const {
      data: { data },
    } = await get(
      `issuer/?start=${dataRange.start}&end=${dataRange.end}&search=${search}`
    );
    // add key to data
    data.rows = data.rows.map((item, index) => {
      item.key = index;
      item.rating = item.mst_rating.nama;
      return item;
    });

    setData(data);
    setLoading(false);
  };

  const onSearch = async (text) => {
    setLoading(true);
    setSearch(text);
    setDataRange({ start: 0, end: 9 });
  };

  const columns = [
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
    },
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "PD",
      dataIndex: "pd",
      key: "pd",
    },
    {
      title: "LGD",
      dataIndex: "lgd",
      key: "lgd",
    },
    {
      title: "Urutan",
      dataIndex: "urutan",
      key: "urutan",
    },
    {
      title: "Warna",
      dataIndex: "warna",
      key: "warna",
      render: (text) => (
        <Card style={{ backgroundColor: text, width: 50 }}></Card>
      ),
    },
    {
      title: "Aksi",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => history(`/setting/bank/${text}`)}
        >
          Ubah
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ display: "flex" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history("/setting/bank/insert")}
          style={{ marginBottom: 10 }}
        >
          Tambah
        </Button>

        <Input
          placeholder="Cari Nama"
          prefix={<SearchOutlined />}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            maxWidth: "50%",
            width: 200,
            marginBottom: 10,
            marginLeft: "auto",
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data.rows}
        onChange={onTableChange}
        pagination={{
          total: data.count,
        }}
      />
    </Spin>
  );
}
