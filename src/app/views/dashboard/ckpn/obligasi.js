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
  Select,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";

export function ObligasiCKPN() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());

  const onFilter = () => {
    setLoading(true);
  };

  const isMobile = window.innerWidth <= 768;

  const dataChart = [
    { tanggal: "2021-01-01", return: 3000 },
    { tanggal: "2021-01-02", return: 20000 },
    { tanggal: "2021-01-03", return: 30000 },
    { tanggal: "2021-01-04", return: 10000 },
  ];

  const config = {
    data: dataChart,
    xField: "tanggal",
    yField: "return",
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      tanggal: { alias: "Tanggal" },
      return: { alias: "Return" },
    },
    minColumnWidth: isMobile ? 24 : 100,
    maxColumnWidth: isMobile ? 24 : 100,
    color: () => {
      return "#3AA0FF";
    },
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
  };

  const columns = [
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Counterpart",
      dataIndex: "counterpart",
      key: "counterpart",
    },
    {
      title: "Principal",
      dataIndex: "principal",
      key: "principal",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
    {
      title: "Sisa Tenor (days)",
      dataIndex: "sisa_tenor",
      key: "sisa_tenor",
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
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
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
  ];

  const dataSource = [
    {
      key: "1",
      period: "Mei 2023",
      id: "Bunga Deposito Berjangka",
      counterpart: "Bank Mandiri",
      principal: 100000000,
      sisa_tenor: 100,
      due_date: "1 Mei 2023",
      lgd: "0.5%",
      ecl: 25030,
    },
    {
      key: "2",
      period: "Mei 2023",
      id: "Bunga Deposito Berjangka",
      counterpart: "Bank BCA",
      principal: 100000000,
      sisa_tenor: 100,
      due_date: "1 Mei 2023",
      lgd: "0.5%",
      ecl: 25030,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Obligasi
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
              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Tenor</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <Select
                  defaultValue="all"
                  options={[
                    { value: "all", label: "Semua" },
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3" },
                  ]}
                  style={{ maxWidth: "300px", width: "100%" }}
                />
              </Col>
              <Col span={isMobile ? 24 : 2}></Col>
              <Col span={isMobile ? 24 : 22}>
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
          <Card style={{ minHeight: "175px" }}>
            <Typography.Title level={5} className="page-header">
              Total ECL
            </Typography.Title>
            <Typography.Title level={3} className="page-header">
              0.5%
            </Typography.Title>
          </Card>
        </Col>
      </Row>

      <Card className="mb-1">
        <Column {...config} />
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          className="mb-1"
          scroll={{ x: 1000 }}
        />
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
