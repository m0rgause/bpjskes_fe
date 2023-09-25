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

export function ObligasiPorto() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());

  const onFilter = () => {
    setLoading(true);
  };

  const isMobile = window.innerWidth <= 768;

  const dataChart = [
    { tanggal: "Mei 2021", return: 3000 },
    { tanggal: "Mei 2022", return: 20000 },
    { tanggal: "Mei 2023", return: 30000 },
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
      return "#FAD337";
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
      title: "Security Name",
      dataIndex: "securityName",
      key: "securityName",
    },
    {
      title: "Security Code",
      dataIndex: "securityCode",
      key: "securityCode",
    },
    {
      title: "Tgl Issued",
      dataIndex: "tglIssued",
      key: "tglIssued",
    },
    {
      title: "Tgl Maturity",
      dataIndex: "tglMaturity",
      key: "tglMaturity",
    },
    {
      title: "Face Value",
      dataIndex: "faceValue",
      key: "faceValue",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
    {
      title: "KBMI",
      dataIndex: "kbmi",
      key: "kbmi",
    },
    {
      title: "Rate (%pa)",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Mkt Price (%)",
      dataIndex: "mktPrice",
      key: "mktPrice",
    },
    {
      title: "Mkt Value",
      dataIndex: "mktValue",
      key: "mktValue",
    },
  ];

  const dataSource = [
    {
      key: "1",
      period: "Mei 2021",
      securityName: "SUN 2021",
      securityCode: "SUN 2021",
      tglIssued: "21/05/2021",
      tglMaturity: "21/05/2021",
      faceValue: 100000000,
      kbmi: "KBMI 4",
      rate: "5.00%",
      mktPrice: 99902,
      mktValue: 99902,
    },
    {
      key: "1",
      period: "Mei 2021",
      securityName: "SUN 2021",
      securityCode: "SUN 2021",
      tglIssued: "21/05/2021",
      tglMaturity: "21/05/2021",
      faceValue: 100000000,
      kbmi: "KBMI 4",
      rate: "5.00%",
      mktPrice: 99902,
      mktValue: 99902,
    },
    {
      key: "1",
      period: "Mei 2021",
      securityName: "SUN 2021",
      securityCode: "SUN 2021",
      tglIssued: "21/05/2021",
      tglMaturity: "21/05/2021",
      faceValue: 100000000,
      kbmi: "KBMI 4",
      rate: "5.00%",
      mktPrice: 99902,
      mktValue: 99902,
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
                  ]}
                  style={{ maxWidth: "300px", width: "100%" }}
                />
              </Col>
              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Pengelolaan</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <Select
                  defaultValue="swasta"
                  options={[
                    { value: "swasta", label: "Swasta" },
                    { value: "pemerintah", label: "Pemerintah" },
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
