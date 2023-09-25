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
import dayjs from "dayjs";

export function DetailTWRR() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());

  const onFilter = () => {
    setLoading(true);
  };

  const columns = [
    {
      title: "Aset",
      dataIndex: "aset",
      key: "aset",
      children: [
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
        },
        {
          title: "Adj. Cash Flow",
          dataIndex: "adj_cash_flow",
          key: "adj_cash_flow",
          align: "right",
          render: (text) => text.toLocaleString("id-ID"),
        },
        {
          title: "Cash",
          dataIndex: "cash",
          key: "cash",
          align: "right",
          render: (text) => text.toLocaleString("id-ID"),
        },
        {
          title: "Time Deposit",
          dataIndex: "time_deposit",
          key: "time_deposit",
          align: "right",
          render: (text) => text.toLocaleString("id-ID"),
        },
      ],
    },
    {
      title: "Liabilities",
      dataIndex: "liabilities",
      key: "liabilities",
      children: [
        {
          title: "Custody Fee",
          dataIndex: "custody_fee",
          key: "custody_fee",
          align: "right",
          render: (text) => text.toLocaleString("id-ID"),
        },
        {
          title: "Other",
          dataIndex: "other",
          key: "other",
          align: "right",
          render: (text) => text.toLocaleString("id-ID"),
        },
      ],
    },
    {
      title: "Total Sebelum External Cash",
      dataIndex: "total_sebelum_external_cash",
      key: "total_sebelum_external_cash",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
    {
      title: "Total Sesudah External Cash",
      dataIndex: "total_sesudah_external_cash",
      key: "total_sesudah_external_cash",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
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

  const dataSource = [
    {
      key: "1",
      aset: "Aset",
      date: "1 Mei 2023",
      adj_cash_flow: 520000000,
      cash: 938509992,
      custody_fee: 909840929,
      time_deposit: 909840929,
      other: 909840929,
      total_sebelum_external_cash: 909840929,
      total_sesudah_external_cash: 909840929,
      return_harian: 0.5,
      return_akumulasi: 0.3,
    },
    {
      key: "2",
      aset: "Aset",
      date: "2 Mei 2023",
      adj_cash_flow: 1293123908123,
      cash: 1293123908123,
      custody_fee: 1293123908123,
      time_deposit: 909840929,
      other: 1293123908123,
      total_sebelum_external_cash: 1293123908123,
      total_sesudah_external_cash: 1293123908123,
      return_harian: 0.1,
      return_akumulasi: 0.3,
    },
  ];

  const isMobile = window.innerWidth <= 768;

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Detail
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
