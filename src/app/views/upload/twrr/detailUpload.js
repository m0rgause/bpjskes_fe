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

  React.useEffect(() => {
    getData();
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
    console.log(file);
    data = data.map((item, index) => {
      return {
        key: index,
        unique_id: item.unique_id,
        issuer: item.mst_issuer?.nama ?? "",
        kbmi: item.mst_kbmi?.nama ?? "",
        pengelolaan: item.mst_pengelolaan?.nama ?? "",
        tenor: item.mst_tenor?.nama ?? "",
        kepemilikan: item.mst_kepemilikan?.nama ?? "",
        no_security: item.no_security,
        tipe: item.tipe,
        start_date: item.start_date,
        end_date: item.end_date,
        nominal: item.nominal,
        interest_date: item.interest_date,
        sisa_tenor: item.sisa_tenor,
        rate: item.rate,
        pd: item.pd,
        lgd: item.lgd,
        ecl: item.ecl,
        status: item.status,
        note: item.note,
      };
    });
    setData(data);
    setFile(file);
    setLoading(false);
  };

  const columns = [
    {
      title: "Unique ID",
      dataIndex: "unique_id",
      key: "unique_id",
    },
    {
      title: "Issuer",
      dataIndex: "issuer",
      key: "issuer",
    },
    {
      title: "KBMI",
      dataIndex: "kbmi",
      key: "kbmi",
    },
    {
      title: "Pengelolaan",
      dataIndex: "pengelolaan",
      key: "pengelolaan",
    },
    {
      title: "Tenor",
      dataIndex: "tenor",
      key: "tenor",
    },
    {
      title: "Kepemilikan",
      dataIndex: "kepemilikan",
      key: "kepemilikan",
    },
    {
      title: "No Security",
      dataIndex: "no_security",
      key: "no_security",
    },
    {
      title: "Tipe",
      dataIndex: "tipe",
      key: "tipe",
    },
    {
      title: "Issued Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Maturity Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      render: (text) => {
        return <span>{text?.toLocaleString("id-ID") ?? 0}</span>;
      },
    },
    {
      title: "Interest Date",
      dataIndex: "interest_date",
      key: "interest_date",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Sisa Tenor",
      dataIndex: "sisa_tenor",
      key: "sisa_tenor",
    },
    {
      title: "Rate (%)",
      dataIndex: "rate",
      key: "rate",
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
      title: "ECL",
      dataIndex: "ecl",
      key: "ecl",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        return (
          <Tag color={text ? "green" : "red"}>
            {text ? "Success" : "Failed"}
          </Tag>
        );
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        <Button
          type="link"
          className="icon-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => history(-1)}
        />
        Detail File Porto
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
          dataSource={data}
          pagination={{
            hideOnSinglePage: true,
          }}
          scroll={{ x: 2500 }}
        />
      </Card>
    </Spin>
  );
}
