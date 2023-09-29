import React from "react";
import {
  Card,
  Table,
  DatePicker,
  Spin,
  Typography,
  Row,
  Col,
  Button,
  notification,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DualAxes } from "@ant-design/plots";
import { post } from "../../../functions/helper";
import QueryString from "qs";
import * as XLXS from "xlsx";

export function ExternalCash() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(
    dayjs().startOf("month")
  );
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());
  const [data, setData] = React.useState([]);
  const [totalAkumulasi, setTotalAkumulasi] = React.useState(0);
  const [dataChart, setDataChart] = React.useState({ data: [], uvBill: [] });

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const getData = async () => {
    setLoading(true);
    let eq = {
      start: filterStartDate.format("YYYY-MM-DD"),
      end: filterEndDate.format("YYYY-MM-DD"),
    };
    let {
      data: { data: externalCash },
    } = await post("/twrr/external-cash", QueryString.stringify(eq));
    externalCash.rows = externalCash.rows.map((item, index) => {
      item.key = index;
      return item;
    });

    setData(externalCash);
    setTotalAkumulasi(
      externalCash.rows[externalCash.rows.length - 1].return_akumulasi
    );
    setDataChart({
      data: transformData(externalCash),
      uvBill: uvBillData(externalCash),
    });

    setLoading(false);
  };

  const transformData = (data) => {
    let result = [];
    data.rows.forEach((element) => {
      result.push({
        time: dayjs(element.tanggal).format("DD MMM YYYY"),
        count: element.return_harian,
      });
    });
    return result;
  };

  const uvBillData = (data) => {
    let result = [];
    data.rows.forEach((element) => {
      result.push({
        time: dayjs(element.tanggal).format("DD MMM YYYY"),
        value: parseInt(element.total_before_cash),
        type: "Total Sebelum External Cash",
      });
      result.push({
        time: dayjs(element.tanggal).format("DD MMM YYYY"),
        value: parseInt(element.total_after_cash),
        type: "Total Sesudah External Cash",
      });
    });
    return result;
  };

  const config = {
    data: [dataChart.uvBill, dataChart.data],
    xField: "time",
    yField: ["value", "count"],
    geometryOptions: [
      {
        geometry: "column",
        isGroup: true,
        seriesField: "type",
        color: ["#FAD337", "#3AA0FF"],
        columnStyle: {
          radius: [10, 10, 0, 0],
        },
      },
      {
        geometry: "line",
        point: {
          shape: "circle",
          size: 4,
          style: {
            fill: "white",
            stroke: "#4ECB73",
            lineWidth: 2,
          },
        },
        color: "#4ECB73",
        smooth: true,
        lineStyle: { lineWidth: 2 },
      },
    ],
    legend: {
      position: "bottom",
    },
  };

  const columns = [
    {
      title: "Periode",
      dataIndex: "tanggal",
      key: "periode",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Total Sebelum External Cash",
      dataIndex: "total_before_cash",
      key: "total_sebelum",
      align: "right",
      render: (text) => {
        return parseInt(text).toLocaleString("id-ID");
      },
    },
    {
      title: "Total Sesudah External Cash",
      dataIndex: "total_after_cash",
      key: "total_after_cash",
      align: "right",
      render: (text) => {
        return parseInt(text).toLocaleString("id-ID");
      },
    },
    {
      title: "Return Harian",
      dataIndex: "return_harian",
      key: "return_harian",
      render: (text) => {
        // to percentage
        return text + "%";
      },
    },
  ];

  const onExport = async () => {
    let eq = {
      start: filterStartDate.format("YYYY-MM-DD"),
      end: filterEndDate.format("YYYY-MM-DD"),
    };
    let {
      data: { data: externalCash },
    } = await post("/twrr/external-cash", QueryString.stringify(eq));
    externalCash.rows = externalCash.rows.map((item, index) => {
      item.key = index;
      return item;
    });
    const fileName = `External Cash ${filterStartDate.format(
      "DD MMM YYYY"
    )} - ${filterEndDate.format("DD MMM YYYY")}`;
    const data = externalCash.rows.map((item) => {
      return {
        Periode: dayjs(item.tanggal).format("DD MMM YYYY"),
        "Total Sebelum External Cash": parseInt(
          item.total_before_cash
        ).toLocaleString("id-ID"),
        "Total Sesudah External Cash": parseInt(
          item.total_after_cash
        ).toLocaleString("id-ID"),
        "Return Harian": item.return_harian + "%",
        "Total Return Akumulasi": item.return_akumulasi + "%",
      };
    });
    const worksheet = XLXS.utils.json_to_sheet(data);
    const workbook = XLXS.utils.book_new();
    XLXS.utils.book_append_sheet(workbook, worksheet, "External Cash");
    XLXS.writeFile(workbook, `${fileName}.xlsx`);
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        External Cash
      </Typography.Title>
      <Row gutter={[8, 8]}>
        <Col span={isMobile ? 24 : 18}>
          <Card className="mb-1" style={{ minHeight: "175px" }}>
            <Row gutter={[8, 8]}>
              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Period</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <DatePicker
                  defaultValue={filterStartDate}
                  onChange={(date) => setfilterStartDate(date)}
                />{" "}
                -{" "}
                <DatePicker
                  defaultValue={filterEndDate}
                  onChange={(date) => setfilterEndDate(date)}
                />
              </Col>
              <Col span={isMobile ? 24 : 2}></Col>
              <Col span={22}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ maxWidth: "300px", width: "100%" }}
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
            style={{ minHeight: "175px" }}
            className={isMobile ? "mb-1" : ""}
          >
            <Typography.Title level={5} className="page-header">
              Total Return Akumulasi
            </Typography.Title>
            <Typography.Title level={3} className="page-header">
              {totalAkumulasi} %
            </Typography.Title>
          </Card>
        </Col>
      </Row>
      <Card className="mb-1">
        <DualAxes {...config} />
      </Card>
      <Card className="mb-1">
        <Table columns={columns} dataSource={data.rows} scroll={{ x: 500 }} />
        <Button
          type="primary"
          style={{
            backgroundColor: "#4ECB73",
          }}
          onClick={onExport}
          icon={<DownloadOutlined />}
        >
          Export Excel
        </Button>
      </Card>
    </Spin>
  );
}
