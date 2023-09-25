import React from "react";
import {
  Spin,
  Typography,
  Row,
  Col,
  DatePicker,
  Button,
  Select,
  Card,
  Table,
} from "antd";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";

export function DepositoPorto() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());

  const onFilter = () => {
    setLoading(true);
  };

  const isMobile = window.innerWidth <= 768;

  const dataChart = [
    { date: "2019-01-01", value: 100000000 },
    { date: "2019-02-01", value: 120000000 },
    { date: "2019-03-01", value: 110000000 },
    { date: "2019-04-01", value: 160000000 },
    { date: "2019-05-01", value: 90000000 },
  ];

  const config = {
    data: dataChart,
    xField: "date",
    yField: "value",
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

  const column = [
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "Tipe",
      dataIndex: "tipe",
      key: "tipe",
    },
    {
      title: "No. Bilyet",
      dataIndex: "no_bilyet",
      key: "no_bilyet",
    },
    {
      title: "Rate (%)",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "KBMI",
      dataIndex: "kbmi",
      key: "kbmi",
    },
    {
      title: "Tanggal Terbit",
      dataIndex: "tanggal_terbit",
      key: "tanggal_terbit",
    },
    {
      title: "Tanggal Jatuh Tempo",
      dataIndex: "tanggal_jatuh_tempo",
      key: "tanggal_jatuh_tempo",
    },
    {
      title: "Tenor",
      dataIndex: "tenor",
      key: "tenor",
    },
    {
      title: "Jangka Waktu",
      dataIndex: "jangka_waktu",
      key: "jangka_waktu",
    },
  ];

  const dataSource = [
    {
      period: "Maret 2021",
      bank: "Mandiri",
      tipe: "CD",
      no_bilyet: "1234/021",
      rate: "5.00",
      nominal: 100000000,
      currency: "IDR",
      kbmi: "KBMI4",
      tanggal_terbit: "2 Maret 2021",
      tanggal_jatuh_tempo: "1 April 2021",
      tenor: "1 Bulan",
      jangka_waktu: "30",
    },
    {
      period: "April 2021",
      bank: "Mandiri",
      tipe: "CD",
      no_bilyet: "1234/021",
      rate: "5.00",
      nominal: 100000000,
      currency: "IDR",
      kbmi: "KBMI4",
      tanggal_terbit: "1 April 2021",
      tanggal_jatuh_tempo: "1 Mei 2021",
      tenor: "1 Bulan",
      jangka_waktu: "30",
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Deposito
      </Typography.Title>

      <Card className="mb-1">
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
            <Typography.Text strong>Kategori</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue="kbmi4"
              options={[
                { value: "kbmi4", label: "Kbmi4" },
                { value: "kbmi5", label: "Kbmi5" },
                { value: "kbmi6", label: "Kbmi6" },
              ]}
              style={{ maxWidth: "300px", width: "100%" }}
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
                { value: "1", label: "1 Bulan" },
                { value: "3", label: "3 Bulan" },
              ]}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Kepemilikan</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue="bumn"
              options={[
                { value: "bumn", label: "BUMN" },
                { value: "swasta", label: "Swasta" },
                { value: "pemerintah", label: "Pemerintah" },
              ]}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Pengelolaan</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue="konvensional"
              options={[
                { value: "konvensional", label: "Konvensional" },
                { value: "syariah", label: "Syariah" },
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

      <Card className="mb-1">
        <Column {...config} />
      </Card>

      <Card className="mb-1">
        <Table dataSource={dataSource} columns={column} />
      </Card>
    </Spin>
  );
}
