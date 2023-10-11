import React from "react";
import {
  Table,
  Upload,
  Button,
  Spin,
  Card,
  Tag,
  notification,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { put, post } from "../../../functions/helper";
import QueryString from "qs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export function ListUpload() {
  const history = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    const {
      data: { data: res },
    } = await post("/porto/file");

    const data = res.map((item, index) => {
      return {
        key: index,
        id: item.id,
        file_name: item.file_name,
        status: item.status,
        uploadTime: item.created_at,
      };
    });

    setData(data);

    setLoading(false);
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
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
      title: "Upload Time",
      dataIndex: "uploadTime",
      key: "uploadTime",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY HH:mm:ss");
      },
    },
    {
      title: "Detail",
      dataIndex: "detail",
      key: "detail",
      render: (text, record) => {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              history(`/upload/porto/${record.id}`);
            }}
          >
            Detail
          </Button>
        );
      },
    },
  ];

  const uploadFile = async (info) => {
    setLoading(true);
    const { file } = info;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      // send to backend
      await put(
        "/porto/upload",
        QueryString.stringify({ data: json, fileName: file.name })
      )
        .then(({ data: { data } }) => {
          // navigate to detail page
          notification.success({
            message: "Success",
            description: "Upload Success",
          });
          history(`/upload/porto/${data.trx_porto_file_id}`);
        })
        .catch((err) => {
          notification.error({
            message: "Error",
            description: "Upload Failed",
          });
        });
    };
    reader.readAsBinaryString(file);
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Typography.Title level={3} className="page-header">
        List Upload
      </Typography.Title>
      <Upload
        accept=".xls, .xlsx"
        onChange={uploadFile}
        showUploadList={false}
        beforeUpload={() => false}
      >
        <Button type="primary" icon={<UploadOutlined />} className="mb-1">
          Upload File
        </Button>
      </Upload>
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ hideOnSinglePage: true }}
        />
      </Card>
    </Spin>
  );
}
