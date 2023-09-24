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
        },
        {
          title: "Cash",
          dataIndex: "cash",
          key: "cash",
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
        },
        {
          title: "Other",
          dataIndex: "other",
          key: "other",
        },
      ],
    },
    {
      title: "Total Sebelum External Cash",
      dataIndex: "total_sebelum_external_cash",
      key: "total_sebelum_external_cash",
    },
    {
      title: "Total Sesudah External Cash",
      dataIndex: "total_sesudah_external_cash",
      key: "total_sesudah_external_cash",
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
      date: "2019-03",
      adj_cash_flow: 2000,
      cash: 3000,
      liabilities: 0.5,
      custody_fee: 0.5,
      other: 0.5,
      total_sebelum_external_cash: 0.5,
      total_sesudah_external_cash: 0.5,
      return_harian: 0.5,
      return_akumulasi: 0.5,
    },
    {
      key: "2",
      aset: "Aset",
      date: "2019-04",
      adj_cash_flow: 2000,
      cash: 3000,
      liabilities: 0.5,
      custody_fee: 0.5,
      other: 0.5,
      total_sebelum_external_cash: 0.5,
      total_sesudah_external_cash: 0.5,
      return_harian: 0.5,
      return_akumulasi: 0.5,
    },
    {
      key: "3",
      aset: "Aset",
      date: "2019-05",
      adj_cash_flow: 2000,
      cash: 3000,
      liabilities: 0.5,
      custody_fee: 0.5,
      other: 0.5,
      total_sebelum_external_cash: 0.5,
      total_sesudah_external_cash: 0.5,
      return_harian: 0.5,
      return_akumulasi: 0.5,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Detail
      </Typography.Title>
      <Row gutter={[8, 8]}>
        <Col span={18}>
          <Card className="mb-1" style={{ minHeight: "175px" }}>
            <Row gutter={[8, 8]}>
              <Col span={2}>
                <Typography.Text strong>Period</Typography.Text>
              </Col>
              <Col span={22}>
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
              <Col span={2}>
                <Typography.Text strong>Bank</Typography.Text>
              </Col>
              <Col span={22}>
                <Select
                  defaultValue="mandiri"
                  options={[
                    { value: "mandiri", label: "Mandiri" },
                    { value: "bca", label: "BCA" },
                    { value: "bni", label: "BNI" },
                  ]}
                  style={{ minWidth: "300px" }}
                />
              </Col>
              <Col span={2}></Col>
              <Col span={22}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ minWidth: "300px" }}
                  onClick={onFilter}
                >
                  Filter
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ minHeight: "175px" }}>
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
        <Table columns={columns} dataSource={dataSource} className="mb-1" />
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
