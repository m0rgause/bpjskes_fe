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
  Select,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DualAxes } from "@ant-design/plots";

export function ExternalCash() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());

  const onFilter = () => {
    setLoading(true);
  };

  const uvBillData = [
    {
      time: "2019-03",
      value: 350,
      type: "Total Sebelum External Cash",
    },
    {
      time: "2019-04",
      value: 900,
      type: "Total Sebelum External Cash",
    },
    {
      time: "2019-05",
      value: 300,
      type: "Total Sebelum External Cash",
    },
    {
      time: "2019-06",
      value: 450,
      type: "Total Sebelum External Cash",
    },
    {
      time: "2019-07",
      value: 470,
      type: "Total Sebelum External Cash",
    },
    {
      time: "2019-03",
      value: 220,
      type: "Total Sesudah External Cash",
    },
    {
      time: "2019-04",
      value: 300,
      type: "Total Sesudah External Cash",
    },
    {
      time: "2019-05",
      value: 250,
      type: "Total Sesudah External Cash",
    },
    {
      time: "2019-06",
      value: 220,
      type: "Total Sesudah External Cash",
    },
    {
      time: "2019-07",
      value: 362,
      type: "Total Sesudah External Cash",
    },
  ];
  const transformData = [
    {
      time: "2019-03",
      count: 800,
    },
    {
      time: "2019-04",
      count: 600,
    },
    {
      time: "2019-05",
      count: 400,
    },
    {
      time: "2019-06",
      count: 380,
    },
    {
      time: "2019-07",
      count: 220,
    },
  ];

  const config = {
    data: [uvBillData, transformData],
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

  let dataSource = [
    {
      key: "1",
      periode: "1 Mei 2023",
      total_sebelum: 2000,
      total_sesudah: 3000,
      return_harian: 0.5,
    },
    {
      key: "2",
      periode: "2 Mei 2023",
      total_sebelum: 3000,
      total_sesudah: 4000,
      return_harian: 0.5,
    },
    {
      key: "3",
      periode: "3 Mei 2023",
      total_sebelum: 4000,
      total_sesudah: 5000,
      return_harian: 0.5,
    },
  ];

  const columns = [
    {
      title: "Periode",
      dataIndex: "periode",
      key: "periode",
    },
    {
      title: "Total Sebelum External Cash",
      dataIndex: "total_sebelum",
      key: "total_sebelum",
      align: "right",
      render: (text) => {
        return text.toLocaleString("id-ID");
      },
    },
    {
      title: "Total Sesudah External Cash",
      dataIndex: "total_sesudah",
      key: "total_sesudah",
      align: "right",
      render: (text) => {
        return text.toLocaleString("id-ID");
      },
    },
    {
      title: "Return Harian",
      dataIndex: "return_harian",
      key: "return_harian",
    },
  ];

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
              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Bank</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <Select
                  defaultValue="mandiri"
                  options={[
                    { value: "mandiri", label: "Mandiri" },
                    { value: "bca", label: "BCA" },
                    { value: "bni", label: "BNI" },
                  ]}
                  style={{ maxWidth: "300px", width: "100%" }}
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
              0.5%
            </Typography.Title>
          </Card>
        </Col>
      </Row>
      <Card className="mb-1">
        <DualAxes {...config} />
      </Card>
      <Card className="mb-1">
        <Table columns={columns} dataSource={dataSource} scroll={{ x: 500 }} />
        <Button
          type="primary"
          style={{
            backgroundColor: "#4ECB73",
          }}
          icon={<DownloadOutlined />}
        >
          Export Excel
        </Button>
      </Card>
    </Spin>
  );
}
