import React from "react";
import {
  Card,
  Table,
  Spin,
  Typography,
  Row,
  Col,
  DatePicker,
  Button,
  notification,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { post } from "../../../functions/helper";
import QueryString from "qs";
import * as XLSX from "xlsx";

export function DetailTWRR() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(
    dayjs().startOf("month")
  );
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    let eq = {
      start: filterStartDate.format("YYYY-MM-DD"),
      end: filterEndDate.format("YYYY-MM-DD"),
    };
    let {
      data: { data },
    } = await post("/twrr/detail", QueryString.stringify(eq));

    setData(data);
    setLoading(false);
  };

  const onFilter = () => {
    if (filterStartDate.isAfter(filterEndDate)) {
      notification.error({
        message: "Tanggal awal tidak boleh lebih besar dari tanggal akhir",
      });
      return;
    } else {
      getData();
    }
  };

  let total_return_akumulasi =
    data?.data?.rows[data?.data?.rows?.length - 1]?.return_akumulasi ?? 0;

  let assets =
    data.dataCol?.rows?.filter((item) => item.tipe === "assets") || [];
  let liabilities =
    data.dataCol?.rows?.filter((item) => item.tipe === "liabilities") || [];

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
    },
    {
      title: "Return Akumulasi (%)",
      dataIndex: "return_akumulasi",
      key: "return_akumulasi",
    },
  ];

  const dataSource = [];
  data?.data?.rows?.forEach((item, index) => {
    item.key = index;
    dataSource.push(item);
  });

  const onExport = async () => {
    const fileName = `Detail TWRR ${filterStartDate.format(
      "DD MMM YYYY"
    )} - ${filterEndDate.format("DD MMM YYYY")}`;

    const data = dataSource.map((item) => {
      return {
        Tanggal: dayjs(item.tanggal).format("DD MMM YYYY"),
        ...assets?.reduce((acc, curr) => {
          acc[curr.label] = item[curr.kolom]
            ? Number(item[curr.kolom]).toLocaleString("id-ID")
            : 0;
          return acc;
        }, {}),
        ...liabilities?.reduce((acc, curr) => {
          acc[curr.label] = item[curr.kolom]
            ? Number(item[curr.kolom]).toLocaleString("id-ID")
            : 0;
          return acc;
        }, {}),
        "Total Sebelum External Cash": item.total_before_cash
          ? Number(item.total_before_cash).toLocaleString("id-ID")
          : 0,
        "Total Sesudah External Cash": item.total_after_cash
          ? Number(item.total_after_cash).toLocaleString("id-ID")
          : 0,
        "Return Harian (%)": item.return_harian + "%",
        "Return Akumulasi (%)": item.return_akumulasi + "%",
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Detail TWRR");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Detail
      </Typography.Title>
      <Row gutter={[8, 8]}>
        <Col span={isMobile ? 24 : 18}>
          <Card
            className="mb-1"
            style={{
              minHeight: "115px",
            }}
          >
            <Row gutter={[8, 8]}>
              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Period</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <DatePicker
                    defaultValue={filterStartDate}
                    onChange={(date) => setfilterStartDate(date)}
                  />{" "}
                  -{" "}
                  <DatePicker
                    defaultValue={filterEndDate}
                    onChange={(date) => setfilterEndDate(date)}
                  />
                </div>
              </Col>
              <Col span={isMobile ? 24 : 2}></Col>
              <Col span={isMobile ? 24 : 22}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ maxWidth: "300px", width: "100%", marginLeft: 10 }}
                  onClick={onFilter}
                >
                  Filter
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={isMobile ? 24 : 6}>
          <Card
            style={{ minHeight: "120px" }}
            className={isMobile ? "mb-1" : ""}
          >
            <Typography.Title level={5} className="page-header">
              Total Return Akumulasi
            </Typography.Title>
            <Typography.Title
              level={3}
              className="page-header"
              style={{
                marginTop: "0",
                marginBottom: "0",
              }}
            >
              {total_return_akumulasi} %
            </Typography.Title>
          </Card>
        </Col>
      </Row>
      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          className="mb-1"
          scroll={{ x: 2500 }}
          bordered
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "#4ECB73",
          }}
          icon={<DownloadOutlined />}
          onClick={onExport}
        >
          Export Excel
        </Button>
      </Card>
    </Spin>
  );
}
