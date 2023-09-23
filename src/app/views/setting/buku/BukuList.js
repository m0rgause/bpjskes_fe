import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Space,
  Typography,
  Col,
  Input,
  Button,
  Table,
  Tag,
  notification,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { supabase } from "../../../config/supabase";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export function BukuList() {
  const history = useHistory();
  const dateFormat = "DD-MM-YYYY";

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataRange, setDataRange] = useState({ start: 0, end: 9 });
  const [dataTotal, setDataTotal] = useState(0);
  const [dataSearch, setDataSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    // {
    //   title: 'Materi',
    //   dataIndex: ['id', 'materi'],
    //   key: 'materi',
    //   render: (text, row) => <p>{row['id']} {row['materi']}</p>,
    // },
    {
      title: "Judul",
      dataIndex: "judul",
      key: "judul",
    },
    {
      title: "Tanggal",
      dataIndex: "tanggal",
      key: "tanggal",
      render: (text) => (text ? moment(text).format(dateFormat) : ""),
    },
    {
      title: "Pengarang",
      dataIndex: "pengarang",
      key: "pengarang",
    },
    {
      title: "Approval",
      dataIndex: "approval",
      key: "approval",
      render: (text) => (
        <Tag
          color={text === 1 ? "" : "green"}
          style={{ padding: 5 }}
          key={text}
        >
          {text === 1 ? "Waiting" : "Approved"}
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
          onClick={() => history.push(`/setting/buku/${text}`)}
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
    let query = supabase
      .from("trx_buku")
      .select("id, judul, tanggal, pengarang, approval", { count: "exact" })
      .range(dataRange.start, dataRange.end)
      .order("judul", { ascending: true });

    if (dataSearch !== "") query = query.ilike("judul", `%${dataSearch}%`);

    const { data, count } = await query;

    let dataList = [];
    data.map((row) => dataList.push({ ...row, key: row.id }));

    setData(dataList);
    setDataTotal(count);
    setIsLoading(false);
  };

  const onTableChange = (newPagination, filters, sorter) => {
    let startRange = (newPagination.current - 1) * newPagination.pageSize;
    let endRange = newPagination.current * newPagination.pageSize - 1;

    setDataRange({
      start: startRange,
      end: endRange,
    });
  };

  const onTableSelect = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const onApprove = async (status) => {
    const { error } = await supabase
      .from("trx_buku")
      .update([{ approval: status }])
      .in("id", selectedRowKeys);

    if (error) {
      notification.error({ message: error.message, duration: 2 });
    } else {
      notification.success({ message: "Berhasil approve data", duration: 2 });
    }

    getData();
    setSelectedRowKeys([]);
    //setIsLoading(false)
  };

  const onSearch = (text) => {
    setDataSearch(text);
    setDataRange({ start: 0, end: 9 });
  };

  const onDownload = (rawData) => {
    const fileName = "buku";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

    let xlsData = [];
    rawData.forEach((row) => {
      xlsData.push({
        Judul: row.judul,
        Tanggal: moment(row.tanggal).format(dateFormat),
        Pengarang: row.pengarang,
        "Status Approval": row.approval === 1 ? "Waiting" : "Approved",
      });
    });

    const ws = XLSX.utils.json_to_sheet(xlsData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + ".xlsx");
  };

  return (
    <>
      <Typography.Title level={4}>Buku</Typography.Title>

      <div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push("/setting/buku/insert")}
          style={{ marginBottom: 10, float: "left" }}
        >
          Tambah
        </Button>

        <Input
          placeholder="Cari judul"
          prefix={<SearchOutlined />}
          onChange={(event) => onSearch(event.target.value)}
          style={{
            maxWidth: "50%",
            width: 200,
            marginBottom: 10,
            float: "right",
          }}
        />
      </div>

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
        rowSelection={onTableSelect}
        scroll={{ x: 1000 }}
      />

      {selectedRowKeys.length > 0 && (
        <Space style={{ marginTop: 10 }}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => onApprove(2)}
            style={{
              backgroundColor: "#f6ffed",
              borderColor: "#b7eb8f",
              color: "#389e0d",
            }}
          >
            Approve
          </Button>
          <Button
            type="ghost"
            icon={<QuestionCircleOutlined />}
            onClick={() => onApprove(1)}
          >
            Waiting
          </Button>
        </Space>
      )}

      <Col span={20}>
        <Button
          icon={<DownloadOutlined />}
          onClick={() => onDownload(data)}
          style={{
            marginTop: 10,
            backgroundColor: "green",
            borderColor: "white",
            color: "white",
          }}
        >
          Excel
        </Button>
      </Col>
    </>
  );
}
