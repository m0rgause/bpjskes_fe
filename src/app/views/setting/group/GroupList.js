import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Typography, Input, Button, Table, Card } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { get } from "../../../functions/helper";

export function GroupList() {
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
      title: "Landing",
      dataIndex: "landing",
      key: "landing",
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
              onClick={() => history(`/setting/group/${text}`)}
            >
              Ubah
            </Button>
            <Button
              block
              icon={<KeyOutlined />}
              onClick={() => history(`/setting/group/access/${text}`)}
              className="ml-3"
            >
              Access
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

    await get(
      `/group/list?nama=${dataSearch}&startRange=${dataRange.start}&endRange=${dataRange.end}`
    )
      .then(({ data }) => {
        let dataList = [];
        data.data.rows.map((row) => dataList.push({ ...row, key: row.id }));
        setData(dataList);
        setDataTotal(data.data.count);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
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
        Group
      </Typography.Title>

      <div style={{ display: "flex" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history("/setting/group/insert")}
          style={{ marginBottom: 10 }}
        >
          Tambah
        </Button>

        <Input
          placeholder="Cari nama"
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
