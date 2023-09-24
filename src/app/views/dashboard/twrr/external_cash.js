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
      periode: "2019-03",
      total_sebelum: 2000,
      total_sesudah: 3000,
      return_harian: 0.5,
    },
    {
      key: "2",
      periode: "2019-04",
      total_sebelum: 3000,
      total_sesudah: 4000,
      return_harian: 0.5,
    },
    {
      key: "3",
      periode: "2019-05",
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
    },
    {
      title: "Total Sesudah External Cash",
      dataIndex: "total_sesudah",
      key: "total_sesudah",
    },
    {
      title: "Return Harian",
      dataIndex: "return_harian",
      key: "return_harian",
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        External Cash
      </Typography.Title>
      <Row gutter={[10]} className="mb-1">
        <Col span={18}>
          <Card
            style={{
              minHeight: "150px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="p-filter">
              <label className="form-label">Periode :</label>
              <DatePicker
                defaultValue={filterStartDate}
                format={"DD-MM-YYYY"}
                onChange={(e) => {
                  setfilterStartDate(e);
                }}
                className="form-control"
              />
            </div>
            <div className="p-filter">
              <label className="form-label"></label>
              <DatePicker
                defaultValue={filterEndDate}
                format={"DD-MM-YYYY"}
                onChange={(e) => {
                  setfilterEndDate(e);
                }}
                className="form-control"
              />
            </div>
            <div className="p-filter">
              <label className="form-label">Bank</label>
              <Select
                defaultValue="mandiri"
                options={[
                  { value: "mandiri", label: "Mandiri" },
                  { value: "bca", label: "BCA" },
                  { value: "bni", label: "BNI" },
                ]}
                className="form-control"
              />
            </div>
            <div className="p-filter">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                className="form-control"
                onClick={onFilter}
              >
                Filter
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ minHeight: "150px" }}>
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
        <Table columns={columns} dataSource={dataSource} />
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
