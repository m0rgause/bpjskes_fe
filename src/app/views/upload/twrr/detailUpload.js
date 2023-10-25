import React from "react";
import { Table, Button, Spin, Card, Tag, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { post } from "../../../functions/helper";
import dayjs from "dayjs";

export function DetailUploadTWRR() {
  const params = useParams();
  const history = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [file, setFile] = React.useState({});
  const [twrrCoa, setTwrrCoa] = React.useState([]);

  React.useEffect(() => {
    getData();
    getTwrrCoa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    let {
      data: {
        data: { data, file },
      },
    } = await post("/twrr/file/detail", {
      id: params.id,
    });
    setData(data);
    setFile(file);
    setLoading(false);
  };

  const getTwrrCoa = async () => {
    setLoading(true);
    let {
      data: { data },
    } = await post("/twrr/list-kolom");

    setTwrrCoa(data);
    setLoading(false);
  };

  let assets = twrrCoa.rows?.filter((item) => item.tipe === "assets") || [];
  let liabilities =
    twrrCoa.rows?.filter((item) => item.tipe === "liabilities") || [];

  const columns = [
    {
      title: "Aset",
      dataIndex: "aset",
      key: "aset",
      children: [
        {
          title: "Date",
          dataIndex: "tanggal",
          key: "tanggal",
          render: (text) => dayjs(text).format("DD MMM YYYY"),
        },
        ...assets?.map((item) => {
          return {
            title: item.label,
            dataIndex: item.kolom,
            key: item.kolom,
            align: "right",
            render: (text) => (text ? Number(text).toLocaleString("id-ID") : 0),
          };
        }),
      ],
    },
    {
      title: "Liabilities",
      dataIndex: "liabilities",
      key: "liabilities",
      children: [
        ...liabilities?.map((item) => {
          return {
            title: item.label,
            dataIndex: item.kolom,
            key: item.kolom,
            align: "right",
            render: (text) => (text ? Number(text).toLocaleString("id-ID") : 0),
          };
        }),
      ],
    },
    {
      title: "Total Sebelum External Cash",
      dataIndex: "total_before_cash",
      key: "total_before_cash",
      align: "right",
      render: (text) => (text ? Number(text).toLocaleString("id-ID") : 0),
    },
    {
      title: "Total Sesudah External Cash",
      dataIndex: "total_after_cash",
      key: "total_after_cash",
      align: "right",
      render: (text) => (text ? Number(text).toLocaleString("id-ID") : 0),
    },
    {
      title: "Return Harian (%)",
      dataIndex: "return_harian",
      key: "return_harian",
      render: (text) => {
        return text?.toFixed(2) + "%";
      },
    },
    {
      title: "Return Akumulasi (%)",
      dataIndex: "return_akumulasi",
      key: "return_akumulasi",
      render: (text) => {
        return text?.toFixed(2) + "%";
      },
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return text ? (
          <Tag color="green">Success</Tag>
        ) : (
          <Tag color="red">Failed</Tag>
        );
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  const dataSource = [];
  data?.forEach((item, index) => {
    item.key = index;
    dataSource.push(item);
  });

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        <Button
          type="link"
          className="icon-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => history(-1)}
        />
        Detail File TWRR
      </Typography.Title>
      <Card className="mb-1">
        <table className="table">
          <tr>
            <td style={{ width: "100px" }}>File Name</td>
            <td style={{ textAlign: "center" }}>:</td>
            <td>{file.file_name}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td style={{ textAlign: "center" }}>:</td>
            <td>
              <Tag color={file.status ? "green" : "red"}>
                {file.status ? "Success" : "Failed"}
              </Tag>
            </td>
          </tr>
          <tr>
            <td>Upload Time</td>
            <td style={{ textAlign: "center" }}>:</td>
            <td>{dayjs(file.created_at).format("DD MMM YYYY HH:mm:ss")}</td>
          </tr>
        </table>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            hideOnSinglePage: true,
          }}
          scroll={{ x: 3000 }}
          bordered
        />
      </Card>
    </Spin>
  );
}
