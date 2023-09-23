import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Typography, Input, Button, Table, Card } from "antd";
import { SearchOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { get } from "../../../functions/helper";
import QueryString from "qs";

export function AccessList() {
  const history = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataRange, setDataRange] = useState({ start: 0, end: 9 });
  const [dataTotal, setDataTotal] = useState(0);
  const [dataSearch, setDataSearch] = useState("");

  const columns = [
    {
      title: "Nama",
      dataIndex: ["pos", "title"],
      key: "title",
      render: (key, row) => (
        <>
          <p style={{ paddingLeft: row.pos * 30 }} key={key}>
            {row.title}
          </p>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => history(`/setting/access/${text}`)}
            >
              Ubah
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => history(`/setting/access_child/${text}`)}
            >
              Child
            </Button>
          </Space>
        </>
      ),
    },
  ];

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [dataSearch, dataRange.start]);

  const getData = async () => {
    setIsLoading(true);

    await get(`/access/list?title=${dataSearch}`, QueryString.stringify({}))
      .then(({ data }) => {
        let dataList = [];
        data.data.forEach((row) => {
          dataList.push({
            ...row,
            key: row.id,
          });
        });

        setData(dataList);
        setDataTotal(data.data.length);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const onSearch = (text) => {
    setDataSearch(text);
    setDataRange({ start: 0, end: 9 });
  };

  return (
    <>
      <Typography.Title level={4} className="page-header">
        Access
      </Typography.Title>

      <div style={{ display: "flex" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history("/setting/access_child/0")}
          style={{ marginBottom: 10 }}
        >
          Tambah
        </Button>

        <Input
          placeholder="Cari nama"
          prefix={<SearchOutlined />}
          onChange={(event) => onSearch(event.target.value)}
          style={{
            width: 200,
            maxWidth: "50%",
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
          pagination={{
            total: dataTotal,
            showSizeChanger: false,
            hideOnSinglePage: true,
          }}
          scroll={{ x: 500, y: 500 }}
        />
      </Card>
    </>
  );
}
