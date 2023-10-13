import React from "react";
import { Card, Button, Input, Table, Spin, Typography, Tag } from "antd";
import { get } from "../../../functions/helper";
import { PlusOutlined, SearchOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export function TWRRCOAList() {
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
      `twrr_coa/?start=${dataRange.start}&end=${dataRange.end}&search=${search}`
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
      title: "Tipe",
      dataIndex: "tipe",
      key: "tipe",
    },
    {
      title: "Kolom",
      dataIndex: "kolom",
      key: "kolom",
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Urutan",
      dataIndex: "urutan",
      key: "urutan",
    },
    {
      title: "Tampil",
      dataIndex: "tampil",
      key: "tampil",
      render: (text) => (
        <Tag color={text ? "green" : "red"}>{text ? "Show" : "Hide"}</Tag>
      ),
    },
    {
      title: "Kolom XLS",
      dataIndex: "kolom_xls",
      key: "kolom_xls",
    },
    {
      title: "Aksi",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => history(`/setting/twrr_coa/${text}`)}
        >
          Ubah
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        TWRR COA
      </Typography.Title>
      <div style={{ display: "flex" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history("/setting/twrr_coa/insert")}
          style={{ marginBottom: 10 }}
        >
          Tambah
        </Button>

        <Input
          placeholder="Cari Label"
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
          bordered
          pagination={{
            total: data.count,
          }}
        />
      </Card>
    </Spin>
  );
}
