import React from "react";
import {
  Card,
  Table,
  Spin,
  Typography,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export function DetailCKPN() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());
  const isMobile = window.innerWidth <= 768;
  const onFilter = () => {
    setLoading(true);
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
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
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
      title: "PD",
      dataIndex: "pd",
      key: "pd",
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
      period: "1 Mei 2023",
      id: "Bunga Deposito Berjangka",
      counterpart: "Bank Mandiri",
      nominal: 100000000,
      principal: 100000000,
      sisa_tenor: "100",
      due_date: "2021-01-01",
      pd: "0.5%",
      lgd: "0.5%",
      ecl: 23624,
    },
    {
      key: "2",
      period: "2 Mei 2023",
      id: "Bunga Deposito Berjangka",
      counterpart: "Bank BCA",
      nominal: 100000000,
      principal: 100000000,
      sisa_tenor: "100",
      due_date: "2021-01-01",
      pd: "0.5%",
      lgd: "0.5%",
      ecl: 25679,
    },
  ];

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

      <Card className="mb-1">
        <Table
          columns={columns}
          dataSource={dataSource}
          summary={() => {
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>169.137</Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
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
