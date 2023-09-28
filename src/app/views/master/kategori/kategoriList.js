import React from "react";
import { Card, Button, Input, Table, Spin } from "antd";
import { get } from "../../../functions/helper";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export function KategoriList() {
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
      `master/?start=${dataRange.start}&end=${dataRange.end}&search=${search}&table=kbmi`
    );
    // add key to data
    data.rows = data.rows.map((item, index) => {
      item.key = index;
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
      title: "Urutan",
      dataIndex: "urutan",
      key: "urutan",
    },
    {
      title: "Aksi",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => history(`/setting/kategori/${text}`)}
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
          onClick={() => history("/setting/kategori/insert")}
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
      <Card>
        <Table
          columns={columns}
          dataSource={data.rows}
          onChange={onTableChange}
          pagination={{
            total: data.count,
          }}
        />
      </Card>
    </Spin>
  );
}
